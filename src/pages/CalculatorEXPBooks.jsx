import { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";


export default function EXPCalculator() {
    const [userWanderersAdvice, setUserWanderersAdvice] = useState("");
    const [userAdventurersExperience, setUserAdventurersExperience] = useState("");
    const [userHerosWit, setUserHerosWit] = useState("");
    const [userCharacterAmount, setUserCharacterAmount] = useState(1);
    const [message, setMessage] = useState("")

    const wanderersAdvice = (parseInt(userWanderersAdvice) || 0) * 1000;
    const adventurersExperience = (parseInt(userAdventurersExperience) || 0) * 5000;
    const herosWit = (parseInt(userHerosWit) || 0) * 20000;
    const characterAmount = (parseInt(userCharacterAmount));


    const totalEXP = wanderersAdvice + adventurersExperience + herosWit;
    const totalEXPNeeded = 8358300 * characterAmount;

    function calculate() {
        if (totalEXP >= totalEXPNeeded) {
            setMessage("Congrats! You have enough EXP books!");
        } else {
            const expNeeded = totalEXPNeeded - totalEXP;
            const herosWitNeeded = Math.ceil(expNeeded / 20000);
            const adventurersExperienceNeeded = Math.ceil(expNeeded / 5000);
            const wanderersAdviceNeeded = Math.ceil(expNeeded / 1000);

            setMessage(`You need at least:
                ${herosWitNeeded} Hero's Wit or
                ${adventurersExperienceNeeded} Adventurer's Experience or
                ${wanderersAdviceNeeded} Wanderer's Advice
            `);
        }
    }

    return (
        <div className="calculator-card-container">
            <div>
                <Card className="card">
                    <Card.Header className="card-header">EXP Books Calculator
                        <Form>
                            <Row>
                                <Col className="character-amount-title">Amount of Character:
                                    <Form.Control className="character-amount-form"
                                        value={userCharacterAmount}
                                        onChange={(e) => setUserCharacterAmount(e.target.value)}
                                        type="number"
                                        placeholder="Number of Character"
                                    />
                                </Col>
                            </Row>
                        </Form>
                    </Card.Header>
                    <Card.Body>
                        <Form>
                            <Row>
                                <Col className="book-title">Hero&apos;s Wit</Col>
                                <Col className="book-title">Adventurer&apos;s Experience</Col>
                                <Col className="book-title">Wanderer&apos;s Advice</Col>
                            </Row>
                            <Row>
                                <Col><img src="images/heros-wit.png" alt="Image of Hero's Wit" className="book-image" /></Col>
                                <Col><img src="images/adventurers-experience.png" alt="Image of Adventurers Experience" className="book-image" /></Col>
                                <Col><img src="images/wanderers-advice.png" alt="Image of Wanderer's Advice" className="book-image" /></Col>
                            </Row>

                            <Row className="mt-3">
                                <Col>
                                    <Form.Control
                                        value={userHerosWit}
                                        onChange={(e) => setUserHerosWit(e.target.value)}
                                        type="number"
                                        placeholder="Amount of books"
                                    />
                                </Col>
                                <Col>
                                    <Form.Control
                                        value={userAdventurersExperience}
                                        onChange={(e) => setUserAdventurersExperience(e.target.value)}
                                        type="number"
                                        placeholder="Amount of books"
                                    />
                                </Col>
                                <Col>
                                    <Form.Control
                                        value={userWanderersAdvice}
                                        onChange={(e) => setUserWanderersAdvice(e.target.value)}
                                        type="number"
                                        placeholder="Amount of books"
                                    />
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Button onClick={calculate} className="calculate-button">Calculate</Button>
                                </Col>
                                <p>{message}</p>
                            </Row>

                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </div>
    )
}