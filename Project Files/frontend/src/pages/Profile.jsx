import { useState } from "react";
import { FiUser, FiSave } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";
import toast from "react-hot-toast";

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [form, setForm] = useState({
        username: user?.username || "",
        email: user?.email || "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { username: form.username, email: form.email };
            if (form.password) payload.password = form.password;
            const { data } = await API.put("/users/profile", payload);
            updateUser(data);
            toast.success("Profile updated!");
            setForm({ ...form, password: "" });
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-enter" style={{ padding: "100px 0 60px" }}>
            <div className="container" style={{ maxWidth: 560 }}>
                <h1 style={{ fontSize: "2rem", marginBottom: 24 }}>
                    <FiUser style={{ verticalAlign: "middle", color: "var(--primary)" }} /> Profile
                </h1>

                <div
                    style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-lg)",
                        padding: 32,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
                        <div
                            style={{
                                width: 64,
                                height: 64,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "1.5rem",
                                fontWeight: 700,
                                color: "white",
                            }}
                        >
                            {user?.username?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div>
                            <h3>{user?.username}</h3>
                            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{user?.email}</p>
                            <span
                                className="badge"
                                style={{
                                    marginTop: 4,
                                    background: "rgba(255,107,53,0.15)",
                                    color: "var(--primary)",
                                    textTransform: "capitalize",
                                }}
                            >
                                {user?.userType}
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div className="form-group">
                            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--text-secondary)" }}>Username</label>
                            <input className="input-field" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--text-secondary)" }}>Email</label>
                            <input className="input-field" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--text-secondary)" }}>New Password (optional)</label>
                            <input className="input-field" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Leave blank to keep current" />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            <FiSave /> {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
