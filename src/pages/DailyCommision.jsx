import { useState, useEffect } from 'react';
import { Button, Card, ListGroup, Form } from 'react-bootstrap';
import useLocalStorage from 'use-local-storage';
import AddDailyCommision from './AddDailyCommision';

export default function DailyResetList() {
    const defaultItems = [
        "Daily Commision",
        "Spend Resin",
        "Catch Crystalflies"
    ];

    const [dailyTodo, setDailyTodo] = useLocalStorage("dailyTodo", defaultItems);
    const [showAddDaily, setShowAddDaily] = useState(false);
    const [checkedItems, setCheckedItems] = useLocalStorage("checkedItems", []);
    const [isEditing, setIsEditing] = useState(null);
    const [newDaily, setNewDaily] = useState("");

    const getCurrentTime = () => new Date(); //getting the date and time

    const getResetTime = () => {
        const now = new Date();
        now.setHours(4, 0, 0, 0); // Resetting list at 4am (24hour system)
        return now;
    }

    const shouldReset = (lastResetTime) => {
        const now = getCurrentTime();
        const resetTime = getResetTime();
        return now > resetTime && (!lastResetTime || new Date(lastResetTime) < resetTime); //Checks if current time is reset time or not
    };

    useEffect(() => {
        const lastReset = localStorage.getItem("lastResetTime");
        if (shouldReset(lastReset)) { //checks if should run shouldReset
            setDailyTodo(defaultItems); // Reset list with default items
            setCheckedItems([]); // Reset checked items with default items
            localStorage.setItem("lastResetTime", getCurrentTime().toISOString()); // ISO: Used for precise and consistent date-time storage and comparisons + for diff time zone
        }
    }, []);

    const toggleAddButton = () => setShowAddDaily(prev => !prev); //Toggle visiblity

    //Add item if not already exist
    const addDailyItem = (item) => {
        if (!dailyTodo.includes(item)) {
            setDailyTodo(prevList => [...prevList, item]);
        }
    };

    //deleting a task
    const removeDailyTodo = (itemIndex) => {
        const updatedDailyTodo = [...dailyTodo];
        updatedDailyTodo.splice(itemIndex, 1); // Remove item by index
        setDailyTodo(updatedDailyTodo); // Update the state with the new list
    };

    //during editing
    const handleEdit = (index) => {
        setIsEditing(index); // Set the task index being edited
        setNewDaily(dailyTodo[index]); // Set the current task value to edit
    };

    //after editing
    const saveEditedTask = (index) => {
        const updatedTodo = [...dailyTodo];
        updatedTodo[index] = newDaily; // Update task at index
        setDailyTodo(updatedTodo);
        setIsEditing(null); // Exit editing mode
    };

    // If a task is checked, add to checkedItems, otherwise it removes it.
    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        setCheckedItems(prev => {
            const updatedCheckedItems = checked ? [...prev, value] : prev.filter(item => item !== value);
            localStorage.setItem('checkedItems', JSON.stringify(updatedCheckedItems)); // Update localStorage with the new checked state
            return updatedCheckedItems;
        });
    };



    return (
        <div className="card-container">
            <Card className="card">
                <Card.Header className="card-header">
                    Daily
                    <Button onClick={toggleAddButton} className="button"> {showAddDaily ? 'x' : '+'}</Button>
                </Card.Header>
                {showAddDaily && <AddDailyCommision onAdd={addDailyItem} />}
                <ListGroup variant="flush">
                    {dailyTodo.length > 0 ? (
                        dailyTodo.map((item, index) => (
                            <ListGroup.Item key={index} className="li">
                                {isEditing === index ? (
                                    <>
                                        <Form.Control
                                            type="text"
                                            value={newDaily}
                                            onChange={(e) => setNewDaily(e.target.value)}
                                        />
                                        <Button onClick={() => saveEditedTask(index)} className="calculate-button">Save</Button>
                                    </>
                                ) : (
                                    <div className="checkbox-container">
                                        <Form.Check
                                            type="checkbox"
                                            id={`checkbox-${index}`}
                                            value={item}
                                            checked={checkedItems.includes(item)}
                                            onChange={handleCheckboxChange}
                                        />
                                        <span className={checkedItems.includes(item) ? "strikethrough" : ""}>{item}</span>
                                        <Button onClick={() => handleEdit(index)} className="edit-button">✎</Button>
                                        <Button onClick={() => removeDailyTodo(index)} className="remove-button">🗑️</Button>
                                    </div>
                                )}
                            </ListGroup.Item>
                        ))
                    ) : (
                        <ListGroup.Item>No dailies added yet.</ListGroup.Item>
                    )}
                </ListGroup>
            </Card>
        </div>
    );
}
