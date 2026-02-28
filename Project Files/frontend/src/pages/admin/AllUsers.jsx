import { useState, useEffect } from "react";
import { FiCheck, FiX, FiUsers } from "react-icons/fi";
import API from "../../utils/api";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await API.get("/admin/users");
                setUsers(data);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleApproval = async (userId, approval) => {
        try {
            await API.put(`/admin/users/${userId}/approval`, { approval });
            setUsers(users.map(u => u._id === userId ? { ...u, approval } : u));
            toast.success(`User ${approval ? "approved" : "rejected"} successfully`);
        } catch {
            toast.error("Failed to update approval");
        }
    };

    if (loading) return <Loader />;

    const pendingCount = users.filter(u => u.userType === "restaurant" && !u.approval).length;

    return (
        <div className="page-enter" style={{ padding: "100px 0 60px" }}>
            <div className="container">
                <h1 style={{ fontSize: "2rem", marginBottom: 8 }}>
                    <FiUsers style={{ verticalAlign: "middle", color: "var(--primary)" }} /> All Users
                </h1>
                <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>
                    {users.length} users total
                    {pendingCount > 0 && <span style={{ color: "var(--primary)", fontWeight: 600 }}> · {pendingCount} pending approval</span>}
                </p>

                <div style={{
                    background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
                    overflow: "hidden"
                }}>
                    <div style={{
                        display: "grid", gridTemplateColumns: "1fr 1.2fr 100px 100px 140px",
                        padding: "12px 20px", background: "rgba(255,255,255,0.03)", fontWeight: 600, fontSize: "0.8rem",
                        color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5
                    }}>
                        <span>Username</span>
                        <span>Email</span>
                        <span>Role</span>
                        <span>Status</span>
                        <span>Actions</span>
                    </div>
                    {users.map(u => (
                        <div key={u._id} style={{
                            display: "grid", gridTemplateColumns: "1fr 1.2fr 100px 100px 140px",
                            padding: "14px 20px", borderTop: "1px solid var(--border)", alignItems: "center", fontSize: "0.9rem"
                        }}>
                            <span style={{ fontWeight: 500 }}>{u.username}</span>
                            <span style={{ color: "var(--text-secondary)" }}>{u.email}</span>
                            <span>
                                <span style={{
                                    padding: "3px 10px", borderRadius: "var(--radius-full)", fontSize: "0.75rem", fontWeight: 600,
                                    background: u.userType === "admin" ? "rgba(33,150,243,0.15)" :
                                        u.userType === "restaurant" ? "rgba(255,152,0,0.15)" : "rgba(0,200,83,0.15)",
                                    color: u.userType === "admin" ? "#2196F3" :
                                        u.userType === "restaurant" ? "#FF9800" : "#00C853"
                                }}>{u.userType}</span>
                            </span>
                            <span>
                                <span style={{
                                    padding: "3px 10px", borderRadius: "var(--radius-full)", fontSize: "0.75rem", fontWeight: 600,
                                    background: u.approval ? "rgba(0,200,83,0.15)" : "rgba(255,61,87,0.15)",
                                    color: u.approval ? "#00C853" : "#FF3D57"
                                }}>{u.approval ? "Approved" : "Pending"}</span>
                            </span>
                            <span>
                                {u.userType === "restaurant" && (
                                    <div style={{ display: "flex", gap: 6 }}>
                                        {!u.approval ? (
                                            <button onClick={() => handleApproval(u._id, true)}
                                                style={{
                                                    background: "rgba(0,200,83,0.15)", color: "#00C853", border: "none",
                                                    padding: "6px 10px", borderRadius: "var(--radius)", cursor: "pointer", fontSize: "0.85rem",
                                                    display: "flex", alignItems: "center", gap: 4
                                                }}><FiCheck /> Approve</button>
                                        ) : (
                                            <button onClick={() => handleApproval(u._id, false)}
                                                style={{
                                                    background: "rgba(255,61,87,0.1)", color: "#FF3D57", border: "none",
                                                    padding: "6px 10px", borderRadius: "var(--radius)", cursor: "pointer", fontSize: "0.85rem",
                                                    display: "flex", alignItems: "center", gap: 4
                                                }}><FiX /> Revoke</button>
                                        )}
                                    </div>
                                )}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllUsers;
