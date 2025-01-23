import axios from "axios";
import React, { useEffect, useState } from "react";
import { createContext } from "react";

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setToken(token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
        
        const authenticateUser = async () => {
            if (token) {
                await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/auth`)
                    .then((response) => {
                        if (response.status === 200) {
                            setToken(token);
                            setIsAuthenticated(true);
                            setUser(response.user);
                        } else {
                            setToken(null);
                            setIsAuthenticated(false);
                            setUser(false);
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    })
                    .finally(() => {
                        setTimeout(() => {
                            setIsLoading(false);
                        }, 2000);
                    })
            } else {
                setToken(null);
                setIsAuthenticated(false);
                setUser(false);
                setTimeout(() => {
                    setIsLoading(false);
                }, 2000);
            }
        }

        authenticateUser();
    }, []);


    return (<AuthContext.Provider value={{ user, isAuthenticated, token, isLoading, setIsAuthenticated, setToken, setUser }}>
        {children}
    </AuthContext.Provider>);
};

export { AuthContext, AuthContextProvider };
