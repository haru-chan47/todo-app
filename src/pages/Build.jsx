import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage, auth } from "../firebase";


export default function ProfilePicture() {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!image) {
            setError("No image selected.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const userId = auth.currentUser.uid; // Ensure the user is logged in
            const storageRef = ref(storage, `profilePictures/${userId}`); // Save with user's ID
            const uploadTask = uploadBytesResumable(storageRef, image);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    console.error("Upload failed:", error);
                    setError("Upload failed.");
                    setLoading(false);
                },
                async () => {
                    // Get image URL after upload
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                    // Save the download URL to Firestore
                    const userDoc = doc(db, "users", userId); // Adjust your Firestore path
                    await updateDoc(userDoc, { profilePicture: downloadURL });

                    console.log("Profile picture uploaded successfully:", downloadURL);
                    setLoading(false);
                    alert("Profile picture uploaded successfully!");
                }
            );
        } catch (error) {
            console.error("Error uploading image:", error);
            setError("Error uploading image.");
            setLoading(false);
        }
    };

    return (
        <div>
            <h3>Upload Profile Picture</h3>
            {preview && <img src={preview} alt="Profile Preview" style={{ width: "150px", height: "150px", borderRadius: "50%" }} />}
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <button onClick={handleUpload} disabled={loading}>
                {loading ? "Uploading..." : "Upload"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};