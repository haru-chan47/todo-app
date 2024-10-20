import { useContext, useState } from 'react';
import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Home() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    function login(e) {
        e.preventDefault();

        const isCorrectUsername = username === 'haru@haru.com';
        const isCorrectPassword = password === '1234';

        if (isCorrectUsername && isCorrectPassword) {
            authContext.setToken('1234');
            navigate('/todolist');
        } else {
            setErrorMessage("Invalid username or password");
        }
    }

    return (
        <Container>
            <h1 className='my-3'>Login to your account</h1>
            <Form onSubmit={login}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="haru@haru.com"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <Form.Text className="text-muted">
                        We&apos;ll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="1234"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                {errorMessage && (
                    <div style={{ color: 'red', marginBottom: '10px' }}>
                        {errorMessage}
                    </div>
                )}

                <Button variant="primary" type="submit">
                    Login
                </Button>
            </Form>
        </Container>
    );
}
