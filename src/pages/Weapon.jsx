import { Card, ListGroup, Button, Form, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import useLocalStorage from 'use-local-storage';
import './StylingTalent.css';
import axios from 'axios';

export default function Weapon() {
    const url = "https://genshin.jmp.blue";
    const [userWeaponToBuildList, setUserWeaponToBuildList] = useLocalStorage('userWeaponToBuildList', []);
    const [currentDay, setCurrentDay] = useState("");
    const [weapons, setWeapon] = useState([]);
    const [showAddWeapon, setShowAddWeapon] = useState(false);
    const [userAddWeaponToList, setUserAddWeaponToList] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const day = new Date().toLocaleString('en-US', { weekday: 'long' });
        setCurrentDay(day);

        const fetchTalentBooks = async () => {
            try {
                const res = await axios.get(`${url}/materials/weapon-ascension`);
                setWeapon(res.data);
            } catch (error) {
                console.error("Error fetching talents", error);
            }
        };
        fetchTalentBooks();
    }, []);

    const handleAddWeapon = () => {
        if (!userAddWeaponToList) {
            setMessage("Please enter a weapon name.");
            return;
        }

        // Add character only if it's not already in the list
        if (!userWeaponToBuildList.includes(userAddWeaponToList.toLowerCase())) {
            setUserWeaponToBuildList([...userWeaponToBuildList, userAddWeaponToList.toLowerCase()]);
            setMessage(`${userAddWeaponToList} is added to the list`);
        } else {
            setMessage(`${userAddWeaponToList} is already in the list`);
        }
        setUserAddWeaponToList("");
    };

    const handleInputChange = (e) => {
        setUserAddWeaponToList(e.target.value);
    };

    const handleDeleteWeapon = (weaponName) => {
        setUserWeaponToBuildList(userWeaponToBuildList.filter(weapon => weapon !== weaponName));
        setMessage(`${weaponName} has been removed from the list`);
    };

    const availableWeapon = Object.keys(weapons).filter(weaponKey => {
        const weapon = weapons[weaponKey];
        return weapon && weapon.availability && weapon.availability.includes(currentDay);
    });

    return (
        <div className="card-container">
            <Card className="card">
                <Card.Header className="card-header">
                    Weapon Ascension Materials
                    <Button onClick={() => setShowAddWeapon(!showAddWeapon)} className="button">
                        {showAddWeapon ? 'x' : '+'}
                    </Button>
                </Card.Header>

                {showAddWeapon && (
                    <Form>
                        <div className="add-form">
                            <Form.Control
                                className="add-input"
                                value={userAddWeaponToList}
                                onChange={handleInputChange}
                                type="text"
                                placeholder="Add Character Name"
                                required
                            />
                            <Button onClick={handleAddWeapon} className="add-button">
                                Add Weapon
                            </Button>
                        </div>
                        <div className="message">{message}</div>
                    </Form>
                )}

                <ListGroup variant="flush">
                    {availableWeapon.length > 0 ? (
                        availableWeapon.map((weaponKey) => {
                            const weapon = weapons[weaponKey];
                            const filteredWeapons = weapon.weapons?.filter(weapons =>
                                userWeaponToBuildList.includes(weapons.toLowerCase())
                            );

                            return (
                                filteredWeapons && filteredWeapons.length > 0 && (
                                    <ListGroup.Item key={weaponKey}>
                                        <Row>
                                            <Col md={4}><strong>{weaponKey}</strong></Col>
                                            <Col md={8}>
                                                {filteredWeapons.map(weapon => (
                                                    <div key={weapon} className="character-item">
                                                        {weapon}
                                                        <Button onClick={() => handleDeleteWeapon(weapon.toLowerCase())} className="remove-button">🗑️</Button>
                                                    </div>
                                                ))}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )
                            );
                        })
                    ) : (
                        <ListGroup.Item>No weapon ascension materials are available today for selected characters.</ListGroup.Item>
                    )}
                </ListGroup>
            </Card>
        </div>
    );
}
