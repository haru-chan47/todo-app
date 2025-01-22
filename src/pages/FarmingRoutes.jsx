import { useEffect, useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

export default function FarmingRoutes() {
    const [image, setImage] = useState(null); // For selected file
    const [imageName, setImageName] = useState(""); // For image naming
    const [uploadedImages, setUploadedImages] = useState([]); // List of uploaded images
    const storage = getStorage(); // Firebase storage instance

    // Handle file selection
    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    // Handle image upload
    const handleUpload = () => {
        if (!image) return;

        // Upload image to Firebase Storage
        const storageRef = ref(storage, `images/${image.name}`);
        uploadBytes(storageRef, image).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                // Save image URL and name in Firestore
                const imageData = {
                    name: imageName, // The name the user provides
                    url: url,        // The image URL
                };

                // Store in Firestore (replace with your Firestore setup)
                addDoc(collection(db, "images"), imageData)
                    .then(() => {
                        console.log("Image uploaded successfully");
                    })
                    .catch((error) => {
                        console.error("Error uploading image:", error);
                    });
            });
        });
    };

    // Handle image deletion
    const handleDelete = async (path) => {
        const imageRef = ref(storage, path); // Get reference to the image

        try {
            await deleteObject(imageRef); // Delete the image
            setUploadedImages((prev) => prev.filter((img) => img.path !== path)); // Remove from state
            alert("Image deleted successfully!");
        } catch (error) {
            console.error("Error deleting image:", error);
            alert("Failed to delete image.");
        }
    };

    // Fetch and display all uploaded images
    useEffect(() => {
        const fetchImages = async () => {
            const imagesRef = ref(storage, "farming-images");
            try {
                const imageList = await listAll(imagesRef); // Get all images in the directory
                const urls = await Promise.all(
                    imageList.items.map(async (item) => {
                        const url = await getDownloadURL(item); // Get URL
                        return { url, name: item.name, path: item.fullPath }; // Add path and name
                    })
                );
                setUploadedImages(urls); // Set state with image data
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        };

        fetchImages();
    }, []);

    return (
        <Container fluid style={{ backgroundColor: "#121212", color: "#fff", minHeight: "100vh", padding: "20px" }}>
            <h1 className="text-center mb-4">Farming Image Upload</h1>

            <div className="d-flex justify-content-center align-items-center mb-4 gap-3">
                <input type="file" onChange={handleFileChange} style={{ color: "#fff" }} />
                <Form.Control
                    type="text"
                    placeholder="Enter image name"
                    value={imageName}
                    onChange={(e) => setImageName(e.target.value)}
                    style={{ maxWidth: "300px" }}
                />
                <Button variant="success" onClick={handleUpload}>
                    Upload Image
                </Button>
            </div>


            {/* Display Uploaded Images in Cards */}
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
                                <Card.Title style={{ color: "#fff", textAlign: "center" }}>{img.name}</Card.Title>
                                <div className="d-flex justify-content-center">
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(img.path)}>
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
};
