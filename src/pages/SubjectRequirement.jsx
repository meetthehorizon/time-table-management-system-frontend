import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { server } from '../main';
import toast from 'react-hot-toast';
import { ErrorHandler } from '../utils/ErrorHandler';

export default function SubjectRequirement() {
    const { id } = useParams();
    const [requirements, setRequirements] = useState([]);
    const [subjects, setSubjects] = useState([]); // State to store subjects
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        classLevel: '',
        numLecture: '',
        numLab: '',
        subjectId: '',
        teacherPosition: '',
        attendanceCriteria: ''
    });
    const [refresh, setRefresh] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchRequirements = async () => {
            try {
                const response = await axios.get(`${server}/subject-req`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                setRequirements(response.data);
            } catch (error) {
                console.error(error);
                navigate('/home');
            }
        };

        const fetchSubjects = async () => {
            try {
                const response = await axios.get(`${server}/sub`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                setSubjects(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchRequirements();
        fetchSubjects();
    }, [id, refresh]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.id) {
                await axios.put(`${server}/subject-req/${formData.id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${server}/subject-req`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
            setShowForm(false);
            setRefresh(!refresh);
            toast.success(`${formData.id ? 'Requirement updated' : 'Requirement added'}`);
        } catch (error) {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                Object.keys(errorData).forEach(key => {
                    toast.error(`${key}: ${errorData[key]}`);
                });
            } else {
                ErrorHandler(error);
            }
            console.error(error);
        }
    };

    const handleDelete = async (reqId) => {
        try {
            await axios.delete(`${server}/subject-req/${reqId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRefresh(!refresh);
            toast.success('Requirement deleted');
        } catch (error) {
            ErrorHandler(error);
            console.error(error);
        }
    };

    const openForm = (req = {}) => {
        setFormData({
            id: req.id || '', // Include id in formData
            classLevel: req.classLevel || '',
            numLecture: req.numLecture || '',
            numLab: req.numLab || '',
            subjectId: req.subjectId || '',
            teacherPosition: req.teacherPosition || '',
            attendanceCriteria: req.attendanceCriteria || ''
        });
        setShowForm(true);
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6 text-center">Subject Requirements</h1>
                <button onClick={() => openForm()} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">Add Requirement</button>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">ID</th>
                                <th className="py-2 px-4 border-b">Class</th>
                                <th className="py-2 px-4 border-b">Number of Lectures</th>
                                <th className="py-2 px-4 border-b">Number of Labs</th>
                                <th className="py-2 px-4 border-b">Subject</th>
                                <th className="py-2 px-4 border-b">Position</th>
                                <th className="py-2 px-4 border-b">Attendance Criteria</th>
                                <th className="py-2 px-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requirements.map((req) => {
                                const subject = subjects.find(sub => sub.id === req.subjectId);
                                return (
                                    <tr key={req.id}>
                                        <td className="py-2 px-4 border-b text-center">{req.id}</td>
                                        <td className="py-2 px-4 border-b text-center">{req.classLevel}</td>
                                        <td className="py-2 px-4 border-b text-center">{req.numLecture}</td>
                                        <td className="py-2 px-4 border-b text-center">{req.numLab}</td>
                                        <td className="py-2 px-4 border-b text-center">{subject ? `${subject.code} - ${subject.name}` : 'N/A'}</td>
                                        <td className="py-2 px-4 border-b text-center">{req.teacherPosition}</td>
                                        <td className="py-2 px-4 border-b text-center">{req.attendanceCriteria}</td>
                                        <td className="py-2 px-4 border-b text-center">
                                            <button onClick={() => openForm(req)} className="mr-2 px-2 py-1 bg-yellow-500 text-white rounded">Edit</button>
                                            <button onClick={() => handleDelete(req.id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            {showForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-2xl mb-4">{formData.id ? 'Update Requirement' : 'Add Requirement'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block mb-2">Class Level</label>
                                <input type="text" name="classLevel" value={formData.classLevel} onChange={handleInputChange} className="w-full p-2 border rounded" />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Number of Lectures</label>
                                <input type="number" name="numLecture" value={formData.numLecture} onChange={handleInputChange} className="w-full p-2 border rounded" />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Number of Labs</label>
                                <input type="number" name="numLab" value={formData.numLab} onChange={handleInputChange} className="w-full p-2 border rounded" />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Subject</label>
                                <select name="subjectId" value={formData.subjectId} onChange={handleInputChange} className="w-full p-2 border rounded">
                                    <option value="">Select Subject</option>
                                    {subjects.map((subject) => (
                                        <option key={subject.id} value={subject.id}>
                                            {subject.code} - {subject.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Teacher Position</label>
                                <select name="teacherPosition" value={formData.teacherPosition} onChange={handleInputChange} className="w-full p-2 border rounded">
                                    <option value="">Select Position</option>
                                    <option value="PRT">PRT</option>
                                    <option value="PGT">PGT</option>
                                    <option value="TGT">TGT</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Attendance Criteria</label>
                                <input type="text" name="attendanceCriteria" value={formData.attendanceCriteria} onChange={handleInputChange} className="w-full p-2 border rounded" />
                            </div>
                            <div className="flex justify-end">
                                <button type="button" onClick={() => setShowForm(false)} className="mr-2 px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">{formData.id ? 'Update' : 'Add'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
