import { Button, Card, Form, ListGroup } from "react-bootstrap";
import AddWeekly from "./AddWeekly";
import { useEffect, useState } from "react";
import useLocalStorage from "use-local-storage";

export default function WeeklyToDo() {
    const defaultWeekly = [
        "Trounce Domains",
        "Complete Battle Pass Weekly Missions",
        "Complete 3 Bounties",
        "Complete 3 Requests",
        "Collect Realm Currency",
        "Parametric Transformer"
    ]


    const [weeklyTodo, setWeeklyTodo] = useLocalStorage("weeklyTodo", defaultWeekly);
    const [showAddWeekly, setShowAddWeekly] = useState(false);
    const [checkedItems, setCheckedItems] = useLocalStorage("checkedItems", []);
    const [isEditing, setIsEditing] = useState(null);
    const [newWeekly, setNewWeekly] = useState("");

    const getCurrentTime = () => new Date();

    const getResetTime = () => {
        const now = new Date();
        const daysUntilNextMonday = (1 - now.getDay() + 7) % 7;
        //0 = Sunday, 1 = Monday. 
        // find out how many days until the next Monday: 1-today. eg: 1-2 = -1 (Monday is in the past)
        //+7 = get positive number + 6days away. 
        //%7, returning 0 is Monday
        const nextMonday = new Date(now);
        nextMonday.setDate(now.getDate() + daysUntilNextMonday); // get date of next Monday
        nextMonday.setHours(4, 0, 0, 0);
        return nextMonday;
    };

    const shouldReset = (lastResetTime) => {
        const now = getCurrentTime();
        const resetTime = getResetTime();
        return now >= resetTime && (!lastResetTime || new Date(lastResetTime) < resetTime);
    };


    useEffect(() => {
        const lastReset = localStorage.getItem("lastResetTime");
        if (shouldReset(lastReset)) {
            setWeeklyTodo(defaultWeekly);
            setCheckedItems([]);
            localStorage.setItem("lastResetTime", getCurrentTime().toISOString())
        }
    }, []);

    const toggleAddWeekly = () => setShowAddWeekly(prev => !prev);

    const addWeeklyTodo = (todo) => {
        if (!weeklyTodo.includes(todo)) {
            setWeeklyTodo(prevList => [...prevList, todo])
        }
    };

    const removeWeeklyTodo = (todoIndex) => {
        const updatedWeeklyTodo = [...weeklyTodo];
        updatedWeeklyTodo.splice(todoIndex, 1);
        setWeeklyTodo(updatedWeeklyTodo);
    };

    const handleEdit = (todoIndex) => {
        setIsEditing(todoIndex); // Set the task index being edited
        setNewWeekly(weeklyTodo[todoIndex]); // Set the current task value to edit
    };

    const saveEditedTask = (todo) => {
        const updatedTodo = [...weeklyTodo];
        updatedTodo[todo] = newWeekly; // Update task at index
        setWeeklyTodo(updatedTodo);
        setIsEditing(null); // Exit editing
    };

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
                    Weekly
                    <Button onClick={toggleAddWeekly} className="button"> {showAddWeekly ? 'x' : '+'}</Button>
                </Card.Header>
                {showAddWeekly && <AddWeekly onAdd={addWeeklyTodo} />}
                <ListGroup variant="flush">
                    {weeklyTodo.length > 0 ? (
                        weeklyTodo.map((item, index) => (
                            <ListGroup.Item key={index} className="li">
                                {isEditing === index ? (
                                    <>
                                        <Form.Control
                                            type="text"
                                            value={newWeekly}
                                            onChange={(e) => setNewWeekly(e.target.value)}
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
                                        <Button onClick={() => removeWeeklyTodo(index)} className="remove-button">🗑️</Button>
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
