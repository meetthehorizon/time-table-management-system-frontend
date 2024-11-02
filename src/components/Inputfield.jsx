import React from 'react'

export default function Inputfield({ name, icon, placeholder, value, onChange }) {
    return (
        <div className='relative'>
            <label htmlFor={name}><span className='form-label material-symbols-outlined'>
                {icon}
            </span></label>
            <input className='form-input' type='text' id={name} placeholder={placeholder} name={name} value={value} onChange={(e) => { onChange(e.target.value) }} required />
        </div>
    )
}
