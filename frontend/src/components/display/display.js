import React, { useState, useEffect } from 'react';
import './display.css';

const Display = ({ formData }) => {
    const [tableData, setTableData] = useState([
        { material: '', size: '', quantity: '' },
        { material: '', size: '', quantity: '' },
        { material: '', size: '', quantity: '' },
    ]);

    useEffect(() => {
        if (formData && formData.length > 0) {
            setTableData((prevData) => {
                // Update table data with formData, limiting the updates to the length of tableData
                return prevData.map((row, index) =>
                    formData[index] ? { ...formData[index] } : row
                );
            });
        }
    }, [formData]);

    return (

            <div className="Display">
                <table>
                    <thead>
                    <tr>
                        <th>Material</th>
                        <th>Size</th>
                        <th>Quantity</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tableData.map((row, index) => (
                        <tr key={index}>
                            <td>{row.material || ''}</td>
                            <td>{row.size || ''}</td>
                            <td>{row.quantity || ''}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
    );
};

export default Display;
