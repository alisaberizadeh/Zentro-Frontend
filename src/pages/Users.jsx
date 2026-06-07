import React, { useContext, useMemo, useState } from 'react'
import TitlePage from '../components/TitlePage'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { AuthContext } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi'

function Users() {
    const { user, token } = useContext(AuthContext)
    const [page, setPage] = useState(1);

    const { data: users, isLoading: isLoadingUsers } = useQuery({
        queryKey: ['users', page],
        queryFn: async () => {
            const res = await axios.get(
                `https://api.zentroapp.ir/api/users?page=${page}`,
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
        keepPreviousData: true,
        staleTime: 30000
    })

    return (
        <div className='w-full p-6 lg:p-10'>
            <TitlePage title="Community" />

            <div className='w-full mt-10 grid grid-cols-3 lg:grid-cols-6 gap-5 lg:gap-10'>
                {isLoadingUsers && (
                    <>
                        <div className="animate-pulse  col-span-1 aspect-square  bg-white">
                            <div className="h-full bg-gray-300"></div>
                        </div><div className="animate-pulse  col-span-1 aspect-square  bg-white">
                            <div className="h-full bg-gray-300"></div>
                        </div><div className="animate-pulse  col-span-1 aspect-square  bg-white">
                            <div className="h-full bg-gray-300"></div>
                        </div><div className="animate-pulse  col-span-1 aspect-square  bg-white">
                            <div className="h-full bg-gray-300"></div>
                        </div><div className="animate-pulse  col-span-1 aspect-square  bg-white">
                            <div className="h-full bg-gray-300"></div>
                        </div><div className="animate-pulse  col-span-1 aspect-square  bg-white">
                            <div className="h-full bg-gray-300"></div>
                        </div>
                        
                    </>
                )}
                {users?.data?.map((item) => (
                    <Link target='_blank' to={item.id !== user.id ? `/user/${item.id}` : "/profile"} key={item.id} className='col-span-1 rounded-xl text-center border p-5 border-gray-200'>
                        <img loading='lazy'   src={import.meta.env.VITE_AVATAR_IMAGE_BASE_URL + item.profile_photo} alt={item.username}
                            className='w-16 aspect-square object-cover m-auto rounded-full' />
                        <p className='w-[95%] overflow-hidden mt-2'>{item.username}</p>
                    </Link>
                ))}
            </div>
            <div className='flex justify-center items-center gap-4 mt-10'>
                <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className='px-4 py-4 bg-green-200 text-green-600 rounded disabled:opacity-50 cursor-pointer'
                ><BiLeftArrow /></button>

                <span> {page} of {users?.last_page}</span>

                <button
                    disabled={page >= (users?.last_page || 1)}
                    onClick={() => setPage(p => p + 1)}
                    className='px-4 py-4 bg-green-200 text-green-600 rounded disabled:opacity-50 cursor-pointer'
                ><BiRightArrow /></button>
            </div>

        </div>
    )
}

export default Users