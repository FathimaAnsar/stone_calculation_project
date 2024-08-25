import './form.css';
import React, { useState, useEffect } from 'react';
import { Dropdown, Input, Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

function InputForm() {
    const [designField, setDesignField] = useState([
        { id: 1, designCode: '', quantity: '', stones: [] }
    ]);
    const [lastFormFilled, setLastFormFilled] = useState(false);

    const designCodes = [
        { key: '001', value: 'CSR/P/E - 001', text: 'CSR/P/E - 001' },
        { key: '002', value: 'CSR/P/E - 002', text: 'CSR/P/E - 002' },
        { key: '003', value: 'CSR/P/E - 003', text: 'CSR/P/E - 003' },
        // Add the rest of your design codes...
    ];

    const stonesOptions = [
        { key: 'blue-topaz', value: 'Blue Topaz', text: 'Blue Topaz' },
        { key: 'white-topaz', value: 'White Topaz', text: 'White Topaz' },
        { key: 'chrome-diopside', value: 'Chrome Diopside', text: 'Chrome Diopside' },
        { key: 'garnet', value: 'Garnet', text: 'Garnet' },
        { key: 'peridot', value: 'Peridot', text: 'Peridot' },
        { key: 'sapphire', value: 'Sapphire', text: 'Sapphire' },
        { key: 'moonstone', value: 'Moonstone', text: 'Moonstone' }
    ];

    useEffect(() => {
        checkIfLastFormIsFilled();
    }, [designField]);

    const checkIfLastFormIsFilled = () => {
        const lastFormItem = designField[designField.length - 1];
        const isFilled = lastFormItem.designCode && lastFormItem.quantity > 0 && lastFormItem.stones.length > 0;
        setLastFormFilled(isFilled);
    };

    const handleDesignCodeChange = (id, value) => {
        const newDesignField = designField.map(item =>
            item.id === id ? { ...item, designCode: value } : item
        );
        setDesignField(newDesignField);
    };

    const handleQuantityChange = (id, value) => {
        if (value === '' || (!isNaN(value) && parseInt(value, 10) > 0)) {
            const newValue = value === '' ? '' : parseInt(value, 10);
            const newDesignField = designField.map(item =>
                item.id === id ? { ...item, quantity: newValue } : item
            );
            setDesignField(newDesignField);
        } else {
            alert('Please enter a valid number.');
        }
    };

    const handleStonesChange = (id, values) => {
        const newDesignField = designField.map(item =>
            item.id === id ? { ...item, stones: values } : item
        );
        setDesignField(newDesignField);
    };

    const addDesign = () => {
        if (lastFormFilled) {
            const newDesignField = {
                id: designField[designField.length - 1].id + 1,
                designCode: '',
                quantity: '',
                stones: []
            };
            setDesignField([...designField, newDesignField]);
            setLastFormFilled(false);
        }
    };

    return (
        <div className="box">
            {designField.map(({ id, designCode, quantity, stones }) => (
                <div className="center" key={id}>
                    <Dropdown
                        placeholder="Select Design Code"
                        fluid
                        search
                        selection
                        options={designCodes}
                        value={designCode}
                        onChange={(e, { value }) => handleDesignCodeChange(id, value)}
                    />

                    <Input
                        type="text"
                        placeholder="Amount"
                        className="custom-input"
                        value={quantity || ''}
                        onChange={(e) => handleQuantityChange(id, e.target.value)}
                    />

                    <Dropdown
                        placeholder="Select Stones"
                        fluid
                        multiple
                        search
                        selection
                        options={stonesOptions}
                        value={stones}
                        onChange={(e, { value }) => handleStonesChange(id, value)}
                    />
                </div>
            ))}
            <Button className="button" onClick={addDesign} disabled={!lastFormFilled}>+</Button>
        </div>
    );
}

export default InputForm;
