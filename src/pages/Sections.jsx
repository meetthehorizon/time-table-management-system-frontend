import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import { fetchSchoolDetails } from '../utils/FetchSchoolDetails';
import { server } from '../main';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const Sections = () => {
    const { schoolId } = useParams();
    const navigate = useNavigate(); // Initialize useNavigate
    const [sections, setSections] = useState([]);
    const [form, setForm] = useState({ schoolId: '', classLevel: '', runningYear: '', section: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [schoolName, setSchoolName] = useState('');
    const [refresh, setRefresh] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchSections();
        fetchSchoolDetails(schoolId).then((data) => {
            if (data) {
                setSchoolName(data.name);
            }
        });
    }, [schoolId, refresh]);

    const fetchSections = async () => {
        try {
            const response = await axios.get(`${server}/section/school/${schoolId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = Array.isArray(response.data) ? response.data : [];
            setSections(data);
        } catch (error) {
            toast.error(error.response.data.detail);
            console.error('Error fetching sections:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`${server}/section/${form.id}`, form, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                await axios.post(`${server}/section`, { ...form, schoolId }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
            setRefresh(!refresh);
            setForm({ schoolId: '', classLevel: '', runningYear: '', section: '' });
            setIsEditing(false);
            setShowModal(false);
            toast.success(`Section ${isEditing ? 'updated' : 'created'} successfully`);
        } catch (error) {
            console.error(error);
            const errorData = error.response.data;
            if (errorData.runningYear) {
                toast.error(errorData.runningYear);
            }
            if (errorData.classLevel) {
                toast.error(errorData.classLevel);
            }
            if (errorData.section) {
                toast.error(errorData.section);
            }
            else {
                toast.error('An error occurred.');
            }
            console.error(`Error ${isEditing ? 'updating' : 'creating'} section:`, error);
        }
    };

    const handleEdit = (section) => {
        setForm(section);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${server}/section/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            toast.success('Section deleted successfully');
            setRefresh(!refresh);
        } catch (error) {
            console.error('Error deleting section:', error);
        }
    };

    const handleAddNew = () => {
        setForm({ schoolId: '', classLevel: '', runningYear: '', section: '' });
        setIsEditing(false);
        setShowModal(true);
    };

    const handleCreateTimetable = (sectionId) => {
        navigate(`/school/${schoolId}/sections/${sectionId}`);
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4 text-center">Sections for {schoolName}</h1>
                <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4" onClick={handleAddNew}>Add New Section</button>
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b text-center">Section ID</th>
                            <th className="py-2 px-4 border-b text-center">School ID</th>
                            <th className="py-2 px-4 border-b text-center">Class</th>
                            <th className="py-2 px-4 border-b text-center">Running Year</th>
                            <th className="py-2 px-4 border-b text-center">Section</th>
                            <th className="py-2 px-4 border-b text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sections.map(section => (
                            <tr key={section.id}>
                                <td className="py-2 px-4 border-b text-center">{section.id}</td>
                                <td className="py-2 px-4 border-b text-center">{section.schoolId}</td>
                                <td className="py-2 px-4 border-b text-center">{section.classLevel}</td>
                                <td className="py-2 px-4 border-b text-center">{section.runningYear}</td>
                                <td className="py-2 px-4 border-b text-center">{section.section}</td>
                                <td className="py-2 px-4 border-b text-center">
                                    <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleEdit(section)}>Edit</button>
                                    <button className="bg-red-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleDelete(section.id)}>Delete</button>
                                    <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={() => handleCreateTimetable(section.id)}>Create Timetable</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded shadow-lg w-96 h-96">
                            <div className="flex justify-between items-center mb-4">
                                <h5 className="text-xl font-bold">{isEditing ? 'Edit Section' : 'Add Section'}</h5>
                                <button className="text-gray-500" onClick={() => setShowModal(false)}>&times;</button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <input type="hidden" name="schoolId" value={schoolId} />
                                <div className="mb-4">
                                    <label className="block text-gray-700">Class Level:</label>
                                    <input type="text" className="w-full px-3 py-2 border rounded" name="classLevel" value={form.classLevel} onChange={handleInputChange} required />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Running Year:</label>
                                    <input type="text" className="w-full px-3 py-2 border rounded" name="runningYear" value={form.runningYear} onChange={handleInputChange} required />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Section:</label>
                                    <input type="text" className="w-full px-3 py-2 border rounded" name="section" value={form.section} onChange={handleInputChange} required />
                                </div>
                                <div className="flex justify-between">
                                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">{isEditing ? 'Update' : 'Create'}</button>
                                    <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setShowModal(false)}>Close</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Sections;
