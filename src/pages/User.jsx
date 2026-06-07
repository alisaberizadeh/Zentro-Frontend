import React, { useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FaLink } from 'react-icons/fa6'
import { BiBookmark } from 'react-icons/bi'
import { FiEdit2, FiImage } from 'react-icons/fi'
import { CgAdd, CgClose } from 'react-icons/cg'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import Cookies from "js-cookie";
import TitlePage from '../components/TitlePage'
import { toast } from 'react-toastify'
import StoryViewer from '../components/StoryViewer'

function User() {
    const { user, token } = useContext(AuthContext)
    const { id } = useParams()
    const queryClient = useQueryClient()
    const [openFollowers, setOpenFollowers] = useState(false);
    const [setOpenFollowings, setsetOpenFollowings] = useState(false)
    const [activeStory, setActiveStory] = useState(null)
    const navigate = useNavigate();

    const { data: dadaStories, isLoading: isLoadingStories } = useQuery({
        queryKey: ['stories', id],
        queryFn: async () => {
            const res = await axios.get(`https://api.zentroapp.ir/api/stories/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return res.data
        },
        staleTime: 30000
    })
    const { data: dataUser, isLoading: isLoadingUser } = useQuery({
        queryKey: ["userInfo", id, token],
        queryFn: async () => {
            const res = await axios.get(
                `https://api.zentroapp.ir/api/user/${id}`,
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
        enabled: !!id && !!token,
        staleTime: 30000,
    });
    const { data, isLoading, error } = useQuery({
        queryKey: ['followers', id],
        queryFn: async () => {
            const res = await axios.get(
                `https://api.zentroapp.ir/api/followers/${id}`,
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
        enabled: !!id,
        staleTime: 30000
    })
    const { data: followingsData, isLoading: isLoadingFollowings } = useQuery({
        queryKey: ['followings', id],
        queryFn: async () => {
            const res = await axios.get(
                `https://api.zentroapp.ir/api/followings/${id}`,
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
        enabled: !!id,
        staleTime: 30000
    })

    const { data: postsdata, isLoading: postsLoading } = useQuery({
        queryKey: ['posts', id],
        queryFn: async () => {
            const res = await axios.get(
                `https://api.zentroapp.ir/api/posts/user/${id}`,
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
        enabled: !!id,
        staleTime: 30000

    })

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
                queryKey: ["userInfo", id, token],
            });
            queryClient.invalidateQueries({
                queryKey: ["followings", user?.id],
            });
            queryClient.invalidateQueries({
                queryKey: ["followers", id],
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
                queryKey: ["followings", id],
            });
            queryClient.invalidateQueries({
                queryKey: ["followers", id],
            });
            queryClient.invalidateQueries({
                queryKey: ["followings", user?.id],
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


    const { mutate: startMessages } = useMutation({
        mutationFn: () =>
            axios.post(`https://api.zentroapp.ir/api/messages/start/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }),
        onSuccess: (data) => {

            queryClient.invalidateQueries({
                queryKey: ["messages", data?.data.id],
            });
            queryClient.invalidateQueries({
                queryKey: ["conversations_list"],
            });
            navigate(`/conversation/${data?.data.id}`)
        },
    });


    return (
        <div className='w-full p-5 lg:p-10'>
            {/* show followers */}
            <div
                onClick={() => setOpenFollowers(false)}
                className={`fixed inset-0 bg-black/50 flex items-center justify-center transition-all duration-300 z-50 ${openFollowers
                    ? "opacity-100 visible"
                    : "opacity-0 invisible"
                    }`}>
                <div
                    onClick={(e) => e.stopPropagation()}
                    className={`bg-white lg:w-1/3 w-full h-full lg:max-h-2/3 overflow-y-auto lg:rounded-2xl p-5 transition-all duration-300 ${openFollowers
                        ? "scale-100 translate-y-0"
                        : "scale-90 translate-y-10"
                        }`}
                >
                    <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
                        Followers ({data?.count})
                        <span onClick={() => setOpenFollowers(false)} className='cursor-pointer'><CgClose /></span>

                    </h2>

                    <div className="space-y-3">
                        {
                            data?.followers && (
                                data?.followers.length > 0 ? data?.followers.map((item, index) => (
                                    <div key={index} className='flex items-center m-0 p-3 border-t border-gray-200 justify-between'>
                                        <Link target="_blank" to={item.id != user.id ? `/user/${item.id}` : "/profile"} className='flex items-center'>
                                            <img loading='lazy' src={import.meta.env.VITE_AVATAR_IMAGE_BASE_URL + item.profile_photo} className='w-12 h-12  object-cover mr-3 rounded-full' alt={item.username} />
                                            {item.username}
                                        </Link>
                                        {item.id != user.id && (
                                            item.is_following ? (
                                                <button onClick={() => handleFollowUser(item.id)} className='bg-green-100 text-green-600 py-2 rounded-lg cursor-pointer hover:bg-green-200 px-8'>UnFollow</button>

                                            ) : (
                                                < button onClick={() => handleFollowUser(item.id)} className='bg-green-600 text-white py-2 rounded-lg cursor-pointer hover:bg-green-700 px-8'>Follow</button>

                                            )
                                        )}

                                    </div>
                                )) : (
                                    <h1>The number of Followers is 0 , currently.</h1>
                                )
                            )
                        }

                    </div>
                </div>
            </div>

            {/* show followings */}
            <div
                onClick={() => setsetOpenFollowings(false)}
                className={`fixed inset-0 bg-black/50 flex items-center justify-center transition-all duration-300 z-50 ${setOpenFollowings
                    ? "opacity-100 visible"
                    : "opacity-0 invisible"
                    }`}>
                <div
                    onClick={(e) => e.stopPropagation()}
                    className={`bg-white lg:w-1/3 w-full h-full lg:max-h-2/3 overflow-y-auto lg:rounded-2xl p-5 transition-all duration-300 ${setOpenFollowings
                        ? "scale-100 translate-y-0"
                        : "scale-90 translate-y-10"
                        }`}
                >
                    <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
                        Followings ({followingsData?.count})
                        <span onClick={() => setsetOpenFollowings(false)} className='cursor-pointer'><CgClose /></span>

                    </h2>

                    <div className="space-y-3">
                        {
                            followingsData?.followings && (
                                followingsData?.followings.length > 0 ? followingsData?.followings.map((item, index) => (
                                    <div key={index} className='flex items-center m-0 p-3 border-t border-gray-200 justify-between'>
                                        <Link target="_blank" to={item.id != user.id ? `/user/${item.id}` : "/profile"} className='flex items-center'>
                                            <img loading='lazy' src={import.meta.env.VITE_AVATAR_IMAGE_BASE_URL + item.profile_photo} className='w-12 h-12  object-cover mr-3 rounded-full' alt={item.username} />
                                            {item.username}
                                        </Link>
                                        {item.id != user.id && (
                                            item.is_following ? (
                                                <button onClick={() => handleFollowUser(item.id)} className='bg-green-100 text-green-600 py-2 rounded-lg cursor-pointer hover:bg-green-200 px-8'>UnFollow</button>

                                            ) : (
                                                < button onClick={() => handleFollowUser(item.id)} className='bg-green-600 text-white py-2 rounded-lg cursor-pointer hover:bg-green-700 px-8'>Follow</button>

                                            )
                                        )}

                                    </div>
                                )) : (
                                    <h1>The number of Followings is 0 , currently.</h1>
                                )
                            )
                        }

                    </div>
                </div>
            </div>
            {!isLoadingUser && dataUser?.status == false ? (

                <div className='text-center col-span-2 text-4xl text-green-600'>
                    <p className='my-5 font-bold'>404</p>
                    <p className='my-5 font-bold'>User not found</p>
                </div>
            ) : (
                <>
                    <TitlePage title={dataUser?.data?.user.username} />
                    <div className='min-h-[200px]'>



                        <div className='w-full grid grid-cols-4 min-h-50 '>
                            <div className='xl:col-span-1 flex items-center'>
                                
                                {isLoadingUser ? (
                                    <div className="animate-pulse  col-span-1  bg-white">
                                        <div className="w-28 mt-2 aspect-square rounded-full  cursor-pointer    bg-gray-300"></div>
                                    </div>
                                ) : (
                                    <img loading='lazy'
                                        onClick={() => {
                                            if (dadaStories?.stories?.length > 0) {
                                                setActiveStory(dadaStories)
                                            }
                                        }}
                                        src={import.meta.env.VITE_AVATAR_IMAGE_BASE_URL + dataUser?.data?.user.profile_photo}
                                        alt={dataUser?.data?.user.username}
                                        className={`w-36 aspect-square  object-cover rounded-full my-7 p-1 ${dadaStories?.stories?.length > 0
                                            ? (dadaStories.stories.every(story => story.viewed)
                                                ? "border-6 border-gray-300"
                                                : "border-6 border-red-600")
                                            : "border border-gray-200"
                                            } cursor-pointer`}
                                    />

                                )}


                            </div>
                            <div className='xl:col-span-2 col-span-3 ml-7 flex gap-5 lg:gap-20 items-center'>

                                {postsLoading ? (
                                    <div className="animate-pulse  w-20 h-2 bg-white">
                                        <div className="h-full w-3/4 mx-auto  rounded-2xl  mb-3  bg-gray-300"></div>
                                        <div className="h-full  rounded-2xl  bg-gray-300"></div>
                                    </div>
                                ) : (
                                    <div className='text-center col-span-1 '>
                                        <div className='lg:text-5xl text-3xl font-bold'>
                                            {postsdata?.data?.post.length}
                                        </div>
                                        <p className='mt-2 text-md lg:text-xl'>Posts</p>
                                    </div>
                                )}
                                {isLoading ? (
                                    <div className="animate-pulse  w-20 h-2 bg-white">
                                        <div className="h-full w-3/4 mx-auto  rounded-2xl  mb-3  bg-gray-300"></div>
                                        <div className="h-full  rounded-2xl  bg-gray-300"></div>
                                    </div>
                                ) : (
                                    <div className='text-center col-span-1 cursor-pointer' onClick={() => setOpenFollowers(true)}>
                                        <div className='lg:text-5xl text-3xl font-bold'>
                                            {data?.count}
                                        </div>
                                        <p className='mt-2 text-md lg:text-xl'>Followers</p>
                                    </div>
                                )}
                                {isLoadingFollowings ? (
                                    <div className="animate-pulse  w-20 h-2 bg-white">
                                        <div className="h-full w-3/4 mx-auto  rounded-2xl  mb-3  bg-gray-300"></div>
                                        <div className="h-full  rounded-2xl  bg-gray-300"></div>
                                    </div>
                                ) : (
                                    <div className='text-center col-span-1 cursor-pointer' onClick={() => setsetOpenFollowings(true)}>
                                        <div className='lg:text-5xl text-3xl font-bold'>
                                            {followingsData?.count}
                                        </div>
                                        <p className='mt-2 text-md lg:text-xl'>Followings</p>
                                    </div>
                                )}



                            </div>
                            <div className="xl:col-span-1 col-span-4 grid grid-cols-2 gap-5 items-center content-center">  
                                {!isLoadingUser && (
                                    <>
                                        <button
                                            onClick={handleFollow}
                                            className={`col-span-1 xl:col-span-2 flex items-center justify-center text-md cursor-pointer xl:text-lg h-fit rounded-xl transition-all duration-300 py-2 ${dataUser?.data.is_following
                                                    ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                                    : 'bg-green-600 text-white hover:bg-green-700'
                                                }`}
                                        >
                                            {dataUser?.data.is_following ? 'UnFollow' : 'Follow'}
                                        </button>
                                        <button
                                            onClick={() => startMessages()}
                                            className='bg-green-600 text-white cursor-pointer hover:bg-green-700 h-fit transition-all col-span-1 xl:col-span-2 
                flex items-center justify-center duration-300 text-md xl:text-lg rounded-xl py-2'
                                        >
                                            Message
                                        </button>
                                    </>
                                )}
                            </div>


                        </div>



                        <p className='text-2xl  my-5 xl:my-2 '>{dataUser?.data?.user.name}</p>
                        <p className='text-xl font-light my-2 tracking-wide text-gray-700'>{dataUser?.data?.user.bio}</p>
                        {dataUser?.data?.user.website && (
                            <Link to={dataUser?.data?.user.website} className='text-lg text-green-700 flex items-center my-2 '><FaLink className='mr-2' /> {dataUser?.data?.user.website}</Link>

                        )}
                    </div>

                    <div className='w-full grid grid-cols-3 lg:grid-cols-4 gap-1 my-5   border-t border-gray-100'>
                        {postsdata?.data?.post.length < 1 && (
                            <div className="col-span-4 flex flex-col items-center justify-center py-16 text-gray-500">
                                <FiImage className="text-5xl mb-4 text-gray-400" />
                                <p className="text-lg font-medium">No posts to show</p>
                                <p className="text-sm text-gray-400 mt-1">
                                    When posts are available, they will appear here.
                                </p>
                            </div>
                        )}
                        {postsLoading && (
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
                        {postsdata?.data?.post.map((item, index) => (
                            <Link to={`/feed/${item.id}`} key={index} className='col-span-1 bg-gray-300 cursor-pointer relative'>
                                <div className="relative group aspect-square overflow-hidden">
                                    <img loading='lazy'
                                        src={import.meta.env.VITE_POST_IMAGE_BASE_URL + item.media}
                                        alt={dataUser?.data?.user.username}
                                        className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-70"
                                    />


                                </div>
                            </Link >
                        ))}

                    </div>
                    {activeStory && (
                        <StoryViewer
                            story={activeStory}
                            onClose={() => setActiveStory(null)}
                        />
                    )}
                </>
            )}




        </div>
    )
}

export default User