import { useContext, useState } from 'react';
import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    function login() {
        const isCorrectUsername = username === 'nick@zy0x.com'
        const isCorrectPassword = password === 'password'
        if (isCorrectUsername && isCorrectPassword) {
            authContext.setToken('1234');
            navigate('/dashboard');
        }
    }

    return (
        <Container >
            <h1 className='my-3'>Login to your account</h1>
            <Form> {/*a container to wrap all the other Form components */}
                <Form.Group className="mb-3" controlId="formBasicEmail">  {/* Form.Group to group all related components */}
                    <Form.Label>Email address</Form.Label> {/* Form.Label - label is from bootstrap. connected to input*/}
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    /> {/* Form.Control - same as <input> in HTML */}
                    <Form.Text className="text-muted"> {/* Form.Text - just a normal text component. "text-muted" to set them to gray*/}
                        We&apos;ll never share your email with anyone else. {/* &apos = '. you can't type ' because it'll cause error. Hence, &apos */}
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" onClick={login}>Login</Button> {/* by default primary button is blue */}
            </Form>
        </Container>
    );
}