import React, { useState, useEffect } from 'react';
import { Segment, Header, Button, Icon, Table, Modal, Form, Dropdown } from 'semantic-ui-react';
import ConnectionManager from '../connections'; // Ensure you import your ConnectionManager

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
    const [editingDesignId, setEditingDesignId] = useState(null);  // Use design _id instead of row index
    const connectionManager = new ConnectionManager();

    // Fetch designs from the backend and populate the table
    const fetchDesigns = async () => {
        try {
            const response = await connectionManager.getAllDesigns();
            const sortedData = response.sort((a, b) => a.design_id.localeCompare(b.design_id));
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
            _id: '', // Ensure there's a valid _id for each row
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

    // Open modal for editing or adding a new design
    const openModal = (design = null) => {
        if (design) {
            setEditingDesignId(design._id);  // Track the ID of the design being edited
            setNewDesign({
                catCode: design.cat_code || '',
                type: design.type || '',
                designCode: design.design_id || '',
                setCode: design.set_id || '',
                silver: design.silver_quantity || '',
                stones: design.stones_amnt || []
            });
        } else {
            setEditingDesignId(null);
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

    // Save or update design based on whether editingDesignId is set
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

            if (editingDesignId) {
                // Edit existing design
                await connectionManager.updateDesign(editingDesignId, designToSave);
            } else {
                // Add new design
                await connectionManager.addDesign(designToSave);
            }

            fetchDesigns(); // Reload data from the database after adding or updating a design
            closeModal();
        } catch (error) {
            console.error('Error saving design', error);
        }
    };

    // Handle edit by passing design object
    const handleEdit = (design) => {
        openModal(design);
    };

    // Correctly delete the design by using the proper ID
    const handleDelete = async (id) => {
        try {
            await connectionManager.deleteDesign(id);
            setData(data.filter(item => item._id !== id)); // Remove deleted design from the table
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
                        {fillData.map((item) => (
                            <Table.Row key={item._id || item.design_id}>
                                <Table.Cell data-label="Type">{item.type || ''}</Table.Cell>
                                <Table.Cell data-label="Category">{item.cat_code || ''}</Table.Cell>
                                <Table.Cell data-label="Design Code">{`${item.design_id || ''}-${item.set_id || ''}`}</Table.Cell>
                                <Table.Cell data-label="Silver">{item.silver_quantity || ''}</Table.Cell>
                                {item.stones_amnt.map((stone, stoneIndex) => (
                                    <React.Fragment key={stoneIndex}>
                                        <Table.Cell data-label={`Stone ${stoneIndex + 1} Type`} className="stone-column">
                                            {stone.type || ''}
                                        </Table.Cell>
                                        <Table.Cell data-label={`Stone ${stoneIndex + 1} Size`} className="stone-column">
                                            {stone.size || ''}
                                        </Table.Cell>
                                        <Table.Cell data-label={`Stone ${stoneIndex + 1} Quantity`} className="stone-column">
                                            {stone.quantity || ''}
                                        </Table.Cell>
                                    </React.Fragment>
                                ))}
                                <Table.Cell className="edit-column fixed-column">
                                    <Icon name='edit' onClick={() => handleEdit(item)} />
                                </Table.Cell>
                                <Table.Cell className="delete-column">
                                    <Icon name='delete' onClick={() => handleDelete(item._id)} />
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>

            <Modal open={isModalOpen} onClose={closeModal}>
                <Modal.Header>{editingDesignId !== null ? 'Edit Design' : 'Add New Design'}</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Input
                            label='Category Code'
                            name='catCode'
                            value={newDesign.catCode}
                            onChange={handleInputChange}
                        />
                        <Form.Input
                            label='Design Code'
                            name='designCode'
                            value={newDesign.designCode}
                            onChange={handleInputChange}
                        />
                        <Form.Input
                            label='Set Code'
                            name='setCode'
                            value={newDesign.setCode}
                            onChange={handleInputChange}
                        />
                        <Form.Input
                            label='Silver Quantity'
                            name='silver'
                            value={newDesign.silver}
                            onChange={handleInputChange}
                        />
                        {newDesign.stones.map((stone, index) => (
                            <Segment key={index}>
                                <Form.Group widths='equal'>
                                    <Form.Dropdown
                                        label={`Stone ${index + 1} Type`}
                                        placeholder='Select Stone Type'
                                        name='type'
                                        value={stone.type}
                                        onChange={(e, { value }) => handleStonesChange(index, 'type', value)}
                                        options={stonesOptions}
                                    />
                                    <Form.Input
                                        label='Size'
                                        name='size'
                                        value={stone.size}
                                        onChange={(e, { value }) => handleStonesChange(index, 'size', value)}
                                    />
                                    <Form.Input
                                        label='Quantity'
                                        name='quantity'
                                        value={stone.quantity}
                                        onChange={(e, { value }) => handleStonesChange(index, 'quantity', value)}
                                    />
                                </Form.Group>
                            </Segment>
                        ))}
                        <Button onClick={addStoneField} style={{ marginTop: '10px' }}>
                            <Icon name='plus' /> Add Stone
                        </Button>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={saveDesign} primary>
                        Save
                    </Button>
                    <Button onClick={closeModal}>Cancel</Button>
                </Modal.Actions>
            </Modal>
        </Segment>
    );
};

export default DesignRegisterTable;
