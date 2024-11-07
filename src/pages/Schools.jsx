import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FetchAllSchool } from '../utils/FetchAllSchool';
import toast from 'react-hot-toast';
import { server } from '../main';
import { useNavigate } from 'react-router-dom';
import { ErrorHandler } from '../utils/ErrorHandler';
import Navbar from '../components/Navbar';

export default function Schools() {
    const [schools, setSchools] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', address: '', phone: '' });
    const [isUpdating, setIsUpdating] = useState(false);
    const [currentSchoolId, setCurrentSchoolId] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        FetchAllSchool().then((data) => {
            if (data) {
                setSchools(data);
            }
            else {
                navigate('/home');
            }
        });
    }, [refresh]);

    const handleUpdate = (id) => {
        const school = schools.find(s => s.id === id);
        setFormData({ name: school.name, email: school.email, address: school.address, phone: school.phone });
        setIsUpdating(true);
        setCurrentSchoolId(id);
        setFormVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${server}/school/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success('School deleted successfully');
            setRefresh(!refresh);
        } catch (error) {
            ErrorHandler(error);
        }
    };

    const handleAddSchool = () => {
        setFormData({ name: '', email: '', address: '', phone: '' });
        setIsUpdating(false);
        setFormVisible(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isUpdating) {
            try {
                const response = await axios.put(`${server}/school/${currentSchoolId}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                toast.success('School updated successfully');
            }
            catch (error) {
                ErrorHandler(error);
            }
        } else {
            try {
                const response = await axios.post(`${server}/school`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                toast.success('School added successfully');
            }
            catch (error) {
                const errorData = error.response?.data || {};
                if (errorData.email) {
                    toast.error(errorData.email);
                }
                if (errorData.phone) {
                    toast.error(errorData.phone);
                }
                if (errorData.password) {
                    toast.error(errorData.password);
                }
                if (errorData.address) {
                    toast.error(errorData.address);
                }
                if (errorData.name) {
                    toast.error(errorData.name);
                }
                else {
                    toast.error(errorData.detail || 'An error occurred');
                }
            }
        }
        setFormVisible(false);
        setRefresh(!refresh);
    };

    const handleViewUsers = (id) => {
        navigate(`/school/${id}/details`);
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4 text-center">Schools</h1>
                <button
                    onClick={handleAddSchool}
                    className="bg-green-500 text-white px-4 py-2 rounded mb-4"
                >
                    Add New School
                </button>
                {formVisible && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded shadow-lg w-1/3">
                            <form onSubmit={handleSubmit} className="mb-4">
                                <div className="mb-2">
                                    <label className="block text-gray-700">School Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border rounded"
                                        required
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-3 py-2 border rounded"
                                        required
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-gray-700">Address</label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full px-3 py-2 border rounded"
                                        required
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-gray-700">Phone</label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-3 py-2 border rounded"
                                        required
                                    />
                                </div>
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                                    {isUpdating ? 'Update School' : 'Add School'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormVisible(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
                                >
                                    Cancel
                                </button>
                            </form>
                        </div>
                    </div>
                )}
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="py-2 text-center">Name</th>
                            <th className="py-2 text-center">Email</th>
                            <th className="py-2 text-center">Address</th>
                            <th className="py-2 text-center">Contact</th>
                            <th className="py-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schools.map(school => (
                            <tr key={school.id} className="border-t">
                                <td className="py-2 px-4 text-center">{school.name}</td>
                                <td className="py-2 px-4 text-center">{school.email}</td>
                                <td className="py-2 px-4 text-center">{school.address}</td>
                                <td className="py-2 px-4 text-center">{school.phone}</td>
                                <td className="py-2 px-4 text-center">
                                    <button
                                        onClick={() => handleUpdate(school.id)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                                    >
                                        Update
                                    </button>
                                    <button
                                        onClick={() => handleDelete(school.id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => handleViewUsers(school.id)}
                                        className="bg-yellow-500 text-white px-4 py-2 rounded"
                                    >
                                        Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
