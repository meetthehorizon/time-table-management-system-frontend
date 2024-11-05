import React, { useEffect } from 'react'
import Inputfield from '../components/Inputfield'
import logo from '../assets/online-job-interview_23-2148613123.avif'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import { server } from '../main'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../context/UserContext'

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { isAuthenticated, setIsAuthenticated } = useContext(UserContext);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${server}/auth/login`, {
                email, password
            },
                { headers: { 'Content-Type': 'application/json' } }
            );
            console.log(response.data);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userid', response.data.userid);
            toast.success("Logged in Successfully");
            setIsAuthenticated(true);
            setEmail('');
            setPassword('');
            navigate('/home');
        }
        catch (error) {
            console.log(error);
            if (error.response.data.email) {
                toast.error(error.response.data.email);
            }
            if (error.response.data.password) {
                toast.error(error.response.data.password);
            }
            else {
                toast.error(error.response.data.detail);
            }
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/home');
        }
    }, [isAuthenticated]);

    return (
        <div className='h-full w-full flex justify-center items-center bg-[#f8f8f8]'>
            <div className='w-[1150px] bg-white shadow-lg rounded-lg p-6 mx-auto flex items-center'>
                <div className='text-center w-1/2 overflow-hidden'>
                    <img src={logo} alt='No Image' />
                </div>
                <div className='w-1/2 overflow-hidden flex-col space-y-[20px]'>
                    <h2 className='leading-[1.66] font-bold text-[#222] text-[35px]'>Login to CourseSync</h2>
                    <form className='w-full flex-col space-y-5' onSubmit={submitHandler}>
                        <Inputfield icon='email' placeholder='Email' name='email' value={email} onChange={setEmail} type='text' />
                        <Inputfield icon='lock' placeholder='password' name='password' value={password} onChange={setPassword} type='password' />
                        <button type='submit' className='w-4/5 h-11 bg-[#0b6ab8] cursor-pointer text-white'>LOGIN</button>
                        <div className='pl-28 text-gray-500'>New Member? <Link to='/register' className='text-blue-600'>Register Now</Link></div>
                    </form>

                </div>
            </div>
        </div >
    )
}
