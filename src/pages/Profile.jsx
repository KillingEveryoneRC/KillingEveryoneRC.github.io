import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";

const Profile = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [experience, setExperience] = useState("");
    const [skills, setSkills] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    const token = localStorage.getItem("token");

    // 🔽 Завантаження профілю
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Failed to fetch profile");
                }

                setName(data.name || "");
                setExperience(data.experience || "");
                setSkills(data.skills || "");
            } catch (error) {
                console.error("Error loading profile:", error.message);
                alert("Failed to load profile: " + error.message);
                navigate("/login");
            }
        };

        if (token) {
            fetchProfile(); // викликаємо функцію
        } else {
            alert("You must be logged in.");
            navigate("/login");
        }
    }, [navigate, token]);

    // 🔼 Збереження профілю
    const handleSave = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name,
                    experience,
                    skills,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to save profile");
            }

            alert("Profile updated!");
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving profile:", error.message);
            alert("Failed to save profile: " + error.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        alert("You have been logged out.");
        navigate("/login");
    };

    return (
        <div className="profile-section">
            <div className="profile-header">
                <h1>My Profile</h1>
            </div>

            <div className="profile-content">
                <div className="profile-card">
                    {isEditing ? (
                        <>
                            <label>Name:</label>
                            <input value={name} onChange={(e) => setName(e.target.value)} />

                            <label>Experience:</label>
                            <input
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                            />

                            <label>Skills:</label>
                            <input
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                            />

                            <button className="button" onClick={handleSave}>
                                Save
                            </button>
                        </>
                    ) : (
                        <>
                            <h2>{name || "Unnamed User"}</h2>
                            <p><strong>Experience:</strong> {experience || "—"}</p>
                            <p><strong>Skills:</strong> {skills || "—"}</p>
                            <button className="button" onClick={() => setIsEditing(true)}>
                                Edit Profile
                            </button>
                        </>
                    )}

                    <button className="button logout" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
