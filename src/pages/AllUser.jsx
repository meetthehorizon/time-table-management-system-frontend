import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { server } from '../main';
import Navbar from '../components/Navbar';
import { fetchAllUsers } from '../utils/FetchAllUser';

const AllUser = () => {

    const [users, setUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', roles: '', password: '', address: '', phone: '' });
    const [refresh, setRefresh] = useState(false);
    const [updateForm, setUpdateForm] = useState(null);
    const token = localStorage.getItem('token');
    const [role, setRole] = useState(null);
    const [roleName, setRoleName] = useState('');
    const [roleDelete, setRoleDelete] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchAllUsers().then((data) => {
            if (data) {
                setUsers(data);
            }
        });

        if (updateForm) {
            const user = users.find(user => user.id === updateForm);
            setNewUser({
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address
            });
        }
        else {
            setNewUser({ name: '', email: '', roles: '', password: '', address: '', phone: '' });
        }
    }, [refresh, role, updateForm]);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${server}/auth/signup`, {
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                password: newUser.password,
                address: newUser.address
            },
                { headers: { 'Content-Type': 'application/json' } }
            );
            setRefresh(!refresh);
            toast.success("User Created Successfully");
            setShowForm(false);
            setNewUser({ name: '', email: '', roles: '', password: '', address: '', phone: '' });
        }
        catch (error) {
            console.log(error.response);
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

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${server}/users/${updateForm}`,
                {
                    name: newUser.name,
                    email: newUser.email,
                    phone: newUser.phone,
                    address: newUser.address
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
            toast.success('User Updated Successfully');
            setRefresh(!refresh);
            setUpdateForm(null);
            setShowForm(false);
            setNewUser({ name: '', email: '', roles: '', password: '', address: '', phone: '' });
        }
        catch (error) {
            toast.error('User Update Failed');
        }
    };

    const handleDelete = async (userId) => {
        try {
            await axios.delete(`${server}/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            setRefresh(!refresh);
            toast.success('User Deleted Successfully');
        }
        catch (e) {
            toast.error('User Deletion Failed');
        }
    }
    const handleCloseForm = () => {
        setShowForm(false);
        setUpdateForm(null);
    };

    const handleAddRole = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${server}/user-roles`, {
                id: role,
                roleName: roleName
            },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
            setRefresh(!refresh);
            setRoleName('');
            toast.success('Role Added Successfully');
            setRole(null);
        }
        catch (error) {
            toast.error('Role Addition Failed');
        }
    }

    const handleDeleteRole = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.delete(`${server}/user-roles`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                data: {
                    id: role,
                    roleName: roleName
                }
            });
            setRefresh(!refresh);
            toast.success('Role Deleted Successfully');
            setRole(null);
            setRoleDelete(false);
            setRoleName('');
        }
        catch (error) {
            toast.error('Role Deletion Failed');
        }
    }

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    }

    const roles = ['ROLE_USER',
        'ROLE_ADMIN',
        'ROLE_PARENT',
        'ROLE_STUDENT',
        'ROLE_TEACHER',
        'ROLE_EMPLOYEE',
        'ROLE_TT_INCHARGE',
        'ROLE_SCHOOL_INCHARGE',
        'ROLE_GENERAL_MANAGER'];

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4 text-center">All Users</h1>
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded mb-4"
                    onClick={() => setShowForm(true)}
                >
                    Create New User
                </button>
                {(showForm || updateForm) && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded shadow-lg w-1/3">
                            <h2 className="text-xl font-bold mb-4">{updateForm ? 'Update User' : 'Create New User'}</h2>
                            <form onSubmit={updateForm ? handleUpdate : handleCreateUser}>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Name:</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newUser.name}
                                        onChange={handleFormChange}
                                        className="border p-2 rounded w-full"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Email:</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={newUser.email}
                                        onChange={handleFormChange}
                                        className="border p-2 rounded w-full"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Phone:</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={newUser.phone}
                                        onChange={handleFormChange}
                                        className="border p-2 rounded w-full"
                                        required
                                    />
                                </div>
                                {(!updateForm) && (
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Password:</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={newUser.password}
                                            onChange={handleFormChange}
                                            className="border p-2 rounded w-full"
                                            required
                                        />
                                    </div>
                                )}
                                <div className="mb-4">
                                    <label className="block text-gray-700">Address:</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={newUser.address}
                                        onChange={handleFormChange}
                                        className="border p-2 rounded w-full"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                                        onClick={handleCloseForm}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {(role) &&
                    (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-6 rounded shadow-lg w-1/3">
                                <h2 className="text-xl font-bold mb-4">{roleDelete ? 'Delete Role' : 'Add Role'}</h2>
                                <form onSubmit={roleDelete ? handleDeleteRole : handleAddRole}>
                                    <div className="mb-4">
                                        <label className="block text-gray-700"></label>
                                        <select
                                            name="roleName"
                                            value={roleName}
                                            onChange={(e) => setRoleName(e.target.value)}
                                            className="border p-2 rounded w-full"
                                            required
                                        >
                                            <option value="" disabled>Select a Role</option>
                                            {roles.map((name, index) => (
                                                <option key={index} value={name}>
                                                    {name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button
                                        type="button"
                                        className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                                        onClick={() => setRole(null)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                    >
                                        Submit
                                    </button>
                                </form>
                            </div>
                        </div>
                    )
                }
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">ID</th>
                            <th className="py-2 px-4 border-b">Name</th>
                            <th className="py-2 px-4 border-b">Email</th>
                            <th className="py-2 px-4 border-b">Phone</th>
                            <th className="py-2 px-4 border-b">Role</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="py-2 px-4 border-b">{user.id}</td>
                                <td className="py-2 px-4 border-b">{user.name}</td>
                                <td className="py-2 px-4 border-b">{user.email}</td>
                                <td className="py-2 px-4 border-b">{user.phone}</td>
                                <td className="py-2 px-4 border-b">{Array.isArray(user.roles) ? user.roles.join(',') : ''}</td>
                                <td className="py-2 px-4 border-b">
                                    <button
                                        className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                        onClick={() => { setUpdateForm(user.id) }}
                                    >
                                        Update
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                                        onClick={() => handleDelete(user.id)}>
                                        Delete
                                    </button>
                                    <button
                                        className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                                        onClick={() => {
                                            setRole(user.id);
                                            setRoleDelete(false);
                                        }}>
                                        Add Role
                                    </button>
                                    <button
                                        className="bg-orange-500 text-white px-2 py-1 rounded mr-2"
                                        onClick={() => {
                                            setRole(user.id);
                                            setRoleDelete(true);
                                        }}>
                                        Delete Role
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default AllUser;
