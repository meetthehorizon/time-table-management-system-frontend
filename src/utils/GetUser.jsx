import { useContext, useEffect } from 'react';
import axios from 'axios';
import { server } from '../main';
import { UserContext } from '../context/UserContext';

export default function GetUser() {
    const { setUser, setIsAuthenticated, isAuthenticated } = useContext(UserContext);
    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('userid');

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                try {
                    const response = await axios.get(`${server}/users/${userid}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    setIsAuthenticated(true);
                    setUser(response.data);
                } catch (error) {
                    setIsAuthenticated(false);
                    console.log(error.response.data);
                }
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        };

        fetchUser();
    }, [token, userid, isAuthenticated]);
}