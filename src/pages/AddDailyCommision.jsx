import { useState } from 'react';
import useLocalStorage from 'use-local-storage';
import { Form, Button } from 'react-bootstrap';

export default function AddDailyCommision() {
    const [dailyTodo, setDailyTodo] = useLocalStorage('dailyTodo', []);
    const [userAddDaily, setUserAddDaily] = useState('');

    const handleAddDaily = () => {
        if (userAddDaily && !dailyTodo.includes(userAddDaily)) { // Check if daily item is already in the list
            setDailyTodo([...dailyTodo, userAddDaily]);
        }
        setUserAddDaily("");
    };

    const handleInputChange = (e) => {
        setUserAddDaily(e.target.value);
    };

    return (
        <Form>
            <div className="add-form">
                <Form.Control
                    className="add-input"
                    value={userAddDaily}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Add Daily Task"
                    required
                />
                <Button onClick={handleAddDaily} className="add-button">
                    Add Daily
                </Button>
            </div>
        </Form>
    );
};
