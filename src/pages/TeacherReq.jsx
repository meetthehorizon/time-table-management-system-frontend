import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { server } from '../main';
import toast from 'react-hot-toast';

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
};

export default function TeacherReq() {
    const { id } = useParams();
    const [teacherReq, setTeacherReq] = useState([]);
    const [subjects, setSubjects] = useState([]); // State variable for subjects
    const [formVisible, setFormVisible] = useState(false);
    const [formData, setFormData] = useState({ position: '', subjectId: '', teacherId: '' });
    const [isUpdating, setIsUpdating] = useState(false);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get(`${server}/teacher-req/school/${id}`, { headers });
                setTeacherReq(response.data);
            } catch (error) {
                toast.error(error.response.data.detail);
            }
        };

        const fetchSubjects = async () => {
            try {
                const response = await axios.get(`${server}/sub`, { headers });
                setSubjects(response.data);
            } catch (error) {
                toast.error(error.response.data.detail);
            }
        };

        fetchRequests();
        fetchSubjects();
    }, [id, refresh]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isUpdating) {
            await updateRequest(formData.id);
        } else {
            await addRequest();
        }
        setFormVisible(false);
        setFormData({ position: '', subjectId: '', teacherId: '' });
    };

    const addRequest = async () => {
        try {
            const response = await axios.post(`${server}/teacher-req`, { ...formData, schoolId: id }, { headers });
            setRefresh(!refresh);
            toast.success('Teacher req added successfully');
        } catch (error) {
            toast.error(error.response.data.detail);
            console.error('Error adding teacher request:', error);
        }
    };

    const updateRequest = async (reqId) => {
        try {
            const response = await axios.put(`${server}/teacher-req/${reqId}`, { ...formData, schoolId: id }, { headers });
            setRefresh(!refresh);
            toast.success('Teacher req updated successfully');
        } catch (error) {
            toast.error(error.response.data.detail);
            console.error('Error updating teacher request:', error);
        }
    };

    const deleteRequest = async (reqId) => {
        try {
            await axios.delete(`${server}/teacher-req/${reqId}`, { headers });
            setRefresh(!refresh);
            toast.success('Teacher req deleted successfully');
        } catch (error) {
            console.error('Error deleting teacher request:', error);
        }
    };

    const openForm = (req = null) => {
        if (req) {
            setFormData({
                id: req.id, // Add the id to formData for updating
                position: req.position,
                subjectId: req.subjectId,
                teacherId: req.teacherId
            });
            setIsUpdating(true);
        } else {
            setFormData({ position: '', subjectId: '', teacherId: '' });
            setIsUpdating(false);
        }
        setFormVisible(true);
    };

    const getSubjectDisplay = (subjectId) => {
        const subject = subjects.find(sub => sub.id === subjectId);
        return subject ? `${subject.code} - ${subject.name}` : 'Unknown';
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4 text-center">Teacher Requirements</h1>
                <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4" onClick={() => openForm()}>Add Requirements</button>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b text-center">ID</th>
                                <th className="py-2 px-4 border-b text-center">School ID</th>
                                <th className="py-2 px-4 border-b text-center">Position</th>
                                <th className="py-2 px-4 border-b text-center">Subject</th>
                                <th className="py-2 px-4 border-b text-center">Teacher ID</th>
                                <th className="py-2 px-4 border-b text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teacherReq.map((req) => (
                                <tr key={req.id}>
                                    <td className="py-2 px-4 border-b text-center">{req.id}</td>
                                    <td className="py-2 px-4 border-b text-center">{req.schoolId}</td>
                                    <td className="py-2 px-4 border-b text-center">{req.position}</td>
                                    <td className="py-2 px-4 border-b text-center">{getSubjectDisplay(req.subjectId)}</td>
                                    <td className="py-2 px-4 border-b text-center">{req.teacherId}</td>
                                    <td className="py-2 px-4 border-b text-center">
                                        <button onClick={() => openForm(req)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Update</button>
                                        <button onClick={() => deleteRequest(req.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {formVisible && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded shadow-lg w-96 h-96">
                            <div className="flex justify-between items-center mb-4">
                                <h5 className="text-xl font-bold">{isUpdating ? 'Update Requirement' : 'Add Requirement'}</h5>
                                <button className="text-gray-500" onClick={() => setFormVisible(false)}>&times;</button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Position</label>
                                    <select name="position" value={formData.position} onChange={handleInputChange} className="w-full px-3 py-2 border rounded" required>
                                        <option value="">Select Position</option>
                                        <option value="PRT">PRT</option>
                                        <option value="TGT">TGT</option>
                                        <option value="PGT">PGT</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Subject</label>
                                    <select name="subjectId" value={formData.subjectId} onChange={handleInputChange} className="w-full px-3 py-2 border rounded" required>
                                        <option value="">Select Subject</option>
                                        {subjects.map((subject) => (
                                            <option key={subject.id} value={subject.id}>
                                                {subject.code} - {subject.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Teacher ID</label>
                                    <input type="text" name="teacherId" value={formData.teacherId} onChange={handleInputChange} className="w-full px-3 py-2 border rounded" required />
                                </div>
                                <div className="flex justify-between">
                                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">{isUpdating ? 'Update' : 'Add'}</button>
                                    <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setFormVisible(false)}>Close</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
