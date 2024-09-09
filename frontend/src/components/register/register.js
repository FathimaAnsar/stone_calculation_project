import React, { useState, useEffect } from 'react';
import { Table, Segment, Header, Button, Form, Icon } from 'semantic-ui-react';
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

    const handleEdit = (index) => {
        setEditingRowIndex(index);
    };

    const handleDelete = async (id) => {
        try {
            await connectionManager.deleteDesign(id);
            fetchDesigns(); // Refresh the data after deletion
        } catch (error) {
            console.error('Error deleting design', error);
        }
    };

    const handleRowChange = (index, field, value) => {
        const updatedData = [...data];
        updatedData[index] = { ...updatedData[index], [field]: value };
        setData(updatedData);
    };

    const handleStoneChange = (rowIndex, stoneIndex, field, value) => {
        const updatedData = [...data];
        const updatedStones = [...updatedData[rowIndex].stones_amnt];
        updatedStones[stoneIndex] = { ...updatedStones[stoneIndex], [field]: value };
        updatedData[rowIndex] = { ...updatedData[rowIndex], stones_amnt: updatedStones };
        setData(updatedData);
    };

    const saveChanges = async (index) => {
        try {
            const updatedDesign = data[index];
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

    const addNewRow = () => {
        setNewDesign({
            catCode: '',
            type: '',
            designCode: '',
            setCode: '',
            silver: '',
            stones: [{ type: '', size: '', quantity: '', id: 1 }]
        });
        setIsModalOpen(true);
    };

    const saveNewRow = async () => {
        try {
            await connectionManager.addDesign(newDesign);
            setNewDesign({
                catCode: '',
                type: '',
                designCode: '',
                setCode: '',
                silver: '',
                stones: [{ type: '', size: '', quantity: '', id: 1 }]
            });
            setIsModalOpen(false);
            fetchDesigns(); // Reload the table with the new design
        } catch (error) {
            console.error('Error adding design', error);
        }
    };

    const handleNewDesignChange = (field, value) => {
        setNewDesign({ ...newDesign, [field]: value });
    };

    const handleNewStoneChange = (index, field, value) => {
        const updatedStones = [...newDesign.stones];
        updatedStones[index] = { ...updatedStones[index], [field]: value };
        setNewDesign({ ...newDesign, stones: updatedStones });
    };

    return (
        <Segment className="dark-segment">
            <Header as="h1" textAlign="center" style={{ color: '#fff' }}>
                Design Register
            </Header>
            <Button
                icon
                labelPosition='left'
                onClick={addNewRow}
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
                        {data.map((item, rowIndex) => (
                            <Table.Row key={rowIndex}>
                                <Table.Cell data-label="Type">
                                    {editingRowIndex === rowIndex ? (
                                        <Form.Input
                                            value={item.type}
                                            onChange={(e) => handleRowChange(rowIndex, 'type', e.target.value)}
                                        />
                                    ) : (
                                        item.type
                                    )}
                                </Table.Cell>
                                <Table.Cell data-label="Category">
                                    {editingRowIndex === rowIndex ? (
                                        <Form.Input
                                            value={item.cat_code}
                                            onChange={(e) => handleRowChange(rowIndex, 'cat_code', e.target.value)}
                                        />
                                    ) : (
                                        item.cat_code
                                    )}
                                </Table.Cell>
                                <Table.Cell data-label="Design Code">
                                    {editingRowIndex === rowIndex ? (
                                        <Form.Input
                                            value={item.design_id}
                                            onChange={(e) => handleRowChange(rowIndex, 'design_id', e.target.value)}
                                        />
                                    ) : (
                                        item.design_id
                                    )}
                                </Table.Cell>
                                <Table.Cell data-label="Silver">
                                    {editingRowIndex === rowIndex ? (
                                        <Form.Input
                                            value={item.silver_quantity}
                                            onChange={(e) => handleRowChange(rowIndex, 'silver_quantity', e.target.value)}
                                        />
                                    ) : (
                                        item.silver_quantity
                                    )}
                                </Table.Cell>
                                {item.stones_amnt.map((stone, stoneIndex) => (
                                    <React.Fragment key={stoneIndex}>
                                        <Table.Cell data-label={`Stone ${stoneIndex + 1} Type`} className="stone-column">
                                            {editingRowIndex === rowIndex ? (
                                                <Form.Input
                                                    value={stone.type}
                                                    onChange={(e) => handleStoneChange(rowIndex, stoneIndex, 'type', e.target.value)}
                                                />
                                            ) : (
                                                stone.type
                                            )}
                                        </Table.Cell>
                                        <Table.Cell data-label={`Stone ${stoneIndex + 1} Size`} className="stone-column">
                                            {editingRowIndex === rowIndex ? (
                                                <Form.Input
                                                    value={stone.size}
                                                    onChange={(e) => handleStoneChange(rowIndex, stoneIndex, 'size', e.target.value)}
                                                />
                                            ) : (
                                                stone.size
                                            )}
                                        </Table.Cell>
                                        <Table.Cell data-label={`Stone ${stoneIndex + 1} Quantity`} className="stone-column">
                                            {editingRowIndex === rowIndex ? (
                                                <Form.Input
                                                    value={stone.quantity}
                                                    onChange={(e) => handleStoneChange(rowIndex, stoneIndex, 'quantity', e.target.value)}
                                                />
                                            ) : (
                                                stone.quantity
                                            )}
                                        </Table.Cell>
                                    </React.Fragment>
                                ))}
                                <Table.Cell className="edit-column fixed-column">
                                    {editingRowIndex === rowIndex ? (
                                        <div>
                                            <Button onClick={() => saveChanges(rowIndex)}>Save</Button>
                                            <Button onClick={cancelEdit}>Cancel</Button>
                                        </div>
                                    ) : (
                                        <Icon name='edit' onClick={() => handleEdit(rowIndex)} />
                                    )}
                                </Table.Cell>
                                <Table.Cell className="delete-column fixed-column">
                                    <Icon name='delete' onClick={() => handleDelete(item._id)} />
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
        </Segment>
    );
};

export default DesignRegisterTable;
