import React, { useState, useEffect } from 'react';
import { Table, Segment, Header, Button, Form, Icon, Modal, Dropdown } from 'semantic-ui-react';
import ConnectionManager from '../connections';
import './register.css';

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
    const [editDesign, setEditDesign] = useState(null);
    const connectionManager = new ConnectionManager();

    useEffect(() => {
        fetchDesigns();
    }, []);

    const fetchDesigns = async () => {
        try {
            const response = await connectionManager.getAllDesigns();
            const sortedData = response.sort((a, b) => a.design_id.localeCompare(b.design_id));
            setData(sortedData || []);
        } catch (error) {
            console.error('Error fetching data', error);
        }
    };

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

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setNewDesign({
            catCode: '',
            type: '',
            designCode: '',
            setCode: '',
            silver: '',
            stones: [{ type: '', size: '', quantity: '', id: 1 }]
        });
    };

    const handleInputChange = (e, { name, value }) => {
        if (editingRowIndex === null) {
            setNewDesign({ ...newDesign, [name]: value });
        } else {
            setEditDesign({ ...editDesign, [name]: value });
        }
    };

    const handleStonesChange = (index, field, value) => {
        const updatedStones = editingRowIndex === null ? [...newDesign.stones] : [...editDesign.stones_amnt];
        updatedStones[index] = { ...updatedStones[index], [field]: value };
        if (editingRowIndex === null) {
            setNewDesign({ ...newDesign, stones: updatedStones });
        } else {
            setEditDesign({ ...editDesign, stones_amnt: updatedStones });
        }
    };

    const addStoneField = () => {
        if (newDesign.stones.length < 10) {
            const newStone = { type: '', size: '', quantity: '', id: newDesign.stones.length + 1 };
            setNewDesign({ ...newDesign, stones: [...newDesign.stones, newStone] });
        }
    };

    const addDesign = async () => {
        try {
            const designToAdd = {
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

            await connectionManager.addDesign(designToAdd);
            fetchDesigns(); // Reload data from the database after adding a design
            closeModal();
        } catch (error) {
            console.error('Error adding design', error);
        }
    };

    const handleEdit = (index) => {
        setEditingRowIndex(index);
        setEditDesign({ ...data[index] });
    };

    const handleRowChange = (field, value) => {
        const updatedData = [...data];
        updatedData[editingRowIndex] = { ...updatedData[editingRowIndex], [field]: value };
        setData(updatedData);
    };

    const saveChanges = async () => {
        try {
            const updatedDesign = {
                ...editDesign,
                stones_amnt: editDesign.stones_amnt.map(stone => ({
                    type: stone.type,
                    size: stone.size,
                    quantity: stone.quantity
                }))
            };
            await connectionManager.updateDesign(updatedDesign._id, updatedDesign);
            setEditingRowIndex(null); // Stop editing mode after save
            fetchDesigns(); // Refresh the data
        } catch (error) {
            console.error('Error saving changes', error);
        }
    };

    const cancelEdit = () => {
        setEditingRowIndex(null);
        fetchDesigns(); // Reload original data to cancel changes
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
                onClick={openModal}
                style={{ marginBottom: '10px' }}
            >
                <Icon name='plus' />
                Add Design
            </Button>
            <div className="table-wrapper">
                <Table celled className="dark-table">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell rowSpan="2">Type</Table.HeaderCell>
                            <Table.HeaderCell rowSpan="2">Category</Table.HeaderCell>
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
                                <Table.Cell data-label="Type">
                                    {editingRowIndex === rowIndex ? (
                                        <Form.Input
                                            value={editDesign.type}
                                            onChange={(e) => handleRowChange('type', e.target.value)}
                                        />
                                    ) : (
                                        item.type
                                    )}
                                </Table.Cell>
                                <Table.Cell data-label="Category">
                                    {editingRowIndex === rowIndex ? (
                                        <Form.Input
                                            value={editDesign.cat_code}
                                            onChange={(e) => handleRowChange('cat_code', e.target.value)}
                                        />
                                    ) : (
                                        item.cat_code
                                    )}
                                </Table.Cell>
                                <Table.Cell data-label="Design Code">
                                    {editingRowIndex === rowIndex ? (
                                        <Form.Input
                                            value={editDesign.design_id}
                                            onChange={(e) => handleRowChange('design_id', e.target.value)}
                                        />
                                    ) : (
                                        item.design_id
                                    )}
                                </Table.Cell>
                                <Table.Cell data-label="Silver">
                                    {editingRowIndex === rowIndex ? (
                                        <Form.Input
                                            value={editDesign.silver_quantity}
                                            onChange={(e) => handleRowChange('silver_quantity', e.target.value)}
                                        />
                                    ) : (
                                        item.silver_quantity
                                    )}
                                </Table.Cell>
                                {item.stones_amnt.map((stone, stoneIndex) => (
                                    <React.Fragment key={stoneIndex}>
                                        <Table.Cell data-label={`Stone ${stoneIndex + 1} Type`} className="stone-column">
                                            {editingRowIndex === rowIndex ? (
                                                <Dropdown
                                                    placeholder="Select Stones"
                                                    fluid
                                                    search
                                                    selection
                                                    options={stonesOptions}
                                                    value={editDesign.stones_amnt[stoneIndex].type}
                                                    onChange={(e, { value }) => handleStonesChange(stoneIndex, 'type', value)}
                                                />
                                            ) : (
                                                stone.type
                                            )}
                                        </Table.Cell>
                                        <Table.Cell data-label={`Stone ${stoneIndex + 1} Size`} className="stone-column">
                                            {editingRowIndex === rowIndex ? (
                                                <Form.Input
                                                    value={editDesign.stones_amnt[stoneIndex].size}
                                                    onChange={(e) => handleStonesChange(stoneIndex, 'size', e.target.value)}
                                                />
                                            ) : (
                                                stone.size
                                            )}
                                        </Table.Cell>
                                        <Table.Cell data-label={`Stone ${stoneIndex + 1} Quantity`} className="stone-column">
                                            {editingRowIndex === rowIndex ? (
                                                <Form.Input
                                                    value={editDesign.stones_amnt[stoneIndex].quantity}
                                                    onChange={(e) => handleStonesChange(stoneIndex, 'quantity', e.target.value)}
                                                />
                                            ) : (
                                                stone.quantity
                                            )}
                                        </Table.Cell>
                                    </React.Fragment>
                                ))}
                                <Table.Cell className="edit-column">
                                    {editingRowIndex === rowIndex ? (
                                        <Button icon="save" color="green" onClick={saveChanges} />
                                    ) : (
                                        <Button icon="edit" onClick={() => handleEdit(rowIndex)} />
                                    )}
                                </Table.Cell>
                                <Table.Cell className="delete-column">
                                    <Button icon="delete" color="red" onClick={() => handleDelete(item._id)} />
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>

            <Modal open={isModalOpen} onClose={closeModal} size="large">
                <Modal.Header>Add New Design</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field>
                            <label>Category Code</label>
                            <Form.Input
                                name="catCode"
                                value={newDesign.catCode}
                                onChange={handleInputChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Design Code</label>
                            <Form.Input
                                name="designCode"
                                value={newDesign.designCode}
                                onChange={handleInputChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Set Code</label>
                            <Form.Input
                                name="setCode"
                                value={newDesign.setCode}
                                onChange={handleInputChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Type</label>
                            <Form.Input
                                name="type"
                                value={newDesign.type}
                                onChange={handleInputChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Silver Quantity</label>
                            <Form.Input
                                name="silver"
                                value={newDesign.silver}
                                onChange={handleInputChange}
                            />
                        </Form.Field>
                        {newDesign.stones.map((stone, index) => (
                            <Segment key={stone.id}>
                                <Form.Field>
                                    <label>Stone {index + 1} Type</label>
                                    <Dropdown
                                        placeholder="Select Stone Type"
                                        fluid
                                        search
                                        selection
                                        options={stonesOptions}
                                        value={stone.type}
                                        onChange={(e, { value }) => handleStonesChange(index, 'type', value)}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Stone {index + 1} Size</label>
                                    <Form.Input
                                        value={stone.size}
                                        onChange={(e) => handleStonesChange(index, 'size', e.target.value)}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Stone {index + 1} Quantity</label>
                                    <Form.Input
                                        value={stone.quantity}
                                        onChange={(e) => handleStonesChange(index, 'quantity', e.target.value)}
                                    />
                                </Form.Field>
                            </Segment>
                        ))}
                        <Button onClick={addStoneField} icon="plus" color="blue">
                            Add Stone
                        </Button>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={closeModal} color="black">
                        Cancel
                    </Button>
                    <Button
                        onClick={addDesign}
                        content="Add Design"
                        labelPosition="right"
                        icon="checkmark"
                        color="green"
                    />
                </Modal.Actions>
            </Modal>
        </Segment>
    );
};

export default DesignRegisterTable;
