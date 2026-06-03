import React from 'react'

function Loader() {
    return (
        <div className="w-full h-1 bg-gray-200 overflow-hidden rounded-full relative">
            <div className="absolute top-0 left-0 h-full w-1/3 bg-green-500 rounded-full animate-[slide_1s_linear_infinite]"></div>
        </div>
    )
}

export default Loader