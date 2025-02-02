import {
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
    signInWithPopup,
} from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { Button, Col, Form, Image, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";

export default function AuthPage() {
    const loginImage = "images/Paimon-Thinking.webp";
    const [modalShow, setModalShow] = useState(null);
    const handleShowSignUp = () => setModalShow("signup");
    const handleShowLogin = () => setModalShow("login");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const auth = getAuth();
    const { currentUser } = useContext(AuthContext);
    const provider = new GoogleAuthProvider();

    useEffect(() => {
        if (currentUser) navigate("/todolist");
    }, [currentUser, navigate]);

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const res = await createUserWithEmailAndPassword(
                auth,
                username,
                password
            );
            console.log(res.user);
        } catch (error) {
            console.error(error);
        }
    };
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await signInWithEmailAndPassword(auth, username, password);
            console.log(res.user);
        } catch (error) {
            console.error(error);
        }
    };

    const handlgeGoogleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await signInWithPopup(auth, provider);
            console.log(res.user);
        } catch (error) {
            console.error(error);
        }
    };

    const handleClose = () => setModalShow(null);

    return (
        <Col sm={6} className="p-4 auth">
            <h1 className="home-title">Paimon&apos;s Todo App</h1>
            <div className="auth-box">
                <Image src={loginImage} fluid />
                <Col sm={5} className="d-grid gap-2">
                    <Button className="rounded-pill" style={{ backgroundColor: 'white', color: 'black' }} onClick={handlgeGoogleLogin}>
                        <i className="bi bi-google"></i> Sign up with Google
                    </Button>
                    <p style={{ textAlign: "center" }}>or</p>
                    <Button className="rounded-pill custom-btn" onClick={handleShowSignUp}>
                        Create an account
                    </Button>
                    <p className="mt-5" style={{ fontWeight: "bold" }}>
                        Already have an account?
                    </p>
                    <Button className="rounded-pill custom-btn" onClick={handleShowLogin}>
                        Sign in
                    </Button>
                </Col>
                <Modal
                    show={modalShow !== null}
                    onHide={handleClose}
                    animation={false}
                    centered
                >
                    <Modal.Body>
                        <h2 className="mb-4" style={{ fontWeight: "bold" }}>
                            {modalShow === "signup"
                                ? "Create your account"
                                : "Log in to your account"}
                        </h2>

                        <Form
                            className="d-grid gap-2 px-5"
                            onSubmit={modalShow === "signup" ? handleSignUp : handleLogin}
                        >
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control
                                    onChange={(e) => setUsername(e.target.value)}
                                    type="email"
                                    placeholder="Enter email"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Control
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    placeholder="Password"
                                />
                            </Form.Group>

                            <p style={{ fontSize: 12 }}>
                                By signing up, you agree to the Terms of Service and Privacy
                                Policy, including Cookie Use. Paimon may use your contact
                                information, including your email address and phone number for
                                purposes outlined in our Privacy Policy, like keeping your
                                account secure and personalising our services, including ads.
                                Learn more. Others will be able to find you by email or phone
                                number, when provided, unless you choose otherwise here.
                            </p>
                            <Button className="rounded-pill" type="submit">
                                {modalShow === "signup" ? "Sign up" : "Log in"}
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
        </Col>
    );
}