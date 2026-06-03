import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'

import TitlePage from '../components/TitlePage'
import Story from '../components/Story'
import HomePost from '../components/HomePost'

function Home() {
    const { user, token } = useContext(AuthContext)
    const queryClient = useQueryClient()



    const { data: dadaSAlltories, isLoading: isLoadingStories } = useQuery({
        queryKey: ['Allstories', user?.id],
        queryFn: async () => {
            const res = await axios.get(`http://127.0.0.1:8000/api/stories/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            console.log(res.data);

            return res.data
        },
        staleTime: 30000
    })
    const { data: dataHome, isLoading: isLoadingHome } = useQuery({
        queryKey: ['home', user?.id],
        queryFn: async () => {
            const res = await axios.get(`http://127.0.0.1:8000/api/feed/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return res.data
        },
        enabled: !!user?.id,
        staleTime: 30000
    })



    return (
        <div className=' p-5 lg:p-10'>
            <TitlePage title="Home" />
            <div className='lg:w-2/3 w-full m-auto mt-5'>

                {isLoadingStories ? (
                    <div className="animate-pulse w-full     py-5 rounded-2xl bg-white flex items-center justify-between">
                        <div className="w-full h-26  aspect-squarel  rounded-2xl bg-gray-300"></div>

                    </div>
                ) : (
                    <Story data={dadaSAlltories} />

                )}
                {isLoadingHome && (
                    <div className='mt-5'>
                        <div className="animate-pulse aspect-square mb-5 rounded-2xl bg-white">
                            <div className="h-full bg-gray-300 rounded-2xl"></div>
                        </div>
                        <div className="animate-pulse aspect-square mb-5 rounded-2xl bg-white">
                            <div className="h-full bg-gray-300 rounded-2xl"></div>
                        </div>
                        <div className="animate-pulse aspect-square mb-5 rounded-2xl bg-white">
                            <div className="h-full bg-gray-300 rounded-2xl"></div>
                        </div>
                        <div className="animate-pulse aspect-square mb-5 rounded-2xl bg-white">
                            <div className="h-full bg-gray-300 rounded-2xl"></div>
                        </div>
                        <div className="animate-pulse aspect-square mb-5 rounded-2xl bg-white">
                            <div className="h-full bg-gray-300 rounded-2xl"></div>
                        </div>
                        <div className="animate-pulse aspect-square mb-5 rounded-2xl bg-white">
                            <div className="h-full bg-gray-300 rounded-2xl"></div>
                        </div>
                    </div>
                )}
                {dataHome?.data?.posts?.map((item) => (
                    <HomePost key={item.id} item={item} />
                ))}
            </div>
        </div>

    )
}

export default Home
