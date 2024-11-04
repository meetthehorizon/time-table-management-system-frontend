import { createContext } from "react";
import { useState } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    return (
        <UserContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}