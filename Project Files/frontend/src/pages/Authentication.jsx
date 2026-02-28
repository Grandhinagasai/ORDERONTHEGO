import Login from "../components/Login";
import Register from "../components/Register";
import { useState } from "react";
import "../styles/Auth.css";

const Authentication = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="auth-page page-enter" style={{ padding: "100px 0 60px" }}>
            <div className="container" style={{ maxWidth: 480, margin: "0 auto" }}>
                <div style={{ display: "flex", gap: 0, marginBottom: 32 }}>
                    <button
                        onClick={() => setIsLogin(true)}
                        style={{
                            flex: 1, padding: "12px", fontWeight: 600, fontSize: "0.95rem",
                            background: isLogin ? "var(--primary)" : "var(--bg-card)",
                            color: isLogin ? "white" : "var(--text-secondary)",
                            border: `1px solid ${isLogin ? "var(--primary)" : "var(--border)"}`,
                            borderRadius: "var(--radius) 0 0 var(--radius)", cursor: "pointer",
                            transition: "var(--transition)"
                        }}>Login</button>
                    <button
                        onClick={() => setIsLogin(false)}
                        style={{
                            flex: 1, padding: "12px", fontWeight: 600, fontSize: "0.95rem",
                            background: !isLogin ? "var(--primary)" : "var(--bg-card)",
                            color: !isLogin ? "white" : "var(--text-secondary)",
                            border: `1px solid ${!isLogin ? "var(--primary)" : "var(--border)"}`,
                            borderRadius: "0 var(--radius) var(--radius) 0", cursor: "pointer",
                            transition: "var(--transition)"
                        }}>Register</button>
                </div>

                {isLogin ? <Login /> : <Register />}
            </div>
        </div>
    );
};

export default Authentication;
