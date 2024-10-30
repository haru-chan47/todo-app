import { Card, ListGroup, Button, Form, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import useLocalStorage from 'use-local-storage';
import './StylingTalent.css';
import axios from 'axios';

export default function TalentAndAddCharacter() {
    const url = "https://genshin.jmp.blue";
    const [userCharacterToBuildList, setUserCharacterToBuildList] = useLocalStorage('userCharacterToBuildList', []);
    const [currentDay, setCurrentDay] = useState("");
    const [talentBooks, setTalentBooks] = useState([]);
    const [showAddCharacter, setShowAddCharacter] = useState(false);
    const [userAddCharacterToList, setUserAddCharacterToList] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const day = new Date().toLocaleString('en-US', { weekday: 'long' });
        setCurrentDay(day);

        const fetchTalentBooks = async () => {
            try {
                const res = await axios.get(`${url}/materials/talent-book`);
                setTalentBooks(res.data); // Assume this is an object with talent book data
            } catch (error) {
                console.error("Error fetching talents", error);
            }
        };
        fetchTalentBooks();
    }, []);

    const handleAddCharacter = () => {
        if (!userAddCharacterToList) {
            setMessage("Please enter a character name.");
            return;
        }

        // Add character only if it's not already in the list
        if (!userCharacterToBuildList.includes(userAddCharacterToList.toLowerCase())) {
            setUserCharacterToBuildList([...userCharacterToBuildList, userAddCharacterToList.toLowerCase()]);
            setMessage(`${userAddCharacterToList} is added to the list`);
        } else {
            setMessage(`${userAddCharacterToList} is already in the list`);
        }
        setUserAddCharacterToList("");
    };

    const handleInputChange = (e) => {
        setUserAddCharacterToList(e.target.value);
    };

    const handleDeleteCharacter = (characterName) => {
        setUserCharacterToBuildList(userCharacterToBuildList.filter(character => character !== characterName));
        setMessage(`${characterName} has been removed from the list`);
    };

    // Filter talent books that are available on the current day
    const availableTalentBooks = Object.keys(talentBooks).filter(bookKey => {
        const book = talentBooks[bookKey];
        return book && book.availability && book.availability.includes(currentDay);
    });

    return (
        <div className="card-container">
            <Card className="card">
                <Card.Header className="card-header">
                    Talent Books Available Today
                    <Button onClick={() => setShowAddCharacter(!showAddCharacter)} className="button">
                        {showAddCharacter ? 'x' : '+'}
                    </Button>
                </Card.Header>

                {showAddCharacter && (
                    <Form>
                        <div className="add-form">
                            <Form.Control
                                className="add-input"
                                value={userAddCharacterToList}
                                onChange={handleInputChange}
                                type="text"
                                placeholder="Add Character Name"
                                required
                            />
                            <Button onClick={handleAddCharacter} className="add-button">
                                Add Character
                            </Button>
                        </div>
                        <div className="message">{message}</div>
                    </Form>
                )}

                <ListGroup variant="flush">
                    {availableTalentBooks.length > 0 ? (
                        availableTalentBooks.map((bookKey) => {
                            const book = talentBooks[bookKey];
                            const filteredCharacters = book.characters?.filter(character =>
                                userCharacterToBuildList.includes(character.toLowerCase())
                            );

                            return (
                                filteredCharacters && filteredCharacters.length > 0 && (
                                    <ListGroup.Item key={bookKey}>
                                        <Row>
                                            <Col md={4}><strong>{bookKey}</strong></Col>
                                            <Col md={8}>
                                                {filteredCharacters.map(character => (
                                                    <div key={character} className="character-item">
                                                        {character}
                                                        <Button onClick={() => handleDeleteCharacter(character.toLowerCase())} className="remove-button">🗑️</Button>
                                                    </div>
                                                ))}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )
                            );
                        })
                    ) : (
                        <ListGroup.Item>No talent books are available today for selected characters.</ListGroup.Item>
                    )}
                </ListGroup>
            </Card>
        </div>
    );
}
