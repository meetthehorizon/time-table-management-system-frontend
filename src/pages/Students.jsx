import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { server } from '../main';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ErrorHandler } from '../utils/ErrorHandler';

export default function Students() {
    const [students, setStudents] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const [formData, setFormData] = useState({ sectionId: '' });
    const [isUpdating, setIsUpdating] = useState(false);
    const [currentStudentId, setCurrentStudentId] = useState(null);
    const [currentEnrollmentId, setCurrentEnrollmentId] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const fetchAllStudents = async () => {
        try {
            const response = await axios.get(`${server}/users/students`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            ErrorHandler(error);
            return null;
        }
    };

    const fetchAllEnrollments = async () => {
        try {
            const response = await axios.get(`${server}/enrollment`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            ErrorHandler(error);
            return null;
        }
    };

    useEffect(() => {
        fetchAllStudents().then((data) => {
            if (data) {
                setStudents(data);
            } else {
                setStudents([]);
            }
        });
        fetchAllEnrollments().then((data) => {
            if (data) {
                setEnrollments(data);
            } else {
                setEnrollments([]);
            }
        });
    }, [refresh]);

    const handleUpdate = (studentId) => {
        const enrollment = enrollments.find(e => e.studentId === studentId);
        if (enrollment) {
            setFormData({ sectionId: enrollment.sectionId });
            setIsUpdating(true);
            setCurrentStudentId(studentId);
            setCurrentEnrollmentId(enrollment.id);
            setFormVisible(true);
        }
    };

    const handleDelete = async (studentId) => {
        const enrollment = enrollments.find(e => e.studentId === studentId);
        if (enrollment) {
            try {
                await axios.delete(`${server}/enrollment/${enrollment.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                toast.success('Student deleted successfully');
                setRefresh(!refresh);
            } catch (error) {
                ErrorHandler(error);
            }
        }
    };

    const handleAddStudent = (id) => {
        setFormData({ sectionId: '' });
        setIsUpdating(false);
        setCurrentStudentId(id);
        setFormVisible(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isUpdating) {
                await axios.put(`${server}/enrollment/${currentEnrollmentId}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                toast.success('Student enrollment updated successfully');
            } else {
                await axios.post(`${server}/enrollment`, { studentId: currentStudentId, ...formData }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                toast.success('Student enrolled successfully');
            }
        } catch (error) {
            ErrorHandler(error);
        }
        setFormVisible(false);
        setRefresh(!refresh);
    };

    const getSectionId = (studentId) => {
        const enrollment = enrollments.find(e => e.studentId === studentId);
        return enrollment ? enrollment.sectionId : 'Not Enrolled';
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4 text-center">Students</h1>
                {formVisible && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded shadow-lg w-1/3">
                            <form onSubmit={handleSubmit} className="mb-4">
                                <div className="mb-2">
                                    <label className="block text-gray-700">Section ID</label>
                                    <input
                                        type="text"
                                        value={formData.sectionId}
                                        onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })}
                                        className="w-full px-3 py-2 border rounded"
                                        required
                                    />
                                </div>
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                                    {isUpdating ? 'Update Enrollment' : 'Enroll'}
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
                            <th className="py-2 text-center">Section</th>
                            <th className="py-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student.id} className="border-t">
                                <td className="py-2 px-4 text-center">{student.name}</td>
                                <td className="py-2 px-4 text-center">{student.email}</td>
                                <td className="py-2 px-4 text-center">{student.address}</td>
                                <td className="py-2 px-4 text-center">{student.phone}</td>
                                <td className="py-2 px-4 text-center">
                                    {getSectionId(student.id)}
                                </td>
                                <td className="py-2 px-4 text-center">
                                    <button
                                        onClick={() => handleUpdate(student.id)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                                    >
                                        Update Enrollment
                                    </button>
                                    <button
                                        onClick={() => handleDelete(student.id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                                    >
                                        Delete Enrollment
                                    </button>
                                    <button
                                        onClick={() => handleAddStudent(student.id)}
                                        className="bg-green-500 text-white px-4 py-2 rounded"
                                    >
                                        Enroll
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
