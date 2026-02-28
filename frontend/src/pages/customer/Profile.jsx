import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import API from "../../utils/api";
import toast from "react-hot-toast";
import { FiUser } from "react-icons/fi";

const Profile = () => {
    const { user, setUser } = useAuth();
    const [username, setUsername] = useState(user?.username || "");
    const [email, setEmail] = useState(user?.email || "");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updateData = { username, email };
            if (password) updateData.password = password;

            const { data } = await API.put("/users/profile", updateData);
            setUser({ ...user, ...data });
            toast.success("Profile updated successfully!");
            setPassword("");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-enter" style={{ padding: "100px 0 60px" }}>
            <div className="container" style={{ maxWidth: 560, margin: "0 auto" }}>
                <h1 style={{ fontSize: "2rem", marginBottom: 8 }}>
                    <FiUser style={{ verticalAlign: "middle", color: "var(--primary)" }} /> My Profile
                </h1>
                <p style={{ color: "var(--text-muted)", marginBottom: 28 }}>Manage your account details</p>

                <div style={{
                    background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
                    padding: 32, marginBottom: 20
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                        <div style={{
                            width: 64, height: 64, borderRadius: "50%", background: "var(--gradient-primary)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "white", fontWeight: 700, fontSize: "1.5rem"
                        }}>{user?.username?.charAt(0)?.toUpperCase()}</div>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: "1.1rem" }}>{user?.username}</div>
                            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{user?.email}</div>
                            <span style={{
                                padding: "2px 10px", borderRadius: "var(--radius-full)", fontSize: "0.7rem", fontWeight: 600, marginTop: 4, display: "inline-block",
                                background: user?.userType === "admin" ? "rgba(33,150,243,0.15)" :
                                    user?.userType === "restaurant" ? "rgba(255,152,0,0.15)" : "rgba(0,200,83,0.15)",
                                color: user?.userType === "admin" ? "#2196F3" :
                                    user?.userType === "restaurant" ? "#FF9800" : "#00C853"
                            }}>{user?.userType}</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleUpdate} style={{
                    background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
                    padding: 32, display: "flex", flexDirection: "column", gap: 16
                }}>
                    <h3 style={{ fontSize: "1.1rem", marginBottom: 4 }}>Edit Profile</h3>
                    <div className="form-group">
                        <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Username</label>
                        <input className="input-field" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Email</label>
                        <input className="input-field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>New Password (leave blank to keep)</label>
                        <input className="input-field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} placeholder="••••••" />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? "Updating..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
