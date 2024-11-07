import axios from 'axios';
import { server } from '../main';
import toast from 'react-hot-toast';

const token = localStorage.getItem('token');
export const fetchSchoolDetails = async (id) => {
    try {
        const response = await axios.get(`${server}/school/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        toast.error(error.response.data.detail);
        console.error('Error fetching school details:', error);
    }
};