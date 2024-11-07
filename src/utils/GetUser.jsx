import { useContext, useEffect } from 'react';
import axios from 'axios';
import { server } from '../main';
import { UserContext } from '../context/UserContext';

export default function GetUser() {
    const { user, setUser, setIsAuthenticated, isAuthenticated } = useContext(UserContext);
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
                    const userData = response.data;
                    setUser(userData);
                    if (userData.roles.includes('ROLE_TEACHER')) {
                        const teacherResponse = await axios.get(`${server}/teachers/${userData.id}`,
                            {
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json'
                                }
                            }
                        );
                        setUser(prevUser => ({ ...prevUser, teacher: teacherResponse.data }));
                    }
                    if (userData.roles.includes('ROLE_EMPLOYEE')) {
                        const employeeResponse = await axios.get(`${server}/employee/${userData.id}`,
                            {
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json'
                                }
                            }
                        );
                        const schoolId = employeeResponse.data.schoolId;
                        const schoolResponse = await axios.get(`${server}/school/${schoolId}`,
                            {
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json'
                                }
                            }
                        );
                        setUser(prevUser => ({ ...prevUser, schoolName: schoolResponse.data.name }));
                        
                    }
                    setIsAuthenticated(true);
                } catch (error) {
                    setIsAuthenticated(false);
                    console.log(error);
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