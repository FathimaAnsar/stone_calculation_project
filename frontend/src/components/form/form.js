import './form.css'
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import React, { useState, useEffect  } from 'react';
function InputForm() {
    const [designField, setDesignField] = useState([
        {   id: 1,
            designCode: '',
            quantity: '',
        },
    ]);
    const [lastFormFilled, setLastFormFilled] = useState(false)
    useEffect(() => {
        checkIfLastFormIsFilled();
    }, [designField]); // Depend on designField to re-run the effect on changes

    const checkIfLastFormIsFilled = () => {
        // Check if the last form has both designCode and quantity filled
        const lastFormItem = designField[designField.length - 1];
        if (lastFormItem.designCode && lastFormItem.quantity > 0) {
            setLastFormFilled(true);
        } else {
            setLastFormFilled(false);
        }
    };
    const handleDesignCodeChange = (id, value) => {
    const newDesignField = designField.map(item =>
        item.id === id ? { ...item, designCode: value } : item
    );
    setDesignField(newDesignField);
    };
    const handleQuantityChange = (id, value) => {
        // Allow empty string to represent cleared input
        if (value === '' || (!isNaN(value) && parseInt(value, 10) > 0)) {
            const newValue = value === '' ? '' : parseInt(value, 10); // Keep it as empty string if cleared
            const newDesignField = designField.map(item =>
                item.id === id ? { ...item, quantity: newValue } : item
            );
            setDesignField(newDesignField);
        } else {
            alert('Please enter a Valid number.');
        }
    };
    const addDesign = () => {
        if (lastFormFilled) {
            const newDesignField = {
                id: designField[designField.length - 1].id + 1,
                designCode: '',
                quantity:0,
            };
            setDesignField([...designField, newDesignField]);
            setLastFormFilled(false); // Reset the flag
        }
    };
    return (
        <div className="box">
            {designField.map(({id, designCode, quantity}) => (
                <Container key={id}>
                    <div className="center">
                        <Form.Select aria-label="Default select example" className="select" value={designCode}
                                     onChange={(e) => handleDesignCodeChange(id, e.target.value)}>
                            <option>Select design code</option>
                            <option value="1">CSR/P/E - 001</option>
                            <option value="2">CSR/P/E - 002</option>
                            <option value="3">CSR/P/E - 003</option>
                            <option value="1">CSR/P/E - 004</option>
                            <option value="2">CSR/P/E - 005</option>
                            <option value="3">CSR/P/E - 006</option>
                            <option value="1">CSR/P/E - 007</option>
                            <option value="2">CSR/P/E - 008</option>
                            <option value="3">CSR/P/E - 009</option>
                            <option value="1">CSR/P/E - 010</option>
                            <option value="2">CSR/P/E - 011</option>
                            <option value="3">CSR/P/E - 013</option>
                            <option value="2">CSR/P/E - 014</option>
                            <option value="3">CSR/P/E - 016</option>
                        </Form.Select>
                        <div className="input">
                            <Form.Group as={Col} md={4} controlId={`qauntity-${id}`}>
                                <Form.Control type="text" placeholder="Amount" className="custom-input"
                                              value={quantity || ''}
                                              onChange={(e) => handleQuantityChange(id, e.target.value)}/>
                            </Form.Group>
                        </div>

                    </div>
                </Container>
            ))}
            <Button variant="light" className="button" onClick={addDesign} disabled={!lastFormFilled}>+</Button>
        </div>
    );
}
export default InputForm;