import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { server } from '../main';
import Navbar from '../components/Navbar';
import { fetchSchoolDetails } from '../utils/FetchSchoolDetails';

export default function SchoolDetails() {
    const { id } = useParams();
    const [school, setSchool] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchSchoolDetails(id).then((data) => {
            if (data) {
                setSchool(data);
            } else {
                navigate('/home');
            }
        });
    }, [id]);

    if (!school) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <>
            {/* <Navbar /> */}
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6 text-center">School Details</h1>
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto">
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold">Name: <span className="text-gray-700">{school.name}</span></h2>
                    </div>
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold">Email: <span className="text-gray-700">{school.email}</span></h2>
                    </div>
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold">Address: <span className="text-gray-700">{school.address}</span></h2>
                    </div>
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold">Phone: <span className="text-gray-700">{school.phone}</span></h2>
                    </div>
                    <div className="flex justify-between mt-6">
                        <button
                            onClick={() => navigate(`/school/${id}/sections`)}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Sections
                        </button>
                        <button
                            onClick={() => navigate(`/school/${id}/teacher-req`)}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Teacher Req
                        </button>
                        <button
                            onClick={() => navigate(`/school/${id}/students`)}
                            className="bg-yellow-500 text-white px-4 py-2 rounded"
                        >
                            View Students
                        </button>
                        <button
                            onClick={() => navigate(`/school/${id}/courses`)}
                            className="bg-yellow-500 text-white px-4 py-2 rounded"
                        >
                            Courses
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
