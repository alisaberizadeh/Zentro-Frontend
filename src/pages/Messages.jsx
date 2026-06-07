import React, { useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import TitlePage from '../components/TitlePage'
import { BiCheck, BiCheckDouble } from 'react-icons/bi'

function Messages() {
  const { user, token } = useContext(AuthContext)
  const queryClient = useQueryClient()

  const { data: conversations_list, isLoading: isLoadingconversations_list } = useQuery({
    queryKey: ['conversations_list'],
    queryFn: async () => {
      const res = await axios.get(`https://api.zentroapp.ir/api/conversations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      return res.data
    },
    staleTime: 30000
  })

  return (
    <div className='w-full p-5 lg:p-10'>
      <TitlePage title={`Messages`} />
      {isLoadingconversations_list && (
        <>
          <div className="animate-pulse w-full h-22 mt-10 aspect-square  bg-white">
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
      <div className='mt-10'>
        {conversations_list?.conversations.map((item) => (
          <Link key={item.id} to={`/conversation/${item.id}`} className='w-full flex items-center my-5 border border-gray-200 rounded-xl p-5'>
            <img loading='lazy' src={import.meta.env.VITE_AVATAR_IMAGE_BASE_URL + item.partner.profile_photo} className='w-16 aspect-square rounded-full object-cover' alt="" />
            <div className='ml-3'>
              <p className=' text-xl lg:text-2xl font-bold tracking-wide'>{item.partner.username}</p>
              <p className=' text-base lg:text-lg flex items-center mt-2 font-light tracking-wide'>{item.last_message}
                <span className='text-green-500 ml-2 text-xl'>
                  {item.is_last_message_mine && (
                    !item.last_message_is_seen ? <BiCheck /> : <BiCheckDouble />
                  )}
                </span>

                {item.unread_count > 0 && <span className='bg-red-500 text-white h-6 flex justify-center text-md items-center ml-1 w-6 rounded-full'>{item.unread_count}</span>}</p>
              <p className='text-xs mt-2 text-gray-400'>
                {new Date(item.last_message_time).toLocaleString("en-US", {
                  year: "numeric",
                  day: "numeric",
                  month: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}</p>
            </div>
          </Link>
        ))}
      </div>

    </div>
  )
}

export default Messages