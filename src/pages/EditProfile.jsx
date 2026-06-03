import React, { useContext, useRef } from 'react'
import TitlePage from '../components/TitlePage'
import Btn from '../components/Btn'
import { AuthContext } from '../contexts/AuthContext';
import Cookies from "js-cookie";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios'
import { BiCamera } from 'react-icons/bi';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FaExclamationCircle } from 'react-icons/fa';

function EditProfile() {
    const { user } = useContext(AuthContext)
    const token = Cookies.get("token");
    const fileInputRef = useRef(null);
    const handleClick = () => { fileInputRef.current.click(); };
    const { register, control, handleSubmit, setError, watch, formState: { errors }, } = useForm();
    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: (formData) =>
            axios.post("http://127.0.0.1:8000/api/update/avatar", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["userShow"],
            });
            toast.success(`Profile photo updated successfully .`, {
                position: "bottom-left",
                autoClose: 5000,
                style: {
                    // background: "#16a34a",
                    // color: "#fff",
                    width: "auto",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    paddingRight: "50px",
                },

            });
        },
    });
    const { mutate:updateInfo } = useMutation({
        mutationFn: (formData) =>
            axios.put("http://127.0.0.1:8000/api/update/info", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
        onSuccess: (data) => {
            
            queryClient.invalidateQueries({
                queryKey: ["userShow"],
            });
            toast.success(`Profile information was successfully updated . `, {
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

    const changePhoto = (e) => {
        const formData = new FormData();
        formData.append("avatar", e.target.files[0]);
        formData.append("_method", "PUT");
        mutate(formData);
    };

    const onSubmit = async (data) => {
        
        updateInfo(data)
        
    }

    return (
        <div className='w-full p-5 lg:p-10'>
            <TitlePage title="Edit Profile" />

            <div className=' my-10'>
                <div className='col-span-1'>
                    <p className='text-lg text-gray-500 mb-2'>Change Photo</p>
                    <div className='flex items-center  w-16 h-16 cursor-pointer relative' onClick={handleClick} >
                        <img loading='lazy'   src={import.meta.env.VITE_AVATAR_IMAGE_BASE_URL + user?.profile_photo} alt={user?.name} className=' w-16 h-16 rounded-full object-cover    ' />
                        <span><BiCamera className='bg-black absolute bottom-0 right-0 text-white text-2xl p-1 rounded-full' /></span>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        className="hidden"
                        onChange={(event) => changePhoto(event)}
                    />
                </div>
            </div>

            <div className=''>
                <form className='grid grid-cols-3 gap-5' onSubmit={handleSubmit(onSubmit)}>
                    <div className='col-span-3 lg:col-span-1'>
                        <p className='text-lg text-gray-500 mb-2'>Username</p>
                        <p className='w-full outline-none border border-gray-200 bg-gray-100 cursor-not-allowed py-2 px-5 rounded-lg'>{user?.username}</p>
                    </div>
                    <div className='col-span-3 lg:col-span-1'>
                        <p className='text-lg text-gray-500 mb-2'>Email</p>
                        <p className='w-full outline-none border border-gray-200 bg-gray-100 cursor-not-allowed py-2 px-5 rounded-lg'>{user?.email}</p>
                    </div>
                    <div className='col-span-3 lg:col-span-1'>
                        <p className='text-lg text-gray-500 mb-2'>Mobile</p>
                        <input type="text"
                            {...register("mobile", {
                                pattern: {
                                    value: /^(091|092|093|099)\d{8}$/,
                                    message: "Mobile number is invalid",
                                },
                            })}
                            className={`w-full outline-none border ${errors.mobile?.message ? "border-red-500" : "border-gray-200"}  p-5 h-10 rounded-lg`} defaultValue={user?.mobile || ""} />
                        {errors.mobile && <p className='text-sm ml-2 flex items-center text-red-500'> <FaExclamationCircle className='mr-2' />{errors.mobile?.message}</p>}

                    </div>
                    <div className='col-span-3 lg:col-span-1'>
                        <p className='text-lg text-gray-500 mb-2'>Name</p>
                        <input type="text"
                            {...register('name', {
                            })}
                            className={`w-full outline-none border ${errors.name?.message ? "border-red-500" : "border-gray-200"}  p-5 h-10 rounded-lg`} defaultValue={user?.name} />
                        {errors.name && <p className='text-sm ml-2 flex items-center text-red-500'> <FaExclamationCircle className='mr-2' />{errors.name?.message}</p>}

                    </div>
                    <div className='col-span-3 lg:col-span-1'>
                        <p className='text-lg text-gray-500 mb-2'>Link</p>
                        <input type="text"
                            {...register("website", {
                                pattern: {
                                    value: /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/,
                                    message: "Link is invalid",
                                },
                            })}
                            className={`w-full outline-none border ${errors.website?.message ? "border-red-500" : "border-gray-200"}  p-5 h-10 rounded-lg`}  defaultValue={user?.website} />
                        {errors.website && <p className='text-sm ml-2 flex items-center text-red-500'> <FaExclamationCircle className='mr-2' />{errors.website?.message}</p>}
                    </div>
                    <div className='col-span-3'>
                        <p className='text-lg text-gray-500 mb-2'>Bio</p>
                        <textarea
                            {...register("bio", {
                                maxLength: {
                                    value: 300,
                                    message: "Bio must not exceed 300 characters",
                                },
                            })}
                            className={`w-full h-52 outline-none border ${errors.bio?.message ? "border-red-500" : "border-gray-200"}  p-5  rounded-lg`} defaultValue={user?.bio} />
                        {errors.bio && <p className='text-sm ml-2 flex items-center text-red-500'> <FaExclamationCircle className='mr-2' />{errors.bio?.message}</p>}
                    <Btn text="Update" />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditProfile