import React from 'react';
import { Link } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, setIsAuthenticated } = useContext(UserContext);
    const logoutHandler = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userid');
        setIsAuthenticated(false);
    }

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated])

    return (
        <div className="bg-blue-500 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-lg font-bold">
                    <Link to="/">CourseSync</Link>
                </div>
                <div className="space-x-4">
                    <Link to="/" className="text-white hover:text-gray-200">Home</Link>
                    <Link to="/dashboard" className="text-white hover:text-gray-200">Dashboard</Link>
                    <Link to="/admin/all" className="text-white hover:text-gray-200">All User</Link>
                    <span onClick={logoutHandler} className="text-white hover:text-gray-200 cursor-pointer">Logout </span>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
