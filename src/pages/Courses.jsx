import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { server } from '../main';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'bootstrap';

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
};

export default function Courses() {
    const { id } = useParams();
    const [courses, setCourses] = useState([]);
    const [formVisible, setFormVisible] = useState(false);
    const [formData, setFormData] = useState({ sectionId: '', subjectReqId: '', teacherReqId: '' });
    const [isUpdating, setIsUpdating] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${server}/course/school/${id}`, { headers });
                setCourses(response.data);
            } catch (error) {
                toast.error(error.response.data.detail);
            }
        };

        fetchCourses();
    }, [id, refresh]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isUpdating) {
            await updateCourse(formData.id);
        } else {
            await addCourse();
        }
        setFormVisible(false);
        setFormData({ sectionId: '', subjectReqId: '', teacherReqId: '' });
    };

    const addCourse = async () => {
        try {
            const response = await axios.post(`${server}/course`, formData, { headers });
            setRefresh(!refresh);
            toast.success('Course added successfully');
        } catch (error) {
            const errorData = error.response.data;
            if (errorData.detail) {
                toast.error(errorData.detail);
            }
            else {
                Object.keys(errorData).forEach(key => {
                    toast.error(`${key}: ${errorData[key]}`);
                });
            }
            console.error(error);
        }
    };

    const updateCourse = async (courseId) => {
        try {
            const response = await axios.put(`${server}/course/${courseId}`, formData, { headers });
            setRefresh(!refresh);
            toast.success('Course updated successfully');
        } catch (error) {
            const errorData = error.response.data;
            if (errorData.detail) {
                toast.error(errorData.detail);
            }
            else {
                Object.keys(errorData).forEach(key => {
                    toast.error(`${key}: ${errorData[key]}`);
                });
            }
            console.error(error);
        }
    };

    const deleteCourse = async (courseId) => {
        try {
            await axios.delete(`${server}/course/${courseId}`, { headers });
            setRefresh(!refresh);
            toast.success('Course deleted successfully');
        } catch (error) {
            toast.error(error.response.data.detail);
            console.error('Error deleting course:', error);
        }
    };

    const openForm = (course = null) => {
        if (course) {
            setFormData({
                id: course.id, // Add the id to formData for updating
                sectionId: course.sectionId,
                subjectReqId: course.subjectReqId,
                teacherReqId: course.teacherReqId
            });
            setIsUpdating(true);
        } else {
            setFormData({ sectionId: '', subjectReqId: '', teacherReqId: '' });
            setIsUpdating(false);
        }
        setFormVisible(true);
    };

    const handleCreateSubjectReq = () => {
        navigate('/subject-req');
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold text-center mb-4">Courses</h1>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded mr-5" onClick={() => openForm()}>Add Course</button>
                    <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleCreateSubjectReq}>Create Subject Req</button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b text-center">ID</th>
                            <th className="py-2 px-4 border-b text-center">Section ID</th>
                            <th className="py-2 px-4 border-b text-center">Subject Req ID</th>
                            <th className="py-2 px-4 border-b text-center">Teacher Req ID</th>
                            <th className="py-2 px-4 border-b text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course) => (
                            <tr key={course.id}>
                                <td className="py-2 px-4 border-b text-center">{course.id}</td>
                                <td className="py-2 px-4 border-b text-center">{course.sectionId}</td>
                                <td className="py-2 px-4 border-b text-center">{course.subjectReqId}</td>
                                <td className="py-2 px-4 border-b text-center">{course.teacherReqId}</td>
                                <td className="py-2 px-4 border-b text-center">
                                    <button onClick={() => openForm(course)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Update</button>
                                    <button onClick={() => deleteCourse(course.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
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
                            <h5 className="text-xl font-bold">{isUpdating ? 'Update Course' : 'Add Course'}</h5>
                            <button className="text-gray-500" onClick={() => setFormVisible(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Section ID</label>
                                <input type="text" name="sectionId" value={formData.sectionId} onChange={handleInputChange} className="w-full px-3 py-2 border rounded" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Subject Req ID</label>
                                <input type="text" name="subjectReqId" value={formData.subjectReqId} onChange={handleInputChange} className="w-full px-3 py-2 border rounded" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Teacher Req ID</label>
                                <input type="text" name="teacherReqId" value={formData.teacherReqId} onChange={handleInputChange} className="w-full px-3 py-2 border rounded" required />
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
    );
}
