import React, { useState, useEffect } from 'react';
import { Table, Segment, Header, Button, Icon, Form } from 'semantic-ui-react';
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

    const handleDelete = async (id) => {
        try {
            await connectionManager.deleteDesign(id); // Assuming deleteDesign is a method in your ConnectionManager
            fetchDesigns(); // Reload the data after deletion
        } catch (error) {
            console.error('Error deleting design', error);
        }
    };

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

    // Track changes for individual stones in the new row
    const handleNewStoneChange = (stoneIndex, field, value) => {
        const updatedStones = [...newRowData.stones];
        updatedStones[stoneIndex] = { ...updatedStones[stoneIndex], [field]: value };
        setNewRowData({ ...newRowData, stones: updatedStones });
    };

    // Add a new editable row to the table
    const addNewRow = () => {
        setNewRowData({
            type: '',
            catCode: '',
            designCode: '',
            silver: '',
            stones: [...Array(10)].map(() => ({ type: '', size: '', quantity: '' })),
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
                                <Table.Cell data-label="Type">{item.type || ''}</Table.Cell>
                                <Table.Cell data-label="Category">{item.cat_code || ''}</Table.Cell>
                                <Table.Cell data-label="Design Code">
                                    {`${item.design_id || ''}${item.set_id ? `-${item.set_id}` : ''}`}
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
                                    <Icon name='edit' onClick={() => setEditingRowIndex(rowIndex)} />
                                </Table.Cell>
                                <Table.Cell className="delete-column">
                                    <Icon name='delete' onClick={() => handleDelete(item._id)} />
                                </Table.Cell>
                            </Table.Row>
                        ))}

                        {/* Row for adding a new design */}
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

                                {newRowData.stones.map((stone, stoneIndex) => (
                                    <React.Fragment key={stoneIndex}>
                                        <Table.Cell>
                                            <Form.Input
                                                value={stone.type}
                                                onChange={(e) => handleNewStoneChange(stoneIndex, 'type', e.target.value)}
                                            />
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Form.Input
                                                value={stone.size}
                                                onChange={(e) => handleNewStoneChange(stoneIndex, 'size', e.target.value)}
                                            />
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Form.Input
                                                value={stone.quantity}
                                                onChange={(e) => handleNewStoneChange(stoneIndex, 'quantity', e.target.value)}
                                            />
                                        </Table.Cell>
                                    </React.Fragment>
                                ))}
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
