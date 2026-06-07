import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import React, { useContext, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import { FaBookmark, FaHeart, FaRegBookmark, FaRegComment, FaRegHeart, FaRegPaperPlane } from 'react-icons/fa6'
import { BiBookmark } from 'react-icons/bi'
import { useForm } from 'react-hook-form'
import { FaExclamationCircle } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { CgClose } from 'react-icons/cg'

function Post() {
    const { id } = useParams()
    const { token, user } = useContext(AuthContext)
    const { register, control, handleSubmit, setError, watch, reset, formState: { errors }, } = useForm();
    const queryClient = useQueryClient()
    const [open, setOpen] = useState(false);

    const { data, isLoading, error } = useQuery({
        queryKey: ['post', id],
        queryFn: async () => {
            const res = await axios.get(
                `https://api.zentroapp.ir/api/posts/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    }
                }
            )

            return res.data
        },
        enabled: !!id,
        staleTime: 60000
    })
    const { data: dataUser, isLoading: isLoadingUser } = useQuery({
        queryKey: ["userInfo", data?.data?.post?.user_id, token],
        queryFn: async () => {
            const res = await axios.get(
                `https://api.zentroapp.ir/api/user/${data?.data?.post?.user_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                }
            );

            return res.data;
        },
        enabled: !!data?.data?.post?.user_id,
        staleTime: 60000,
    });
    const { mutate: sendComment } = useMutation({
        mutationFn: (formData) =>
            axios.post(`https://api.zentroapp.ir/api/comments/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ['post', id],
            });
            toast.success(`Your comment has been sent, thank you . `, {
                position: "bottom-left",
                autoClose: 5000,
                style: {
                    width: "auto",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    paddingRight: "50px",
                },

            });
            reset()
        },
    });
    const onSubmit = async (data) => {
        sendComment(data)
    }
    const { mutate: toggleLike } = useMutation({
        mutationFn: () =>
            axios.post(`https://api.zentroapp.ir/api/posts/like/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ['post', id],
            });
            toast.success(data.data.message, {
                position: "bottom-left",
                autoClose: 5000,
                style: {
                    width: "auto",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    paddingRight: "50px",
                },

            });
        },
    });
    const handleLike = () => {
        toggleLike()
    }
    const { mutate: toggleSave } = useMutation({
        mutationFn: () =>
            axios.post(`https://api.zentroapp.ir/api/saves/post/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ['post', id],
            });
            queryClient.invalidateQueries({
                queryKey: ['saved', user?.id],
            });
            toast.success(data.data.message, {
                position: "bottom-left",
                autoClose: 5000,
                style: {
                    width: "auto",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    paddingRight: "50px",
                },

            });
        },
    });
    const handleSave = () => {
        toggleSave()
    }
    const { mutate: toggleFollow } = useMutation({
        mutationFn: () =>
            axios.post(`https://api.zentroapp.ir/api/follow/${dataUser?.data.user.id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["userInfo", dataUser?.data.user.id, token],
            });
            queryClient.invalidateQueries({
                queryKey: ["followings", user?.id],
            });
            queryClient.invalidateQueries({
                queryKey: ["followers", dataUser?.data.user.id],
            });
            toast.success(data.data.message, {
                position: "bottom-left",
                autoClose: 5000,
                style: {
                    width: "auto",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    paddingRight: "50px",
                },

            });
        },
    });
    const handleFollow = () => {
        toggleFollow()
    }
    const { mutate: toggleFollowUser } = useMutation({
        mutationFn: (userId) =>
            axios.post(`https://api.zentroapp.ir/api/follow/${userId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }),
        onSuccess: (data, variables) => {

            queryClient.invalidateQueries({
                queryKey: ['post', id],
            });
            queryClient.invalidateQueries({
                queryKey: ["userInfo", variables, token],
            });
            queryClient.invalidateQueries({
                queryKey: ["followings", user.id],
            });
            queryClient.invalidateQueries({
                queryKey: ["followers", variables],
            });
            toast.success(data.data.message, {
                position: "bottom-left",
                autoClose: 5000,
                style: {
                    width: "auto",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    paddingRight: "50px",
                },

            });
        },
    });
    const handleFollowUser = (userId) => {
        toggleFollowUser(userId)
    }

    return (
        <div className='grid grid-cols-2 gap-10  lg:p-10 p-5'>
            {!isLoading && data?.status == false ? (
                <div className='text-center col-span-2 text-4xl text-green-600'>
                    <p className='my-5 font-bold'>404</p>
                    <p className='my-5 font-bold'>Post not found</p>
                </div>
            ) : (

                <>
                    <div className='col-span-2 lg:col-span-1'>
                        {isLoadingUser || isLoading ? (
                            <div className="animate-pulse  w-full   bg-white">
                                <div className='flex items-center  *:'>
                                    <div className="w-full aspect-square rounded-md h-52 lg:h-auto bg-gray-300"></div>
                                </div>
                            </div>
                        ) : (
                            <img loading='lazy' src={import.meta.env.VITE_POST_IMAGE_BASE_URL + data?.data?.post?.media} className='w-full' alt="" />

                        )}
                    </div>
                    <div className='col-span-2 lg:col-span-1'>

                        {isLoadingUser || isLoading ? (
                            <div className="animate-pulse  w-full h-32 bg-white">
                                <div className='flex items-center'>
                                    <div className="w-16 h-16 rounded-full  bg-gray-300"></div>
                                    <div className="w-2/4 h-4 rounded-full ml-2 bg-gray-300"></div>
                                </div>
                                <div className="w-full my-5 h-8 rounded-md ml-2 bg-gray-300"></div>
                                <div className="w-full mt-10 h-4 rounded-md ml-2 bg-gray-300"></div>
                                <div className="w-full my-5 h-4 rounded-md ml-2 bg-gray-300"></div>
                                <div className="w-full my-5 h-4 rounded-md ml-2 bg-gray-300"></div>
                                <div className="w-full my-5 h-4 rounded-md ml-2 bg-gray-300"></div>
                                <div className="w-full my-5 h-4 rounded-md ml-2 bg-gray-300"></div>
                                <div className="w-full my-5 h-4 rounded-md ml-2 bg-gray-300"></div>
                                <div className="w-full my-5 h-4 rounded-md ml-2 bg-gray-300"></div>
                                <div className="w-3/4 my-5 mb-10 h-4 rounded-md ml-2 bg-gray-300"></div>
                                <div className="w-full my-5 h-12 rounded-md ml-2 bg-gray-300"></div>
                                <div className="w-full my-5 h-12 rounded-md ml-2 bg-gray-300"></div>
                                <div className="w-full my-5 h-12 rounded-md ml-2 bg-gray-300"></div>
                                <div className="w-full my-5 h-12 rounded-md ml-2 bg-gray-300"></div>



                            </div>
                        ) : (
                            <>
                                {/* show likes */}
                                <div
                                    onClick={() => setOpen(false)}
                                    className={`fixed inset-0 bg-black/50 flex items-center justify-center transition-all duration-300 z-50 ${open
                                        ? "opacity-100 visible"
                                        : "opacity-0 invisible"
                                        }`}>
                                    <div
                                        onClick={(e) => e.stopPropagation()}
                                        className={`bg-white lg:w-1/3 w-full h-full lg:max-h-2/3 overflow-y-auto lg:rounded-2xl p-5 transition-all duration-300 ${open
                                            ? "scale-100 translate-y-0"
                                            : "scale-90 translate-y-10"
                                            }`}
                                    >
                                        <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
                                            Likes ({data?.data?.post?.likes_count})
                                            <span onClick={() => setOpen(false)} className='cursor-pointer'><CgClose /></span>

                                        </h2>

                                        <div className="space-y-3">
                                            {data?.data?.post?.likes.length > 0 ? data?.data?.post?.likes.map((item, index) => (
                                                <div key={index} className='flex items-center justify-between m-0 p-3 border-t border-gray-200'>
                                                    <Link target="_blank" to={item.user.id != user.id ? `/user/${item.user.id}` : "/profile"} className='flex items-center'>
                                                        <img loading='lazy' src={import.meta.env.VITE_AVATAR_IMAGE_BASE_URL + item.user.profile_photo} className='w-12 h-12 object-cover mr-3 rounded-full' alt={item.user.username} />
                                                        {item.user.username}
                                                    </Link>
                                                    {item.user.id != user.id && (
                                                        item.user.is_following ? (
                                                            < button onClick={() => handleFollowUser(item.user.id)} className='bg-green-200 text-green-600 py-2 rounded-lg cursor-pointer hover:bg-green-200 px-8'>UnFollow</button>
                                                        ) :
                                                            (
                                                                < button onClick={() => handleFollowUser(item.user.id)} className='bg-green-600 text-white py-2 rounded-lg cursor-pointer hover:bg-green-700 px-8'>Follow</button>
                                                            )
                                                    )}
                                                </div>
                                            )) : (
                                                <h1>The number of likes is 0 , currently.</h1>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className='flex justify-between items-center border-b border-gray-200 pb-5 mb-5'>
                                    <Link to={dataUser?.data.user.id == user.id ? `/profile` : `/user/${dataUser?.data.user.id}`} className='flex items-center'>
                                        <img loading='lazy' src={import.meta.env.VITE_AVATAR_IMAGE_BASE_URL + dataUser?.data.user.profile_photo} className='lg:w-16 w-12 aspect-square 
                                        object-cover rounded-full' alt={dataUser?.data.user.username} />
                                        <p className=' text-xl lg:text-2xl text-gray-800 font-semibold ml-4  '>{dataUser?.data.user.username}</p>
                                    </Link>
                                    {dataUser?.data.user.id != user.id ? (
                                        dataUser?.data.is_following ? (
                                            <button onClick={handleFollow} className='bg-green-100 text-green-600 py-2 rounded-lg cursor-pointer hover:bg-green-200 px-8 text-sm lg:text-lg'>UnFollow</button>

                                        ) : (
                                            < button onClick={handleFollow} className='bg-green-600 text-white py-2 rounded-lg cursor-pointer hover:bg-green-700 px-8 text-sm lg:text-lg'>Follow</button>

                                        )
                                    ) : (
                                        <Link to="/profile" className='bg-green-100 text-green-600 py-2 rounded-lg cursor-pointer hover:bg-green-200 px-8 text-sm lg:text-lg'>My Profile</Link>
                                    )}
                                </div>
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center'>
                                        <button onClick={handleLike} className='cursor-pointer flex items-center text-xl'>
                                            {data?.data?.is_liked ? <FaHeart className='mr-1 text-red-500' /> : <FaRegHeart className='mr-1' />}
                                        </button>
                                        <button
                                            onClick={() => setOpen(true)}

                                            className={`text-xl mr-8 cursor-pointer ${data?.data?.is_liked && "text-red-500"}`}>{data?.data?.post?.likes_count}</button>

                                        <button className='cursor-pointer flex items-center text-xl mr-8'><FaRegComment className='mr-1' />{data?.data?.post?.comments_count}</button>
                                        <button className='cursor-pointer flex items-center text-xl mr-8'><FaRegPaperPlane className='mr-1' /></button>
                                    </div>
                                    <div className='flex items-center'>
                                        <button onClick={handleSave} className='cursor-pointer flex items-center text-2xl ml-5'>
                                            {data?.data?.is_save ? <FaBookmark className='mr-1 text-green-500' /> : <FaRegBookmark className='mr-1' />}

                                        </button>
                                    </div>
                                </div>
                                <p className=' tracking-wide text-justify text-sm lg:text-base  my-4 text-gray-800'>
                                    {data?.data?.post?.caption}
                                </p>
                                <p className='text-justify  tracking-wide my-3  text-sm lg:text-base  text-gray-400'>
                                    {data?.data?.post?.datetime}
                                </p>
                                <div className='w-full my-5 pb-5 border-b border-gray-200 '>
                                    <form onSubmit={handleSubmit(onSubmit)} className={`w-full bg-white overflow-hidden h-12 flex items-center ${errors.text ? "border-red-500" : "border-gray-200"} justify-between  rounded-md border`}>
                                        <input type="text"  {...register('text', { required: 'Please enter a comment.' },)} className='w-10/12 outline-none h-full px-5 text-sm' placeholder='What is your opinion ? ' />

                                        <button className='w-2/12 bg-green-100 text-green-600 h-full text-sm cursor-pointer hover:bg-green-200'>Send</button>
                                    </form>
                                    {errors.text && <p className='text-sm mt-2 flex items-center text-red-500'> <FaExclamationCircle className='mr-2' />{errors.text?.message}</p>}

                                </div>
                                <p className='text-xl font-bold mb-5'>Comments ({data?.data?.post?.comments_count})</p>
                                {data?.data?.post?.comments.map((item, index) => (
                                    <Link to={item.user.id != user.id ? `/user/${item.user.id}` : "/profile"} key={index} className='block border-b py-3 border-gray-200'>
                                        <div className='flex items-center '>
                                            <img loading='lazy' src={import.meta.env.VITE_AVATAR_IMAGE_BASE_URL + item.user.profile_photo} className='w-10 h-10 object-cover rounded-full' alt={item.user.username} />
                                            <p className='text-md text-gray-00 font-semibold ml-2'>{item.user.username}
                                                <span className='text-xs text-gray-400 ml-5'>{new Date(item.created_at).toLocaleString("en-US", {
                                                    year: "numeric",
                                                    day: "numeric",
                                                    month: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: true,
                                                })}</span>

                                            </p>

                                        </div>
                                        <p className='text-sm text-gray-500 mt-1'>{item.text}</p>


                                    </Link>
                                ))}
                                <br />  <br />  <br />  <br />



                            </>
                        )}


                    </div>
                </>
            )
            }
        </div >
    )
}

export default Post