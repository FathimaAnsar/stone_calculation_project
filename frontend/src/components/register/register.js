import React, { useEffect, useState } from 'react';
import { Table, Segment, Header, Button, Modal, Form, Icon, Dropdown } from 'semantic-ui-react';
import ConnectionManager from '../connections';
import './register.css';

const DesignRegisterTable = () => {
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newDesign, setNewDesign] = useState({
        catCode:'',
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
            const sortedData = response.sort((a, b) => a.design_id.localeCompare(b.design_id));
            setData(sortedData || []);
        } catch (error) {
            console.error('Error fetching data', error);
        }
    };

    useEffect(() => {
        fetchDesigns();
    }, []);

    useEffect(() => {
        if (editingRowIndex !== null) {
            const selectedDesign = data[editingRowIndex];
            setNewDesign({
                catCode: selectedDesign.cat_code || '',
                type: selectedDesign.type || '',
                designCode: selectedDesign.design_id || '',
                setCode: selectedDesign.set_id || '',
                silver: selectedDesign.silver_quantity || '',
                stones: selectedDesign.stones_amnt.map((stone, i) => ({
                    type: stone.type || '',
                    size: stone.size || '',
                    quantity: stone.quantity || '',
                    id: i + 1
                }))
            });
        }
    }, [editingRowIndex]); // Update when editingRowIndex changes

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingRowIndex(null); // Reset the index to indicate adding mode
        // Reset the form when closing the modal
        setNewDesign({
            catCode:'',
            type: '',
            designCode: '',
            setCode: '',
            silver: '',
            stones: [{ type: '', size: '', quantity: '', id: 1 }]
        });
    };

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

    const addOrUpdateDesign = async () => {
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
                // Update existing design
                await connectionManager.updateDesign(data[editingRowIndex]._id, designToSave);
            } else {
                // Add new design
                await connectionManager.addDesign(designToSave);
            }

            fetchDesigns(); // Reload data from the database after adding or editing a design
            closeModal();
        } catch (error) {
            console.error('Error adding/updating design', error);
        }
    };

    const handleEdit = (index) => {
        setEditingRowIndex(index); // Set the editing row index
        openModal(); // Open the modal
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
            <Header as="h1" textAlign="center" style={{color: '#fff'}}>
                Design Register
            </Header>
            <Button
                icon
                labelPosition='left'
                onClick={openModal}
                style={{marginBottom: '10px'}}
            >
                <Icon name='plus'/>
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
                        {data.map((item, rowIndex) => (
                            <Table.Row key={rowIndex}>
                                <Table.Cell data-label="Type">{item.type || ''}</Table.Cell>
                                <Table.Cell data-label="Category">{item.cat_code || ''}</Table.Cell>
                                <Table.Cell data-label="Design Code">
                                    {`${item.design_id || ''}-${item.set_id || ''}`}
                                </Table.Cell>
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
                                    <Icon name='edit' onClick={() => handleEdit(rowIndex)}/>
                                </Table.Cell>
                                <Table.Cell className="delete-column">
                                    <Icon name='delete' onClick={() => handleDelete(item._id)}/>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>

            <Modal open={isModalOpen} onClose={closeModal}>
                <Modal.Header>{editingRowIndex !== null ? 'Edit Design' : 'Add New Design'}</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Input
                            label='Category'
                            name='catCode'
                            value={newDesign.catCode}
                            onChange={handleInputChange}
                        />
                        <Form.Input
                            label='Type'
                            name='type'
                            value={newDesign.type}
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
                            label='Silver'
                            name='silver'
                            value={newDesign.silver}
                            onChange={handleInputChange}
                        />
                        {newDesign.stones.map((stone, index) => (
                            <div key={index}>
                                <Dropdown
                                    label={`Stone ${index + 1}`}
                                    placeholder="Select Stones"
                                    fluid
                                    search
                                    selection
                                    options={stonesOptions}
                                    value={stone.type}
                                    onChange={(e, {value}) => handleStonesChange(index, 'type', value)}
                                    closeOnChange={true}
                                />
                                <Form.Input
                                    label={`Stone ${index + 1} Size`}
                                    value={stone.size}
                                    onChange={(e) => handleStonesChange(index, 'size', e.target.value)}
                                />
                                <Form.Input
                                    label={`Stone ${index + 1} Quantity`}
                                    value={stone.quantity}
                                    onChange={(e) => handleStonesChange(index, 'quantity', e.target.value)}
                                />
                            </div>
                        ))}
                        {newDesign.stones.length < 10 && (
                            <Button type='button' onClick={addStoneField} icon>
                                <Icon name='plus'/> Add Stone
                            </Button>
                        )}
                        <Button type='submit' onClick={addOrUpdateDesign}>
                            {editingRowIndex !== null ? 'Update Design' : 'Submit'}
                        </Button>
                    </Form>
                </Modal.Content>
            </Modal>
        </Segment>
    );
};

export default DesignRegisterTable;
