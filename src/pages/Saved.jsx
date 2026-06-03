import React, { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import TitlePage from '../components/TitlePage'
import { FiImage } from 'react-icons/fi'
import { Link } from 'react-router-dom'

function Saved() {
    const { user, token } = useContext(AuthContext)

    const { data: savedData, isLoading: isLoadingSavedData } = useQuery({
        queryKey: ['saved', user?.id],
        queryFn: async () => {
            const res = await axios.get(
                `http://127.0.0.1:8000/api/saves/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    }
                }
            )

            return res.data
        },
        enabled: !!user?.id,
        staleTime: 30000
    })
    return (
        <div className='w-full p-5 lg:p-10'>
            <TitlePage title="Saved" />
            <div className='w-full grid grid-cols-3 lg:grid-cols-4 gap-1 my-5   border-t border-gray-100'>
                {savedData?.length < 1 && (
                    <div className="col-span-4 flex flex-col items-center justify-center py-16 text-gray-500">
                        <FiImage className="text-5xl mb-4 text-gray-400" />
                        <p className="text-lg font-medium">No posts to show</p>
                        <p className="text-sm text-gray-400 mt-1">
                            When posts are available, they will appear here.
                        </p>
                    </div>
                )}
                {isLoadingSavedData && (
                    <>
                        <div className="animate-pulse  col-span-1 aspect-square  bg-white">
                            <div className="h-full bg-gray-300"></div>
                        </div>
                        <div className="animate-pulse  col-span-1 aspect-square  bg-white">
                            <div className="h-full bg-gray-300"></div>
                        </div> <div className="animate-pulse  col-span-1 aspect-square  bg-white">
                            <div className="h-full bg-gray-300"></div>
                        </div> <div className="animate-pulse  col-span-1 aspect-square  bg-white">
                            <div className="h-full bg-gray-300"></div>
                        </div><div className="animate-pulse  col-span-1 aspect-square  bg-white">
                            <div className="h-full bg-gray-300"></div>
                        </div>
                        <div className="animate-pulse  col-span-1 aspect-square  bg-white">
                            <div className="h-full bg-gray-300"></div>
                        </div>
                        <div className="animate-pulse  col-span-1 aspect-square  bg-white">
                            <div className="h-full bg-gray-300"></div>
                        </div>
                        <div className="animate-pulse  col-span-1 aspect-square  bg-white">
                            <div className="h-full bg-gray-300"></div>
                        </div>
                    </>
                )}
                {savedData?.map((item, index) => (
                    <Link to={`/feed/${item.id}`} key={index} className='col-span-1 bg-gray-300 cursor-pointer relative'>
                        <div className="relative group aspect-square overflow-hidden">
                            <img loading='lazy'  
                                src={import.meta.env.VITE_POST_IMAGE_BASE_URL + item.media}
                                alt="post"
                                className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-70"
                            />


                        </div>
                    </Link >
                ))}

            </div>
        </div>
    )
}

export default Saved