import React, { useEffect } from 'react'
import { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function Dashboard() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useContext(UserContext);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, user]);

    if (!isAuthenticated) {
        return <div>You are not authenticated. Please log in.</div>;
    }

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
                        <h2 className="text-2xl font-semibold text-gray-700">Role: <span className="font-normal break-words">{user.roles.join(',')}</span></h2>
                        {user.roles.includes('ROLE_TEACHER') && user.teacher && (
                            <>
                                <h2 className="text-2xl font-semibold text-gray-700">Subject ID: <span className="font-normal">{user.teacher.subjectId}</span></h2>
                                <h2 className="text-2xl font-semibold text-gray-700">Position: <span className="font-normal">{user.teacher.position}</span></h2>
                            </>
                        )}
                        {user.roles.includes('ROLE_EMPLOYEE') && (
                            <>
                                <h2 className="text-2xl font-semibold text-gray-700">School Name: <span className="font-normal">{user.schoolName}</span></h2>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
