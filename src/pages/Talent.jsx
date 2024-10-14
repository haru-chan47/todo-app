import { Card, ListGroup, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import useLocalStorage from 'use-local-storage';
import './StylingTalent.css';
import characters from '../contexts/Characters';

export default function TalentAndAddCharacter() {
    const [userCharacterToBuildList, setUserCharacterToBuildList] = useLocalStorage('userCharacterToBuildList', []);
    const [currentDay, setCurrentDay] = useState("");
    const [showAddCharacter, setShowAddCharacter] = useState(false);
    const [userAddCharacterToList, setUserAddCharacterToList] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const day = new Date().toLocaleString('en-US', { weekday: 'long' });
        setCurrentDay(day);
    }, []);

    const availableCharacters = userCharacterToBuildList.filter(character =>
        character.availableDays && character.availableDays.includes(currentDay)
    );

    const handleAddCharacter = () => {
        const character = characters.find(c => c.name === userAddCharacterToList); // Find character
        if (character && !userCharacterToBuildList.some(c => c.name === character.name)) {
            setUserCharacterToBuildList([...userCharacterToBuildList, character]); // Update local storage
            setMessage(`${userAddCharacterToList} is added to the list`);
        } else {
            setMessage(`${userAddCharacterToList} is already in the list or invalid`);
        }
        setUserAddCharacterToList("");
    };

    const handleInputChange = (e) => {
        setUserAddCharacterToList(e.target.value);
    };

    console.log(currentDay)
    console.log(userAddCharacterToList)
    console.log(availableCharacters)

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
                    {availableCharacters.length > 0 ? (
                        availableCharacters.map((character) => (
                            <ListGroup.Item key={character.name}>
                                {character.talentBook}
                                <div className="image-container">
                                    <img
                                        src={character.image}
                                        alt={character.name}
                                        className="character-image"
                                    />
                                    <div className="tooltip">
                                        {character.name}
                                    </div>
                                </div>
                            </ListGroup.Item>
                        ))
                    ) : (
                        <ListGroup.Item>Domain for talent books needed is not open</ListGroup.Item>
                    )}
                </ListGroup>
            </Card>
        </div>
    );
}