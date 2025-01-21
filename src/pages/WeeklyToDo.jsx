import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Form, Card, ListGroup, Button } from 'react-bootstrap';
import { AuthContext } from '../contexts/AuthProvider';

export default function WeeklyTodoList() {
    const [weeklyTasks, setWeeklyTasks] = useState([]);
    const [checkedItems, setCheckedItems] = useLocalStorage("checkedItems", {});
    const [newTask, setNewTask] = useState("");
    const [isEditing, setIsEditing] = useState(null);
    const [editTaskContent, setEditTaskContent] = useState("");
    const { currentUser } = useContext(AuthContext);
    const apiBackendUrl = "https://96af620c-7813-4201-872f-5c47943a6e75-00-38ji603hc5va1.sisko.replit.dev";
    const api = `${apiBackendUrl}/todolist`
    const apiWeekly = `${apiBackendUrl}/todolist/weekly`;
    const userId = currentUser ? currentUser.uid : null;

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                if (userId) {
                    const [weeklyResponse] = await Promise.all([
                        axios.get(`${apiWeekly}?userId=${userId}`)
                    ]);
                    setWeeklyTasks(weeklyResponse.data);
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };
        fetchTasks();
    }, [userId]);

    const handleCheckboxChange = (event, category, taskId) => {
        const { checked } = event.target;
        setCheckedItems(prev => {
            const updated = { ...prev };
            if (!updated[category]) updated[category] = {};
            updated[category][taskId] = checked;
            localStorage.setItem('checkedItems', JSON.stringify(updated));
            return updated;
        });
    };

    const handleAddTask = async (category) => {
        console.log("Task to be added:", {
            userId,
            content: newTask.trim(),
            category,
        });

        try {
            const response = await axios.post(api, {
                userId,
                content: newTask.trim(),
                category,
            });

            console.log("Response from backend:", response.data);
            setWeeklyTasks(prev => [...prev, response.data]);
            setNewTask("");
        } catch (error) {
            console.error("Error adding task:", error.response || error.message);
        }
    }

    const handleEdit = (task) => {
        setIsEditing(task.id);
        setEditTaskContent(task.content);
    };

    const saveEdit = async (taskId) => {
        try {
            await axios.put(`${api}/${taskId}`, { content: editTaskContent });
            setWeeklyTasks((prev) =>
                prev.map((task) =>
                    task.id === taskId ? { ...task, content: editTaskContent } : task
                )
            );
            setIsEditing(null);
        } catch (error) {
            console.error("Error saving task edit:", error);
        }
    };

    const handleDelete = async (taskId) => {
        try {
            await axios.delete(`${api}/${taskId}`);
            setWeeklyTasks((prev) => prev.filter((task) => task.id !== taskId));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const renderTaskList = (tasks, category) => (
        <ListGroup variant="flush">
            {tasks.map((task) => (
                <ListGroup.Item key={task.id} className="li">
                    <div className="checkbox-container">
                        <Form.Check
                            type="checkbox"
                            id={`checkbox-${category}-${task.id}`}
                            checked={checkedItems[category]?.[task.id] || false}
                            onChange={(e) => handleCheckboxChange(e, category, task.id)}
                        />
                        {isEditing === task.id ? (
                            <>
                                <Form.Control
                                    type="text"
                                    value={editTaskContent}
                                    onChange={(e) => setEditTaskContent(e.target.value)}
                                />
                                <Button onClick={() => saveEdit(task.id, category)}>Save</Button>
                            </>
                        ) : (
                            <span className={checkedItems[category]?.[task.id] ? "strikethrough" : ""}>
                                {task.content}
                            </span>
                        )}
                        <Button onClick={() => handleEdit(task)} className="edit-button">✎</Button>
                        <Button onClick={() => handleDelete(task.id, category)} className="remove-button">🗑️</Button>
                    </div>
                </ListGroup.Item>
            ))}
        </ListGroup>
    );

    return (
        <Card className="card">
            <Card.Header className="card-header">
                Weekly
                <Button onClick={() => handleAddTask("weekly")} className="button">+</Button>
            </Card.Header>
            <div className="task-input">
                <Form.Control
                    type="text"
                    placeholder="Add a new weekly task"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                />
            </div>
            {renderTaskList(weeklyTasks, 'weekly')}
        </Card>
    );
}

function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error("Error accessing localStorage:", error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error("Error setting localStorage:", error);
        }
    };

    return [storedValue, setValue];
}
