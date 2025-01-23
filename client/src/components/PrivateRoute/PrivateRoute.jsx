import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Loading from '../Loading/Loading';
import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const navigate = useNavigate();
    const { isLoading, isAuthenticated } = useContext(AuthContext);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate("/login");
        }
    }, [isLoading, isAuthenticated, navigate])

    if (isLoading) {
        return <Loading />
    } else {
        return children;
    }
}

export default PrivateRoute