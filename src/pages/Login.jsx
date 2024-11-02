import React from 'react'
import Inputfield from '../components/Inputfield'
import logo from '../assets/online-job-interview_23-2148613123.avif'
import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function Login() {
    const [email, setEmail] = useState('');
    const [pswd, setPswd] = useState('');

    const submitHandler = (e) => {
        e.preventDefault();
        console.log(email, pswd);
    }

    return (
        <div className='h-full w-full flex justify-center items-center bg-[#f8f8f8]'>
            <div className='w-[1150px] bg-white shadow-lg rounded-lg p-6 mx-auto flex items-center'>
                <div className='text-center w-1/2 overflow-hidden'>
                    <img src={logo} alt='No Image' />
                </div>
                <div className='w-1/2 overflow-hidden flex-col space-y-[20px]'>
                    <h2 className='leading-[1.66] font-bold text-[#222] text-[35px]'>Login to CourseSync</h2>
                    <form className='w-full flex-col space-y-5' onSubmit={submitHandler}>
                        <Inputfield icon='email' placeholder='Email' name='email' value={email} onChange={setEmail} />
                        <Inputfield icon='lock' placeholder='Password' name='pswd' value={pswd} onChange={setPswd} />
                        <button type='submit' className='w-4/5 h-11 bg-[#0b6ab8] cursor-pointer text-white'>REGISTER</button>
                        <div className='pl-28 text-gray-500'>New Member? <Link to='/register' className='text-blue-600'>Register Now</Link></div>
                    </form>

                </div>
            </div>
        </div >
    )
}
