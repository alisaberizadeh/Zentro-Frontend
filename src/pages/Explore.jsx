import React, { useContext } from 'react'
import TitlePage from '../components/TitlePage'
import { AuthContext } from '../contexts/AuthContext'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Link } from 'react-router-dom'

function Explore() {
  const { user, token } = useContext(AuthContext)


  const { data: dataexplore, isLoading: isLoadingexplore } = useQuery({
    queryKey: ['explore', user?.id],
    queryFn: async () => {
      const res = await axios.get(`http://127.0.0.1:8000/api/explore/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      return res.data
    },
    enabled: !!user?.id,
  })

  return (
    <div className='w-full p-5 lg:p-10'>
      <TitlePage title="Explore" />
      <div className='w-full grid grid-cols-3 lg:grid-cols-4 gap-1 my-5   border-t border-gray-100'>
        {isLoadingexplore && (
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
            <div className="animate-pulse  col-span-1 aspect-square  bg-white">
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
            <div className="animate-pulse  col-span-1 aspect-square  bg-white">
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
            <div className="animate-pulse  col-span-1 aspect-square  bg-white">
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
            <div className="animate-pulse  col-span-1 aspect-square  bg-white">
              <div className="h-full bg-gray-300"></div>
            </div>
            <div className="animate-pulse  col-span-1 aspect-square  bg-white">
              <div className="h-full bg-gray-300"></div>
            </div>
          </>
        )}
        {dataexplore?.data?.posts?.map((item, index) => (
          <Link target='_blank' to={`/feed/${item.id}`} key={index} className='col-span-1 bg-gray-300 cursor-pointer relative'>
            <div className="relative group aspect-square overflow-hidden">
              <img loading='lazy'  
                src={import.meta.env.VITE_POST_IMAGE_BASE_URL + item.media}
                alt={item?.user?.username}
                className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-70"
              />


            </div>
          </Link >
        ))}

      </div>
    </div>
  )
}

export default Explore