import axios from 'axios';
import { toast } from 'react-hot-toast';
import { server } from '../main';

export const fetchAllUsers = async () => {
    const token = localStorage.getItem('token')
    try {
        console.log("hello");
        console.log(token);
        const respose = await axios.get(`${server}/users`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return respose.data;
    }
    catch (error) {
        if (error.response.data.detail !== 'Access Denied') {
            toast.error('Login First');
        }
        else {
            toast.error('Only Admin can access this page');
        }
        return null;
    }
};