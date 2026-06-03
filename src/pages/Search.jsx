import React, { useContext, useMemo, useState } from 'react'
import TitlePage from '../components/TitlePage'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { AuthContext } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'

function Search() {
    const { user, token } = useContext(AuthContext)
    const [searchTerm, setSearchTerm] = useState('');

    const { data: search, isLoading: isLoadingsearch } = useQuery({
        queryKey: ['search'],
        queryFn: async () => {
            const res = await axios.get(
                `http://127.0.0.1:8000/api/search/`,
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

    const filteredUsers = useMemo(() => {
        return search?.filter((user) =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, search]);


    return (
        <div className='w-full p-10'>
            <TitlePage title="Search" />

            <div className='w-full h-12 outline-none flex items-center border border-gray-200 my-5 p-5 rounded-full'>
                <span className='text-gray-400 mr-3'><FaSearch /></span>
                <input
                    type="text"
                    placeholder="Search for people..."
                    className='outline-none w-[90%]'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {searchTerm.length > 0 ? (
                <div className='w-full mt-10 grid grid-cols-3 lg:grid-cols-6 gap-5 lg:gap-10'>
                    {filteredUsers?.map((item) => (
                        <Link
                            to={item.id !== user.id ? `/user/${item.id}` : "/profile"}
                            key={item.id}
                            className='col-span-1 rounded-xl text-center border p-5 border-gray-200'
                        >
                            <img loading='lazy'

                                src={import.meta.env.VITE_AVATAR_IMAGE_BASE_URL + item.profile_photo}
                                alt={item.username}
                                className='w-16 aspect-square object-cover m-auto rounded-full'
                            />
                            <p className='w-[95%] overflow-hidden mt-2'>{item.username}</p>
                        </Link>
                    ))}

                    {filteredUsers?.length === 0 && (
                        <p className="col-span-6 text-center text-gray-500">
                            Unfortunately, no user was found
                        </p>
                    )}
                </div>
            ) : (
                <div className="text-center text-gray-400 mt-10">
                    Start typing to search for users...
                    <div className='lg:hidden block'>
                        <p className='mb-5 mt-2'>Or</p>
                        <Link to="/community" className='bg-green-600 text-white py-2 px-7 rounded-xl '>Go to community</Link>
                    </div>
                </div>
            )}

        </div>
    )

}

export default Search