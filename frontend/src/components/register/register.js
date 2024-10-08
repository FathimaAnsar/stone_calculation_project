import React, { useState, useEffect } from 'react';
import { Segment, Header, Button, Icon, Table, Modal, Form, Dropdown } from 'semantic-ui-react';
import ConnectionManager from '../connections'; // Ensure you import your ConnectionManager
import './register.css'

const DesignRegisterTable = () => {
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newDesign, setNewDesign] = useState({
        catCode: '',
        type: '',
        designCode: '',
        setCode: '',
        silver: '',
        stones: [{ type: '', size: '', quantity: '', id: 1 }]
    });
    const [editingRowIndex, setEditingRowIndex] = useState(null);
    const connectionManager = new ConnectionManager();

    const fetchDesigns = async () => {
        try {
            const response = await connectionManager.getAllDesigns();
            const sortedData = response.sort((a, b) => {
                const setA = parseInt(a.set_id, 10) || 0;
                const setB = parseInt(b.set_id, 10) || 0;
                return setA - setB;
            });
            setData(sortedData || []);
        } catch (error) {
            console.error('Error fetching data', error);
        }
    };

    useEffect(() => {
        fetchDesigns();
    }, []);

    const fillData = [...data];
    while (fillData.length < 3) {
        fillData.push({
            cat_code: '',
            type: '',
            design_id: '',
            set_id: '',
            silver_quantity: '',
            stones_amnt: Array(10).fill({ type: '', size: '', quantity: '' })
        });
    }

    const stonesOptions = [
        { key: 'blue-topaz', value: 'Blue Topaz', text: 'Blue Topaz' },
        { key: 'white-topaz', value: 'White Topaz', text: 'White Topaz' },
        { key: 'chrome-diopside', value: 'Chrome Diopside', text: 'Chrome Diopside' },
        { key: 'garnet', value: 'Garnet', text: 'Garnet' },
        { key: 'peridot', value: 'Peridot', text: 'Peridot' },
        { key: 'sapphire', value: 'Sapphire', text: 'Sapphire' },
        { key: 'moonstone', value: 'Moonstone', text: 'Moonstone' }
    ];

    const typeOptions = [
        { key: 'ring', value: 'Ring', text: 'Ring' },
        { key: 'pendant', value: 'Pendant', text: 'Pendant' },
        { key: 'earring', value: 'Earring', text: 'Earring' }
    ];

    const designCodes = {
        Ring: 'FGCMSRS',
        Pendant: 'FGCMSPS',
        Earring: 'FGCMSES'
    };

    const openModal = (index) => {
        if (index !== undefined) {
            setEditingRowIndex(index);
            setNewDesign({
                catCode: data[index].cat_code || '',
                type: data[index].type || '',
                designCode: data[index].design_id || '',
                setCode: data[index].set_id || '',
                silver: data[index].silver_quantity || '',
                stones: data[index].stones_amnt || []
            });
        } else {
            setEditingRowIndex(null);
            setNewDesign({
                catCode: '',
                type: '',
                designCode: '',
                setCode: '',
                silver: '',
                stones: [{ type: '', size: '', quantity: '', id: 1 }]
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const handleInputChange = (e, { name, value }) => {
        setNewDesign({ ...newDesign, [name]: value });
    };

    const handleTypeChange = (e, { value }) => {
        setNewDesign({
            ...newDesign,
            type: value,
            designCode: designCodes[value] || ''
        });
    };

    const handleStonesChange = (index, field, value) => {
        const updatedStones = [...newDesign.stones];
        updatedStones[index] = { ...updatedStones[index], [field]: value };
        setNewDesign({ ...newDesign, stones: updatedStones });
    };

    const addStoneField = () => {
        if (newDesign.stones.length < 10) {
            const newStone = { type: '', size: '', quantity: '', id: newDesign.stones.length + 1 };
            setNewDesign({ ...newDesign, stones: [...newDesign.stones, newStone] });
        }
    };

    const saveDesign = async () => {
        try {
            const designToSave = {
                cat_code: newDesign.catCode,
                design_id: newDesign.designCode,
                set_id: newDesign.setCode,
                type: newDesign.type,
                stones_amnt: newDesign.stones.map(stone => ({
                    type: stone.type,
                    size: stone.size,
                    quantity: stone.quantity
                })),
                silver_quantity: newDesign.silver
            };

            if (editingRowIndex !== null) {
                await connectionManager.updateDesign(data[editingRowIndex]._id, designToSave);
            } else {
                await connectionManager.addDesign(designToSave);
            }

            fetchDesigns(); // Reload data from the database after adding or updating a design
            closeModal();
        } catch (error) {
            console.error('Error saving design', error);
        }
    };

    const handleEdit = (index) => {
        openModal(index);
    };

    const handleDelete = async (id) => {
        try {
            await connectionManager.deleteDesign(id);
            setData(data.filter(item => item._id !== id));
        } catch (error) {
            console.error('Error deleting design', error);
        }
    };

    return (
        <Segment className="dark-segment">
            <Header as="h1" textAlign="center" style={{ color: '#fff' }}>
                Design Register
            </Header>
            <Button
                icon
                labelPosition='left'
                onClick={() => openModal()}
                style={{ marginBottom: '10px' }}
            >
                <Icon name='plus' />
                Add Design
            </Button>
            <div className="table-wrapper">
                <div className="table-scrollable">
                    <Table celled className="dark-table">
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell rowSpan="2">Type</Table.HeaderCell>
                                <Table.HeaderCell rowSpan="2">Category</Table.HeaderCell> {/* Added Category column */}
                                <Table.HeaderCell rowSpan="2">Design Code</Table.HeaderCell>
                                <Table.HeaderCell rowSpan="2">Silver</Table.HeaderCell>
                                {[...Array(10)].map((_, index) => (
                                    <Table.HeaderCell key={index} colSpan="3">{`Stone ${index + 1}`}</Table.HeaderCell>
                                ))}
                                <Table.HeaderCell className="edit-column fixed-column">Edit</Table.HeaderCell>
                                <Table.HeaderCell className="delete-column fixed-column">Delete</Table.HeaderCell>
                            </Table.Row>
                            <Table.Row>
                                {[...Array(10)].map((_, index) => (
                                    <React.Fragment key={index}>
                                        <Table.HeaderCell className="stone-column">Type</Table.HeaderCell>
                                        <Table.HeaderCell className="stone-column">Size</Table.HeaderCell>
                                        <Table.HeaderCell className="stone-column">Quantity</Table.HeaderCell>
                                    </React.Fragment>
                                ))}
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {fillData.map((item, rowIndex) => (
                                <Table.Row key={rowIndex}>
                                    <Table.Cell data-label="Type">{item.type || ''}</Table.Cell>
                                    <Table.Cell data-label="Category">{item.cat_code || ''}</Table.Cell>
                                    <Table.Cell
                                        data-label="Design Code">{`${item.design_id || ''}-${item.set_id || ''}`}</Table.Cell>
                                    <Table.Cell data-label="Silver">{item.silver_quantity || ''}</Table.Cell>
                                    {item.stones_amnt.map((stone, stoneIndex) => (
                                        <React.Fragment key={stoneIndex}>
                                            <Table.Cell data-label={`Stone ${stoneIndex + 1} Type`}
                                                        className="stone-column">
                                                {stone.type || ''}
                                            </Table.Cell>
                                            <Table.Cell data-label={`Stone ${stoneIndex + 1} Size`}
                                                        className="stone-column">
                                                {stone.size || ''}
                                            </Table.Cell>
                                            <Table.Cell data-label={`Stone ${stoneIndex + 1} Quantity`}
                                                        className="stone-column">
                                                {stone.quantity || ''}
                                            </Table.Cell>
                                        </React.Fragment>
                                    ))}
                                    <Table.Cell className="edit-column fixed-column">
                                        <Icon name='edit' onClick={() => handleEdit(rowIndex)}/>
                                    </Table.Cell>
                                    <Table.Cell className="delete-column">
                                        <Icon name='delete' onClick={() => handleDelete(item._id)} />
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div>
            </div>

            <Modal open={isModalOpen} onClose={closeModal} size='large'>
                <Modal.Header>
                    {editingRowIndex !== null ? 'Edit Design' : 'Add Design'}
                </Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field>
                            <label>Category Code</label>
                            <input
                                name="catCode"
                                value={newDesign.catCode}
                                onChange={(e) => handleInputChange(e, { name: 'catCode', value: e.target.value })}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Type</label>
                            <Dropdown
                                selection
                                options={typeOptions}
                                value={newDesign.type}
                                onChange={handleTypeChange}
                                placeholder='Select Type'
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Design Code</label>
                            <input
                                name="designCode"
                                value={newDesign.designCode}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Set Code</label>
                            <input
                                name="setCode"
                                value={newDesign.setCode}
                                placeholder={"001"}
                                onChange={(e) => handleInputChange(e, { name: 'setCode', value: e.target.value })}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Silver</label>
                            <input
                                name="silver"
                                value={newDesign.silver}
                                onChange={(e) => handleInputChange(e, { name: 'silver', value: e.target.value })}
                            />
                        </Form.Field>
                        <Header as='h3'>Stones</Header>
                        {newDesign.stones.map((stone, index) => (
                            <Form.Group key={index}>
                                <Form.Field>
                                    <label>Type</label>
                                    <Dropdown
                                        selection
                                        options={stonesOptions}
                                        value={stone.type}
                                        onChange={(e, { value }) => handleStonesChange(index, 'type', value)}
                                        placeholder='Select Stone Type'
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Size</label>
                                    <input
                                        value={stone.size}
                                        onChange={(e) => handleStonesChange(index, 'size', e.target.value)}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Quantity</label>
                                    <input
                                        type="number"
                                        value={stone.quantity}
                                        onChange={(e) => handleStonesChange(index, 'quantity', e.target.value)}
                                    />
                                </Form.Field>
                            </Form.Group>
                        ))}
                        <Button
                            type='button'
                            icon
                            labelPosition='left'
                            onClick={addStoneField}
                            style={{ marginBottom: '10px' }}
                        >
                            <Icon name='plus' />
                            Add Stone
                        </Button>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={closeModal}>Cancel</Button>
                    <Button
                        onClick={saveDesign}
                        primary
                    >
                        Save
                    </Button>
                </Modal.Actions>
            </Modal>
        </Segment>
    );
};

export default DesignRegisterTable;
