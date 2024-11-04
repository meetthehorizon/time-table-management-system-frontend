import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
export default function Home() {
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(UserContext);
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [])
    return (
        <div>
            <Navbar />
            <h1>Home</h1>
            <Link to="/dashboard">Dashboard</Link>
        </div>
    )
}
