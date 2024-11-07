import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { server } from '../main';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Subjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [newSubject, setNewSubject] = useState({ name: '', code: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentSubjectId, setCurrentSubjectId] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        fetchSubjects().then((data) => {
            if (data) {
                setSubjects(data);
            } else {
                navigate('/home');
            }
        });
    }, []);

    const fetchSubjects = async () => {
        try {
            const response = await axios.get(`${server}/sub`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            toast.error(error.response.data.detail);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSubject({ ...newSubject, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };
            if (isEditing) {
                const response = await axios.put(`${server}/sub/${currentSubjectId}`, newSubject, config);
                setSubjects(subjects.map(subject => subject.id === currentSubjectId ? response.data : subject));
            } else {
                const response = await axios.post(`${server}/sub`, newSubject, config);
                setSubjects([...subjects, response.data]);
            }
            resetForm();
        } catch (error) {
            toast.error(error.response.data.detail);
        }
    };

    const handleDelete = async (id) => {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };
            await axios.delete(`${server}/sub/${id}`, config);
            setSubjects(subjects.filter(subject => subject.id !== id));
        } catch (error) {
            toast.error(error.response.data.detail);
            console.error('There was an error deleting the subject!', error);
        }
    };

    const resetForm = () => {
        setNewSubject({ name: '', code: '' });
        setIsModalOpen(false);
        setIsEditing(false);
        setCurrentSubjectId(null);
    };

    const openModal = (subject = null) => {
        if (subject) {
            setNewSubject({ name: subject.name, code: subject.code });
            setIsEditing(true);
            setCurrentSubjectId(subject.id);
        }
        setIsModalOpen(true);
    };

    return (
        <>
            <Navbar />
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Subjects</h1>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                    onClick={() => openModal()}
                >
                    Add Subject
                </button>
                <table className="min-w-full bg-white border">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b text-center">ID</th>
                            <th className="py-2 px-4 border-b text-center">Name</th>
                            <th className="py-2 px-4 border-b text-center">Code</th>
                            <th className="py-2 px-4 border-b text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.map(subject => (
                            <tr key={subject.id}>
                                <td className="py-2 px-4 border-b text-center">{subject.id}</td>
                                <td className="py-2 px-4 border-b text-center">{subject.name}</td>
                                <td className="py-2 px-4 border-b text-center">{subject.code}</td>
                                <td className="py-2 px-4 border-b text-center">
                                    <button
                                        className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                                        onClick={() => openModal(subject)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                        onClick={() => handleDelete(subject.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                            <span
                                className="absolute top-2 right-2 text-gray-500 cursor-pointer"
                                onClick={resetForm}
                            >
                                &times;
                            </span>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Name:</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newSubject.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border rounded"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Code:</label>
                                    <input
                                        type="text"
                                        name="code"
                                        value={newSubject.code}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border rounded"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                                        onClick={resetForm}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                    >

                                        {isEditing ? 'Update' : 'Add'} Subject
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Subjects;
