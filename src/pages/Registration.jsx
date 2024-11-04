import React, { useEffect } from 'react'
import logo from '../assets/online-job-interview_23-2148613123.avif'
import { Link } from 'react-router-dom'
import Inputfield from '../components/Inputfield'
import { useState } from 'react'
import { server } from '../main'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../context/UserContext'

export default function Registration() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const navigate = useNavigate();
    const { isAuthenticated, setIsAuthenticated } = useContext(UserContext);

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${server}/auth/signup`, {
                name, email, phone, password, address
            },
                { headers: { 'Content-Type': 'application/json' } }
            );
            toast.success("Registration Successful");
            setName('');
            setEmail('');
            setPhone('');
            setPassword('');
            setAddress('');
            navigate('/login');
        }
        catch (error) {
            console.log(error.response);
            if (error.response.data.email) {
                toast.error(error.response.data.email);
            }
            if (error.response.data.phone) {
                toast.error(error.response.data.phone);
            }
            if (error.response.data.password) {
                toast.error(error.response.data.password);
            }
            if (error.response.data.address) {
                toast.error(error.response.data.address);
            }
            if (error.response.data.name) {
                toast.error(error.response.data.name);
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
                    <h2 className='leading-[1.66] font-bold text-[#222] text-[35px]'>Register to CourseSync</h2>
                    <form className='w-full flex-col space-y-5' onSubmit={submitHandler}>
                        <Inputfield icon='person' placeholder='Name' name='name' value={name} onChange={setName} type='text' />
                        <Inputfield icon='email' placeholder='Email' name='email' value={email} onChange={setEmail} type='text' />
                        <Inputfield icon='phone' placeholder='Phone' name='phone' value={phone} onChange={setPhone} type='text' />
                        <Inputfield icon='lock' placeholder='Password' name='password' value={password} onChange={setPassword} type='password' />
                        <Inputfield icon='home' placeholder='Address' name='address' value={address} onChange={setAddress} type='text' />
                        <button type='submit' className='w-4/5 h-11 bg-[#0b6ab8] cursor-pointer text-white'>REGISTER</button>
                        <div className='pl-28 text-gray-500'>Already a member? <Link to='/login' className='text-blue-600'>Login Now</Link></div>
                    </form>

                </div>
            </div>
        </div >
    )
}

