import React, { useEffect } from 'react'
import { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Navbar from '../components/Navbar'

export default function Dashboard() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useContext(UserContext);
    const [init, setInit] = useState(false)
    console.log(isAuthenticated, user)

    useEffect(() => {
        if (!isAuthenticated && init) {
            navigate('/login');
        }
        setInit(true);
    }, [isAuthenticated, init]);

    if (!user) {
        return <div>Loading...</div>;
    }
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center">
                <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-lg transform transition duration-500 hover:scale-105">
                    <h1 className="text-4xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-600">Dashboard</h1>
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold text-gray-700">Name: <span className="font-normal">{user.name}</span></h2>
                        <h2 className="text-2xl font-semibold text-gray-700">Email: <span className="font-normal">{user.email}</span></h2>
                        <h2 className="text-2xl font-semibold text-gray-700">Phone: <span className="font-normal">{user.phone}</span></h2>
                        <h2 className="text-2xl font-semibold text-gray-700">Address: <span className="font-normal">{user.address}</span></h2>
                        <h2 className="text-2xl font-semibold text-gray-700">Role: <span className="font-normal">{user.roles}</span></h2>
                    </div>
                </div>
            </div>
        </>
    )
}
