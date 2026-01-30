import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import api from "../libs/axios";

// Define User type - adjust fields based on your actual user object
interface User {
    id: string;
    email: string;
    name?: string;
    // Add other user properties as needed
}

// Define AuthContext type
interface AuthContextType {
    user: User | null;
    login: (token: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

// Create context with undefined as initial value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider props type
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchMe = async (): Promise<void> => {
        try {
            const res = await api.get<User>("/auth/me");
            setUser(res.data);
        } catch (error) {
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (token: string): Promise<void> => {
        localStorage.setItem("token", token);
        await fetchMe();
    };

    const logout = (): void => {
        localStorage.removeItem("token");
        setUser(null);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetchMe();
        } else {
            setLoading(false);
        }
    }, []);

    const value: AuthContextType = {
        user,
        login,
        logout,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook with type safety
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
};