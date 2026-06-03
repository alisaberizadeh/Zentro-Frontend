import React from 'react'

function Btn({text}) {
    return (
        <button className='bg-green-600 mt-5 text-green-100 w-32 py-2 tracking-wide cursor-pointer hover:bg-green-700 rounded-md transition-all duration-300  px-5'>{text}</button>
    )
}

export default Btn