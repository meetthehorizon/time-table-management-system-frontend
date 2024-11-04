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
        <div className="min-h-screen bg-gray-100 text-gray-800">
            <Navbar />
            <div className="container mx-auto py-12">
                <div className="text-center">
                    <h1 className="text-5xl font-extrabold mb-4">Welcome to the Timetable Management System</h1>
                    <p className="text-xl mb-8">Manage your schedules efficiently and effortlessly.</p>
                    <Link to="/dashboard" className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-600 transition duration-300">
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    )
}
