import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { server } from '../main';
import toast from 'react-hot-toast';
import axios from 'axios';
import Navbar from '../components/Navbar';

const TimeTable = () => {
    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const token = localStorage.getItem('token');

    const { schoolId, sectionId } = useParams();
    const [schoolName, setSchoolName] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        courseId: '',
        startTime: '',
        endTime: '',
        day: ''
    });
    const [slots, setSlots] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [teachers, setTeachers] = useState({});
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const fetchSchoolName = async () => {
            try {
                const response = await axios.get(`${server}/school/${schoolId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                setSchoolName(response.data.name);
            } catch (error) {
                console.error('Error fetching school name:', error);
            }
        };

        const fetchSlots = async () => {
            try {
                const response = await axios.get(`${server}/slots/section/${sectionId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                setSlots(response.data);
                generateTimeSlots(response.data);
                fetchTeachers(response.data);
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
                console.error('Error fetching slots:', error);
            }
        };

        fetchSchoolName();
        fetchSlots();
    }, [schoolId, sectionId, refresh]);

    const fetchTeachers = async (slots) => {
        const teacherIds = Array.from(new Set(slots.map(slot => slot.teacherReq.teacherId)));
        const teacherDetails = {};
        await Promise.all(teacherIds.map(async (id) => {
            try {
                const response = await axios.get(`${server}/teachers/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                teacherDetails[id] = response.data.user.name;
            } catch (error) {
                console.error('Error fetching teacher details:', error);
            }
        }));
        setTeachers(teacherDetails);
    };

    const generateTimeSlots = (slots) => {
        const uniqueTimes = Array.from(new Set(slots.map(slot => slot.slots.startTime))).sort((a, b) => a - b);
        setTimeSlots(uniqueTimes);
    };

    const formatTime = (time) => {
        const hours = Math.floor(time / 100).toString().padStart(2, '0');
        const minutes = (time % 100).toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const handleCreateSlot = () => {
        setShowForm(true);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${server}/slots`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            toast.success('Time slot created successfully');
            console.log('Form submitted:', response.data);
            setSlots([...slots, response.data]);
            generateTimeSlots([...slots, response.data]);
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
        }
        setShowForm(false);
    };

    const handleDeleteSlot = async (slotId) => {
        try {
            await axios.delete(`${server}/slots/${slotId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            toast.success('Time slot deleted successfully');
            setRefresh(!refresh);
        } catch (error) {
            const errorData = error.response.data;
            if (errorData.detail) {
                toast.error(errorData.detail);
            } else {
                Object.keys(errorData).forEach(key => {
                    toast.error(`${key}: ${errorData[key]}`);
                });
            }
            console.error('Error deleting slot:', error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="p-5">
                <h1 className="text-2xl font-bold mb-5 text-center">{schoolName} - Weekly Time Table</h1>
                <button
                    className="mb-5 px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={handleCreateSlot}
                >
                    Create Slot
                </button>
                {showForm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                        <form className="bg-white p-5 rounded shadow-lg" onSubmit={handleFormSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Course ID</label>
                                <input
                                    type="text"
                                    name="courseId"
                                    value={formData.courseId}
                                    onChange={handleFormChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Start Time</label>
                                <input
                                    type="number"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleFormChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    min="0"
                                    max="2359"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">End Time</label>
                                <input
                                    type="number"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleFormChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    min="0"
                                    max="2359"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Day</label>
                                <select
                                    name="day"
                                    value={formData.day}
                                    onChange={handleFormChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                >
                                    <option value="">Select a day</option>
                                    {days.map(day => (
                                        <option key={day} value={day}>{day}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="mr-2 px-4 py-2 bg-gray-500 text-white rounded"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                )}
                <table className="min-w-full border-collapse border border-gray-200">
                    <thead>
                        <tr>
                            <th className="border border-gray-200 p-4"></th>
                            {days.map(day => (
                                <th key={day} className="border border-gray-200 p-4 bg-gray-100">{day}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {timeSlots.map((time) => {
                            return (
                                <tr key={time}>
                                    <td className="border border-gray-200 p-4">
                                        {formatTime(time)} to {formatTime(time + 100)}
                                    </td>
                                    {days.map(day => (
                                        <td key={day + time} className="border border-gray-200 p-4">
                                            {slots.filter(slot => slot.slots.day === day && slot.slots.startTime === time).map(slot => (
                                                <div key={slot.slots.id}>
                                                    Subject Code: {slot.subject.code}<br />
                                                    Subject Name: {slot.subject.name}<br />
                                                    Teacher: {teachers[slot.teacherReq.teacherId] || 'Loading...'}<br />
                                                    <button
                                                        className="mt-2 px-2 py-1 bg-red-500 text-white rounded"
                                                        onClick={() => handleDeleteSlot(slot.slots.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            ))}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default TimeTable;
