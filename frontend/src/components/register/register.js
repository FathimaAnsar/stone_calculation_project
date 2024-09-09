import React, { useState, useEffect } from 'react';
import { Table, Segment, Header, Button, Form, Icon } from 'semantic-ui-react';
import ConnectionManager from '../connections';
import './register.css';

const DesignRegisterTable = () => {
    const [data, setData] = useState([]);
    const [editingRowIndex, setEditingRowIndex] = useState(null);
    const [newRowData, setNewRowData] = useState(null); // For adding a new design
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

    // Track changes in the row being edited
    const handleRowChange = (index, field, value) => {
        const updatedData = [...data];
        updatedData[index] = { ...updatedData[index], [field]: value };
        setData(updatedData);
    };

    // Track changes for the new row
    const handleNewRowChange = (field, value) => {
        setNewRowData({ ...newRowData, [field]: value });
    };

    // Save changes to the edited row
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

    // Cancel edit mode without saving
    const cancelEdit = () => {
        setEditingRowIndex(null);
        fetchDesigns(); // Reload original data to cancel changes
    };

    // Add a new editable row to the table
    const addNewRow = () => {
        setNewRowData({
            catCode: '',
            type: '',
            designCode: '',
            setCode: '',
            silver: '',
            stones: [{ type: '', size: '', quantity: '', id: 1 }],
        });
    };

    // Save the new design
    const saveNewRow = async () => {
        try {
            await connectionManager.addDesign(newRowData);
            setNewRowData(null); // Reset new row state
            fetchDesigns(); // Reload the table with the new design
        } catch (error) {
            console.error('Error adding design', error);
        }
    };

    return (
        <Segment className="dark-segment">
            <Header as="h1" textAlign="center" style={{color: '#fff'}}>
                Design Register
            </Header>

            <Button icon labelPosition='left' onClick={addNewRow} style={{ marginBottom: '10px' }}>
                <Icon name='plus'/> Add Design
            </Button>

            <div className="table-wrapper">
                <Table celled className="dark-table">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Type</Table.HeaderCell>
                            <Table.HeaderCell>Category</Table.HeaderCell>
                            <Table.HeaderCell>Design Code</Table.HeaderCell>
                            <Table.HeaderCell>Silver</Table.HeaderCell>
                            <Table.HeaderCell>Edit</Table.HeaderCell>
                            <Table.HeaderCell>Delete</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {data.map((item, index) => (
                            <Table.Row key={index}>
                                <Table.Cell>
                                    {editingRowIndex === index ? (
                                        <Form.Input
                                            value={item.type}
                                            onChange={(e) => handleRowChange(index, 'type', e.target.value)}
                                        />
                                    ) : (
                                        item.type
                                    )}
                                </Table.Cell>
                                <Table.Cell>
                                    {editingRowIndex === index ? (
                                        <Form.Input
                                            value={item.cat_code}
                                            onChange={(e) => handleRowChange(index, 'cat_code', e.target.value)}
                                        />
                                    ) : (
                                        item.cat_code
                                    )}
                                </Table.Cell>
                                <Table.Cell>
                                    {editingRowIndex === index ? (
                                        <Form.Input
                                            value={item.design_id}
                                            onChange={(e) => handleRowChange(index, 'design_id', e.target.value)}
                                        />
                                    ) : (
                                        item.design_id
                                    )}
                                </Table.Cell>
                                <Table.Cell>
                                    {editingRowIndex === index ? (
                                        <Form.Input
                                            value={item.silver_quantity}
                                            onChange={(e) => handleRowChange(index, 'silver_quantity', e.target.value)}
                                        />
                                    ) : (
                                        item.silver_quantity
                                    )}
                                </Table.Cell>
                                <Table.Cell>
                                    {editingRowIndex === index ? (
                                        <div>
                                            <Button onClick={() => saveChanges(index)}>Save</Button>
                                            <Button onClick={cancelEdit}>Cancel</Button>
                                        </div>
                                    ) : (
                                        <Icon name='edit' onClick={() => setEditingRowIndex(index)} />
                                    )}
                                </Table.Cell>
                                <Table.Cell>
                                    <Icon name='delete' onClick={() => handleDelete(item._id)} />
                                </Table.Cell>
                            </Table.Row>
                        ))}

                        {/* New row for adding a design */}
                        {newRowData && (
                            <Table.Row>
                                <Table.Cell>
                                    <Form.Input
                                        value={newRowData.type}
                                        onChange={(e) => handleNewRowChange('type', e.target.value)}
                                    />
                                </Table.Cell>
                                <Table.Cell>
                                    <Form.Input
                                        value={newRowData.catCode}
                                        onChange={(e) => handleNewRowChange('catCode', e.target.value)}
                                    />
                                </Table.Cell>
                                <Table.Cell>
                                    <Form.Input
                                        value={newRowData.designCode}
                                        onChange={(e) => handleNewRowChange('designCode', e.target.value)}
                                    />
                                </Table.Cell>
                                <Table.Cell>
                                    <Form.Input
                                        value={newRowData.silver}
                                        onChange={(e) => handleNewRowChange('silver', e.target.value)}
                                    />
                                </Table.Cell>
                                <Table.Cell>
                                    <Button onClick={saveNewRow}>Save</Button>
                                </Table.Cell>
                                <Table.Cell>
                                    <Button onClick={() => setNewRowData(null)}>Cancel</Button>
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            </div>
        </Segment>
    );
};

export default DesignRegisterTable;
