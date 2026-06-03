import { Outlet } from 'react-router-dom';
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { FiHome, FiPlusSquare, FiSend } from 'react-icons/fi'
import { BiSearch } from 'react-icons/bi'
import { AiOutlineHeart } from 'react-icons/ai'
import { FaSignOutAlt, FaUserAltSlash, FaUsers } from 'react-icons/fa'
import { MdOutlineExplore } from 'react-icons/md'
import { AuthContext } from '../contexts/AuthContext'
import Swal from 'sweetalert2'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { PiUsersDuotone } from 'react-icons/pi';
import { LuSend } from 'react-icons/lu';
function MainLayout() {
    const { user, logout, token } = useContext(AuthContext)
    const handleLogout = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6e09e3",
            confirmButtonText: "Yes, logout",
        }).then((result) => {
            if (result.isConfirmed) {
                logout()

            }
        });

    }
    const { data: notificationsCount, isLoading: isLoadingnotificationsCount } = useQuery({
        queryKey: ['notificationsCount'],
        queryFn: async () => {
            const res = await axios.get(
                `http://127.0.0.1:8000/api/notifications/unread_count/`,
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
        staleTime: 30000
    })

    const { data: conversations_list, isLoading: isLoadingconversations_list } = useQuery({
        queryKey: ['conversations_list'],
        queryFn: async () => {
            const res = await axios.get(`http://127.0.0.1:8000/api/conversations`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return res.data
        },
        refetchInterval: 5000,
        refetchIntervalInBackground: true,
        staleTime: 0,
    })

    return (
        <div className="container m-auto">
            <div className="w-full grid grid-cols-8 h-screen lg:py-5 gap-5">

                <div className='w-full h-[9%] bg-green-600 z-40 fixed bottom-0 left-0 flex items-center justify-around border-t border-t-gray-200 lg:hidden'>
                    <Link to="/" className='text-2xl text-white'><FiHome className='mr-4' /></Link>
                    <Link to="/notifications" className='text-2xl text-white'><AiOutlineHeart className='mr-4' /></Link>
                    <Link to="/explore" className='text-2xl text-white'><MdOutlineExplore className='mr-4' /></Link>
                    <Link to="/search" className='text-2xl text-white'><BiSearch className='mr-4' /></Link>
                    <Link to="/conversation" className='text-2xl text-white'><LuSend className='mr-4' /></Link>
                    <Link to="/profile" className='text-2xl text-white'><img loading='lazy' src={import.meta.env.VITE_AVATAR_IMAGE_BASE_URL + user?.profile_photo} alt={user?.username}
                        className='w-8 h-8  object-cover rounded-full mr-4' /></Link>

                </div>

                <div className="lg:col-span-2 hidden lg:block bg-white h-full rounded-2xl overflow-hidden">

                    <img loading='lazy' src="/src/assets/images/logo2.png" alt="" />
                    <div className='p-5'>
                        <Link to="/profile" className='rounded-xl h-16 px-5 text-xl flex items-center font-medium text-gray-800 hover:bg-green-50 hover:text-green-700 duration-300 transition-allx'>
                            <img loading='lazy' src={import.meta.env.VITE_AVATAR_IMAGE_BASE_URL + user?.profile_photo} alt={user?.username} className='w-10 h-10  object-cover rounded-full mr-4' />{user?.name}
                        </Link>
                        <Link to="" className='rounded-xl cursor-pointer h-16 px-5 text-xl flex items-center font-medium text-gray-800 hover:bg-green-50 hover:text-green-700 duration-300 transition-allx'>
                            <FiHome className='mr-4' />    Home
                        </Link>
                        <Link to="/search" className='rounded-xl cursor-pointer h-16 px-5 text-xl flex items-center font-medium text-gray-800 hover:bg-green-50 hover:text-green-700 duration-300 transition-allx'>
                            <BiSearch className='mr-4' />    Search
                        </Link>
                        <Link to="/explore" className='rounded-xl cursor-pointer h-16 px-5 text-xl flex items-center font-medium text-gray-800 hover:bg-green-50 hover:text-green-700 duration-300 transition-allx'>
                            <MdOutlineExplore className='mr-4' />    Explore
                        </Link>
                        <Link to="/conversation" className='rounded-xl cursor-pointer h-16 px-5 text-xl flex items-center font-medium text-gray-800 hover:bg-green-50 hover:text-green-700 duration-300 transition-allx'>
                            <FiSend className='mr-4' />    Messages {conversations_list?.total_unread_count > 0 && (
                                <span className='bg-red-500 text-white px-2 text-sm ml-2 rounded-full'>{conversations_list?.total_unread_count}</span>
                            )}
                        </Link>
                        <Link to="/notificatios" className='rounded-xl cursor-pointer h-16 px-5 text-xl flex items-center font-medium text-gray-800 hover:bg-green-50 hover:text-green-700 duration-300 transition-allx'>
                            <AiOutlineHeart className='mr-4' />    Notifications {notificationsCount?.count > 0 && (
                                <span className='bg-green-500 text-white px-2 text-sm ml-2 rounded-full'>{notificationsCount?.count}</span>
                            )}
                        </Link>
                        <Link to="/community" className='rounded-xl cursor-pointer h-16 px-5 text-xl flex items-center font-medium text-gray-800 hover:bg-green-50 hover:text-green-700 duration-300 transition-allx'>
                            <PiUsersDuotone className='mr-4' />    Community
                        </Link>
                        <Link to="/feed/create" className='rounded-xl cursor-pointer h-16 px-5 text-xl flex items-center font-medium text-gray-800 hover:bg-green-50 hover:text-green-700 duration-300 transition-allx'>
                            <FiPlusSquare className='mr-4' />    Create Post
                        </Link>


                        <span onClick={handleLogout} className='rounded-xl cursor-pointer h-16 px-5 text-xl flex items-center font-medium text-red-700 hover:bg-red-50 hover:text-red-700 duration-300 transition-allx'>
                            <FaSignOutAlt className='mr-4' />    Log Out
                        </span>

                    </div>
                </div>
                <div className="lg:col-span-6 col-span-8 bg-white lg:rounded-2xl relative overflow-y-scroll ">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default MainLayout;
