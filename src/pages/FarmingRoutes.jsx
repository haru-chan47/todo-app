import { useContext, useEffect, useState } from "react";
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
} from "firebase/storage";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import {
    addDoc,
    collection,
    getDocs,
    query,
    where,
    deleteDoc,
    doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../contexts/AuthProvider";

export default function FarmingRoutes() {
    const [image, setImage] = useState(null);
    const [imageName, setImageName] = useState("");
    const [uploadedImages, setUploadedImages] = useState([]);
    const storage = getStorage();
    const { currentUser } = useContext(AuthContext);
    const userId = currentUser ? currentUser.uid : null;

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!image || !userId) {
            alert("Please select an image and ensure you're logged in.");
            return;
        }

        try {
            const storageRef = ref(storage, `images/${userId}/${image.name}`);
            const snapshot = await uploadBytes(storageRef, image);
            const url = await getDownloadURL(snapshot.ref);

            const imageData = {
                name: imageName || "Unnamed Image",
                url,
                userId,
                storagePath: snapshot.ref.fullPath,
            };

            await addDoc(collection(db, "images"), imageData);

            // Update local state
            setUploadedImages((prev) => [...prev, imageData]);
            setImage(null);
            setImageName("");
            alert("Image uploaded successfully!");
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image.");
        }
    };

    const handleDelete = async (image) => {
        if (image.userId !== userId) {
            alert("You can only delete your own images.");
            return;
        }

        const imageRef = ref(storage, image.storagePath);

        try {
            await deleteObject(imageRef);
            const imageDocQuery = query(
                collection(db, "images"),
                where("url", "==", image.url)
            );
            const imageDocs = await getDocs(imageDocQuery);

            imageDocs.forEach(async (docSnapshot) => {
                await deleteDoc(doc(db, "images", docSnapshot.id));
            });

            setUploadedImages((prev) =>
                prev.filter((img) => img.url !== image.url)
            );
            alert("Image deleted successfully!");
        } catch (error) {
            console.error("Error deleting image:", error);
            alert("Failed to delete image.");
        }
    };

    useEffect(() => {
        const fetchImages = async () => {
            if (!userId) return;

            const imagesQuery = query(
                collection(db, "images"),
                where("userId", "==", userId)
            );

            try {
                const querySnapshot = await getDocs(imagesQuery);
                const images = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUploadedImages(images);
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        };

        fetchImages();
    }, [userId]);

    return (
        <Container
            fluid
            style={{
                minHeight: "100vh",
                padding: "20px",
            }}
        >
            <h1 className="home-title">Your Farming Routes</h1>

            <div className="d-flex justify-content-center align-items-center mb-4 gap-3">
                <input
                    type="file"
                    onChange={handleFileChange}
                />
                <Form.Control
                    type="text"
                    placeholder="Enter image name"
                    value={imageName}
                    onChange={(e) => setImageName(e.target.value)}
                    style={{ maxWidth: "300px" }}
                />
                <Button className="upload-button" onClick={handleUpload}>
                    Upload Image
                </Button>
            </div>

            <Row className="gy-4">
                {uploadedImages.map((img, index) => (
                    <Col sm={6} md={4} lg={3} key={index}>
                        <Card
                            className="h-100"
                            style={{
                                backgroundColor: "#1E1E1E",
                                borderRadius: "10px",
                                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                            }}
                        >
                            <Card.Img
                                variant="top"
                                src={img.url}
                                style={{
                                    height: "250px",
                                    objectFit: "cover",
                                    borderTopLeftRadius: "10px",
                                    borderTopRightRadius: "10px",
                                }}
                            />
                            <Card.Body>
                                <Card.Title
                                    style={{
                                        color: "#fff",
                                        textAlign: "center",
                                    }}
                                >
                                    {img.name}
                                </Card.Title>
                                <div className="d-flex justify-content-center">
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(img)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}
