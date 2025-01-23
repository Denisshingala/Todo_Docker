import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Logout = () => {

    const navigator = useNavigate();
    const { setIsAuthenticated, setToken, setUser } = useContext(AuthContext);

    useEffect(() => {
        setIsAuthenticated(false);
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        navigator("/login");
    }, [navigator, setIsAuthenticated, setToken, setUser]);

    return null;
}

export default Logout