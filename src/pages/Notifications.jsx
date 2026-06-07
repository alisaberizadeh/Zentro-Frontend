import React, { useContext } from 'react'
import TitlePage from '../components/TitlePage'
import { AuthContext } from '../contexts/AuthContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { HiHeart } from 'react-icons/hi'
import { BiCheckDouble, BiComment, BiUserPlus } from 'react-icons/bi'
import { FaComment, FaRegComment, FaRegCommentDots, FaRegHeart } from 'react-icons/fa'
import { toast } from 'react-toastify'

function Notifications() {
  const queryClient = useQueryClient()
  const { user, token } = useContext(AuthContext)
  const { data: notifications, isLoading: isLoadingnotifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await axios.get(
        `https://api.zentroapp.ir/api/notifications`,
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

  const { mutate: readNotifications } = useMutation({
    mutationFn: (id) =>
      axios.post(`https://api.zentroapp.ir/api/notifications/read`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['notifications'],
      })
      queryClient.invalidateQueries({
        queryKey: ['notificationsCount'],
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

  return (
    <div className='w-full p-5 lg:p-10'>
      <TitlePage title={`Notifications`} />
      <button onClick={() => readNotifications()} className='bg-green-600 text-white hover:bg-green-700 py-2 px-7 rounded-md mt-10 cursor-pointer flex items-center'><BiCheckDouble className='mr-2 text-xl' /> Mark as read</button>
      {isLoadingnotifications && (
        <>
          <div className="animate-pulse w-full h-22 mt-5 aspect-square  bg-white">
            <div className="h-full bg-gray-300 rounded-xl"></div>
          </div>
          <div className="animate-pulse w-full h-22 mt-5 aspect-square  bg-white">
            <div className="h-full bg-gray-300 rounded-xl"></div>
          </div>
          <div className="animate-pulse w-full h-22 mt-5 aspect-square  bg-white">
            <div className="h-full bg-gray-300 rounded-xl"></div>
          </div>
          <div className="animate-pulse w-full h-22 mt-5 aspect-square  bg-white">
            <div className="h-full bg-gray-300 rounded-xl"></div>
          </div>
          <div className="animate-pulse w-full h-22 mt-5 aspect-square  bg-white">
            <div className="h-full bg-gray-300 rounded-xl"></div>
          </div>
          <div className="animate-pulse w-full h-22 mt-5 aspect-square  bg-white">
            <div className="h-full bg-gray-300 rounded-xl"></div>
          </div>
        </>
      )}
      {notifications?.data.map((item) => (
        <div key={item.id} className={`w-full border   my-5 flex p-5 border-gray-200 rounded-xl items-center justify-between ${item.is_read ? "bg-gray-100" : "none"}`}>

          {item.type == "like" && (

            <>
              <div className=' w-full items-center  grid-cols-2 grid  '>
                <div className='flex items-center col-span-2 lg:col-span-1 '>
                  <div className={`p-1 mr-3 ${item.is_read ? "text-gray-400" : "text-black"} rounded-full`}>
                    <FaRegHeart className='text-xl' />
                  </div>
                  <img loading='lazy' src={import.meta.env.VITE_POST_IMAGE_BASE_URL + item.post.media} className='w-[10%]' alt="" />
                  <span className='ml-4 text-sm lg:text-base'>
                    Your post was liked by : <Link className='font-black' to={item.from_user.id != user.id ? `/user/${item.from_user.id}` : "/profile"}>{item.from_user.username}</Link>
                  </span>

                </div>
                <div className='flex items-center col-span-2 lg:col-span-1 mt-3 lg:mt-0 '>
                  <span className='text-xs text-gray-400 '>{new Date(item.created_at).toLocaleString("en-US", {
                    year: "numeric",
                    day: "numeric",
                    month: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}</span>

                  {!item.is_read && (
                    <span className='bg-green-500 text-white text-xs px-3 py-1 ml-3 rounded-full'>New</span>
                  )}
                  <Link className='text-green-500 underline ml-5' to={`/feed/${item.post.id}`}>Show Post</Link>

                </div>
              </div>
            </>

          )}

          {item.type == "follow" && (

            <>
              <div className='w-full items-center grid grid-cols-2  '>
                <div className='flex items-center col-span-2 lg:col-span-1 '>
                  <div className={`p-1 mr-3 ${item.is_read ? "text-gray-400" : "text-black"} rounded-full `}>
                    <BiUserPlus className='text-3xl' />
                  </div>
                  <img loading='lazy' src={import.meta.env.VITE_AVATAR_IMAGE_BASE_URL + item.from_user.profile_photo} className='w-12 h-12  object-cover rounded-full' alt="" />
                  <span className='ml-4 text-sm lg:text-base'>
                    Followed you : <Link className='font-black' to={item.from_user.id != user.id ? `/user/${item.from_user.id}` : "/profile"} >{item.from_user.username}</Link>
                  </span>
                </div>

                <div className='flex items-center col-span-2 lg:col-span-1 mt-3 lg:mt-0 '>
                  <span className='text-xs text-gray-400 '>{new Date(item.created_at).toLocaleString("en-US", {
                    year: "numeric",
                    day: "numeric",
                    month: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}</span>
                  {!item.is_read && (
                    <span className='bg-green-500 text-white text-xs px-3 py-1 ml-3 rounded-full'>New</span>
                  )}
                  <Link className='text-green-500 underline ml-5' to="/profile">Show Profie</Link>

                </div>


              </div>
            </>

          )}

          {item.type == "comment" && (

            <>
              <div className=' w-full items-center  grid-cols-2 grid  '>
                <div className='flex items-center col-span-2 lg:col-span-1 '>
                  <div className={`p-1 mr-3 ${item.is_read ? "text-gray-400" : "text-black"} rounded-full`}>
                    <FaRegComment className='text-xl' />
                  </div>
                  <img loading='lazy' src={import.meta.env.VITE_POST_IMAGE_BASE_URL + item.post.media} className='w-[10%]' alt="" />
                  <span className='ml-4 text-sm lg:text-base'>
                    New comment by  : <Link className='font-black' to={item.from_user.id != user.id ? `/user/${item.from_user.id}` : "/profile"}>{item.from_user.username}</Link>
                  </span>

                </div>
                <div className='flex items-center col-span-2 lg:col-span-1 mt-3 lg:mt-0 '>
                  <span className='text-xs text-gray-400 '>{new Date(item.created_at).toLocaleString("en-US", {
                    year: "numeric",
                    day: "numeric",
                    month: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}</span>

                  {!item.is_read && (
                    <span className='bg-green-500 text-white text-xs px-3 py-1 ml-3 rounded-full'>New</span>
                  )}
                  <Link className='text-green-500 underline ml-5' to={`/feed/${item.post.id}`}>Show Post</Link>

                </div>
              </div>
            </>

          )}
        </div>
      ))}
    </div>
  )
}

export default Notifications