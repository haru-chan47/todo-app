import { useState } from 'react';
import useLocalStorage from 'use-local-storage';
import { Form, Button } from 'react-bootstrap';

export default function AddWeekly() {
    const [weeklyTodo, setWeeklyTodo] = useLocalStorage('weeklyTodo', []);
    const [userAddWeekly, setUserAddWeekly] = useState("");

    const handleAddDaily = () => {
        if (userAddWeekly && !weeklyTodo.includes(userAddWeekly)) { // Check if daily item is already in the list
            setWeeklyTodo([...weeklyTodo, userAddWeekly]);
        }
        setUserAddWeekly("");
    };

    const handleInputChange = (e) => {
        setUserAddWeekly(e.target.value);
    };

    return (
        <Form>
            <div className="add-form">
                <Form.Control
                    className="add-input"
                    value={userAddWeekly}
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
