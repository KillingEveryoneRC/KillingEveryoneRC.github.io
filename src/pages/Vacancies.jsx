import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/vacancies.css";

const Vacancies = () => {
    const [vacancies, setVacancies] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        company: "",
        title: "",
        salary: "",
        location: "",
        type: "",
        experience: ""
    });

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchVacancies = async () => {
            const q = query(collection(db, "vacancies"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setVacancies(data);
        };

        fetchVacancies();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:5000/api/vacancies", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error("Failed to add vacancy");

            setShowForm(false);
            setFormData({ company: "", title: "", salary: "", location: "", type: "", experience: "" });

            const q = query(collection(db, "vacancies"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setVacancies(data);
        } catch (err) {
            console.error("Error adding vacancy:", err.message);
        }
    };

    return (
        <div className="vacancies-section">
            <div className="vacancies-header">
                <h2>Vacancies</h2>
                {token && (
                    <button onClick={() => setShowForm(true)} className="add-btn">＋</button>
                )}
            </div>

            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Add New Vacancy</h3>
                        <form onSubmit={handleSubmit} className="vacancy-form">
                            {["company", "title", "salary", "location", "type", "experience"].map((field) => (
                                <input
                                    key={field}
                                    name={field}
                                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                    value={formData[field]}
                                    onChange={handleChange}
                                    required
                                />
                            ))}
                            <div className="modal-buttons">
                                <button type="submit">Submit</button>
                                <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="vacancies-list">
                {vacancies.map((vac) => (
                    <div className="vacancy-card" key={vac.id}>
                        <div className="company-name">{vac.company}</div>
                        <div className="position">{vac.title}</div>
                        <div className="details">
                            <div>💰 {vac.salary}</div>
                            <div>📍 {vac.location}</div>
                            <div>📝 {vac.type}</div>
                            <div>💼 Experience: {vac.experience}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Vacancies;
