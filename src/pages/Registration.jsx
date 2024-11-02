import React from 'react'
import logo from '../assets/online-job-interview_23-2148613123.avif'
import { Link } from 'react-router-dom'
import Inputfield from '../components/Inputfield'
import { useState } from 'react'


export default function Registration() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [pswd, setPswd] = useState('');
    const [address, setAddress] = useState('');

    const submitHandler = (e) => {
        e.preventDefault();
        console.log(name, email, phone, pswd, address);
    }


    return (
        <div className='h-full w-full flex justify-center items-center bg-[#f8f8f8]'>
            <div className='w-[1150px] bg-white shadow-lg rounded-lg p-6 mx-auto flex items-center'>
                <div className='text-center w-1/2 overflow-hidden'>
                    <img src={logo} alt='No Image' />
                </div>
                <div className='w-1/2 overflow-hidden flex-col space-y-[20px]'>
                    <h2 className='leading-[1.66] font-bold text-[#222] text-[35px]'>Register to CourseSync</h2>
                    <form className='w-full flex-col space-y-5' onSubmit={submitHandler}>
                        <Inputfield icon='person' placeholder='Name' name='name' value={name} onChange={setName} />
                        <Inputfield icon='email' placeholder='Email' name='email' value={email} onChange={setEmail} />
                        <Inputfield icon='phone' placeholder='Phone' name='phone' value={phone} onChange={setPhone} />
                        <Inputfield icon='lock' placeholder='Password' name='pswd' value={pswd} onChange={setPswd} />
                        <Inputfield icon='home' placeholder='Address' name='address' value={address} onChange={setAddress} />
                        <button type='submit' className='w-4/5 h-11 bg-[#0b6ab8] cursor-pointer text-white'>REGISTER</button>
                        <div className='pl-28 text-gray-500'>Already a member? <Link to='/login' className='text-blue-600'>Login Now</Link></div>
                    </form>

                </div>
            </div>
        </div >
    )
}

