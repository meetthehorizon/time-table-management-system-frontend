import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { server } from '../main';
import toast from 'react-hot-toast';

export default function SchoolUsers() {
    const { id } = useParams();
    const [users, setUsers] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${server}/school/${id}/users`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUsers(response.data);
            } catch (error) {
                toast.error('Failed to fetch users');
            }
        };
        fetchUsers();
    }, [id, token]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Users of School {id}</h1>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 text-center">Name</th>
                        <th className="py-2 text-center">Email</th>
                        <th className="py-2 text-center">Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id} className="border-t">
                            <td className="py-2 px-4 text-center">{user.name}</td>
                            <td className="py-2 px-4 text-center">{user.email}</td>
                            <td className="py-2 px-4 text-center">{user.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
