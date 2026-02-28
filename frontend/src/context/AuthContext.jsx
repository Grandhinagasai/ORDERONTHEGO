import { createContext, useContext, useState, useEffect } from "react";
import API from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            setUser(JSON.parse(stored));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const { data } = await API.post("/users/login", { email, password });
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        return data;
    };

    const register = async (username, email, password, userType) => {
        const { data } = await API.post("/users/register", {
            username,
            email,
            password,
            userType,
        });
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        return data;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        API.post("/users/logout");
    };

    const updateUser = (updatedData) => {
        const updated = { ...user, ...updatedData };
        setUser(updated);
        localStorage.setItem("user", JSON.stringify(updated));
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
