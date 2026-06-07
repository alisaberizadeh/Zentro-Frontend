import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import CommentForm from '../components/CommentForm'
import { FaBookmark, FaHeart, FaRegBookmark, FaRegComment, FaRegHeart, FaRegPaperPlane } from 'react-icons/fa6'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-toastify'
import { CgClose } from 'react-icons/cg'

function HomePost({ item }) {
    const queryClient = useQueryClient()
    const { user, token } = useContext(AuthContext)
    const [open, setOpen] = useState(null)
    const [commentsOpen, setcommentsOpen] = useState(null)
    const [readAll, setreadAll] = useState(false)
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm()



    const { mutate: toggleLike } = useMutation({
        mutationFn: (id) =>
            axios.post(`https://api.zentroapp.ir/api/posts/like/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }),
        onSuccess: (data, id) => {
            queryClient.invalidateQueries({
                queryKey: ['post', id],
            })
            queryClient.invalidateQueries({
                queryKey: ['home', user?.id],
            })
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
            })
        },
    })

    const handleLike = (id) => {
        toggleLike(id)
    }

    const { mutate: toggleSave } = useMutation({
        mutationFn: (id) =>
            axios.post(`https://api.zentroapp.ir/api/saves/post/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }),
        onSuccess: (data, id) => {
            queryClient.invalidateQueries({
                queryKey: ['post', id],
            })
            queryClient.invalidateQueries({
                queryKey: ['home', user?.id],
            })
            queryClient.invalidateQueries({
                queryKey: ['saved', user?.id],
            })
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
            })
        },
    })

    const handleSave = (id) => {
        toggleSave(id)
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
                queryKey: ['home', user?.id],
            })
            queryClient.invalidateQueries({
                queryKey: ["userInfo", variables, token],
            })
            queryClient.invalidateQueries({
                queryKey: ["followings", user?.id],
            })
            queryClient.invalidateQueries({
                queryKey: ["followers", variables],
            })
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
            })
        },
    })

    const handleFollowUser = (userId) => {
        toggleFollowUser(userId)
    }

    const { mutate: sendComment, isPending: isSendingComment } = useMutation({
        mutationFn: ({ postId, formData }) =>
            axios.post(`https://api.zentroapp.ir/api/comments/${postId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['home', user?.id],
            })
            toast.success(`Your comment has been sent, thank you.`, {
                position: "bottom-left",
                autoClose: 5000,
                style: {
                    width: "auto",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    paddingRight: "50px",
                },
            })
            reset()
        },
    })

    const onSubmit = (data, postId) => {
        sendComment({
            postId,
            formData: data
        })
    }


    return (
        <div key={item.id} className='w-full border border-gray-200 mb-10 rounded-2xl'>

            {/* show likes */}
            <div
                onClick={() => setOpen(null)}
                className={`fixed inset-0 bg-black/50 flex items-center justify-center transition-all duration-300 z-50  ${open === item.id ? "opacity-100 visible" : "opacity-0 invisible"}`}
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    className={`bg-white lg:w-1/3 w-full h-full lg:max-h-2/3 overflow-y-auto lg:rounded-2xl p-5 transition-all duration-300  ${open === item.id ? "scale-100 translate-y-0" : "scale-90 translate-y-10"}`}
                >
                    <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
                        Likes ({item?.likes_count})
                        <span onClick={() => setOpen(false)} className='cursor-pointer'><CgClose /></span>

                    </h2>

                    <div className="space-y-3">
                        {item?.likes?.length > 0 ? item.likes.map((like) => (
                            <div key={like.id} className='flex items-center justify-between m-0 p-3 border-t border-gray-200'>
                                <Link
                                    target="_blank"
                                    to={like.user.id !== user.id ? `/user/${like.user.id}` : "/profile"}
                                    className='flex items-center overflow-hidden'
                                >
                                    <img loading='lazy' src={import.meta.env.VITE_AVATAR_IMAGE_BASE_URL + like.user.profile_photo} className='w-12 border border-gray-200   object-cover h-12 mr-3 rounded-full' alt={like.user.username} />
                                    {like.user.username}
                                </Link>

                                {like.user.id !== user.id && (
                                    like.user.is_following ? (
                                        <button
                                            onClick={() => handleFollowUser(like.user.id)}
                                            className='bg-green-200 text-green-600 py-2 rounded-lg text-sm lg:text-base cursor-pointer hover:bg-green-200 px-8'
                                        >
                                            UnFollow
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleFollowUser(like.user.id)}
                                            className='bg-green-600 text-white py-2 rounded-lg text-sm lg:text-base cursor-pointer hover:bg-green-700 px-8'
                                        >
                                            Follow
                                        </button>
                                    )
                                )}
                            </div>
                        )) : (
                            <h1>The number of likes is 0, currently.</h1>
                        )}
                    </div>
                </div>
            </div>

            {/* show comment */}
            <div
                onClick={() => setcommentsOpen(null)}
                className={`fixed inset-0 bg-black/50 flex items-center justify-center transition-all duration-300 z-50 ${commentsOpen === item.id ? "opacity-100 visible" : "opacity-0 invisible"}`}
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    className={`bg-white lg:w-1/3 w-full h-full lg:max-h-2/3 overflow-y-auto lg:rounded-2xl p-5 transition-all duration-300 ${commentsOpen === item.id ? "scale-100 translate-y-0" : "scale-90 translate-y-10"}`}
                >
                    <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
                        Comments ({item?.comments_count})
                        <span onClick={() => setcommentsOpen(false)} className='cursor-pointer'><CgClose /></span>

                    </h2>

                    <div className="space-y-3">
                        {item?.comments?.length > 0 ? item.comments.map((comment) => (
                            <Link
                                to={comment.user.id !== user.id ? `/user/${comment.user.id}` : "/profile"}
                                key={comment.id}
                                className='block border-b py-3 border-gray-200'
                            >
                                <div className='flex items-center'>
                                    <img loading='lazy' src={import.meta.env.VITE_AVATAR_IMAGE_BASE_URL + comment.user.profile_photo} className='w-10 h-10  object-cover border border-gray-200 rounded-full' alt={comment.user.username} />
                                    <p className='text-md text-gray-800 font-semibold ml-2'>
                                        {comment.user.username}
                                        <span className='text-xs text-gray-400 ml-5'>
                                            {new Date(comment.created_at).toLocaleString("en-US", {
                                                year: "numeric",
                                                day: "numeric",
                                                month: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                            })}
                                        </span>
                                    </p>
                                </div>
                                <p className='text-sm text-gray-500 mt-1'>{comment.text}</p>
                            </Link>
                        )) : (
                            <h1>The number of comments is 0, currently.</h1>
                        )}
                    </div>

                </div>
            </div>

            <div className='flex items-center justify-between py-3 px-5'>
                <Link target="_blank" to={item.user.id !== user.id ? `/user/${item.user.id}` : "/profile"} className='flex items-center'>
                    <img loading='lazy' src={import.meta.env.VITE_AVATAR_IMAGE_BASE_URL + item.user.profile_photo} className='w-12 aspect-square  object-cover  border border-gray-200 rounded-full' alt={item.user.username} />
                    <p className=' text-lg lg:text-2xl text-gray-800 font-semibold ml-4'>{item.user.username}</p>
                </Link>
                {item.user.id !== user.id && (
                    item.user.is_following ? (
                        <button
                            onClick={() => handleFollowUser(item.user.id)}
                            className='bg-green-200 text-green-600 py-2 rounded-lg cursor-pointer text-sm lg:text-base hover:bg-green-200 px-8'
                        >
                            UnFollow
                        </button>
                    ) : (
                        <button
                            onClick={() => handleFollowUser(item.user.id)}
                            className='bg-green-600 text-white py-2 rounded-lg cursor-pointer text-sm lg:text-base hover:bg-green-700 px-8'
                        >
                            Follow
                        </button>
                    )
                )}
            </div>

            <img loading='lazy' src={import.meta.env.VITE_POST_IMAGE_BASE_URL + item.media} className='w-full' alt="" />

            <div className='flex items-center justify-between py-5 px-5'>
                <div className='flex items-center'>
                    <button onClick={() => handleLike(item.id)} className='cursor-pointer flex items-center  text-lg lg:text-xl'>
                        {item.is_liked ? <FaHeart className='mr-1 text-red-500' /> : <FaRegHeart className='mr-1' />}
                    </button>

                    <button
                        onClick={() => setOpen(item.id)}
                        className={` text-lg lg:text-xl mr-8 cursor-pointer ${item.is_liked ? "text-red-500" : ""}`}
                    >
                        {item.likes_count}
                    </button>

                    <button
                        onClick={() => setcommentsOpen(item.id)}
                        className='cursor-pointer flex items-center  text-lg lg:text-xl mr-8'
                    >
                        <FaRegComment className='mr-1' />
                        {item?.comments_count}
                    </button>

                    <button className='cursor-pointer flex items-center  text-lg lg:text-xl mr-8'>
                        <FaRegPaperPlane className='mr-1' />
                    </button>
                </div>

                <div className='flex items-center'>
                    <button onClick={() => handleSave(item.id)} className='cursor-pointer flex items-center  text-lg lg:text-xl  ml-5'>
                        {item.is_saved ? <FaBookmark className='mr-1 text-green-500' /> : <FaRegBookmark className='mr-1' />}
                    </button>
                </div>
            </div>
            <p className={`px-5 tracking-wide  text-sm lg:text-base  text-gray-800  h-30 overflow-hidden ${readAll && " h-auto"}`}>
                <span className='font-bold'>{item.user.username} : </span> {item.caption}
            </p>
            <p onClick={() => setreadAll(true)} className='text-green-500 px-5 cursor-pointer underline text-sm lg:text-base mt-2'>Read All</p>
            <p className='px-5 tracking-wide text-justify my-4 text-gray-400'>
                {new Date(item.created_at).toLocaleString("en-US", {
                    year: "numeric",
                    day: "numeric",
                    month: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                })}
            </p>
            <CommentForm
                postId={item.id}
                onSubmitComment={onSubmit}
                isSending={isSendingComment}
            />
        </div>
    )
}

export default HomePost