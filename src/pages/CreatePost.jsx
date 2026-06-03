import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useContext, useRef } from 'react'
import { useForm } from 'react-hook-form';
import { AuthContext } from '../contexts/AuthContext';
import TitlePage from '../components/TitlePage';
import Btn from '../components/Btn';
import { FaImage } from 'react-icons/fa6';
import { FaExclamationCircle } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function CreatePost() {
    const navigate = useNavigate();
    const { user, token } = useContext(AuthContext)
    const { register, control, handleSubmit, setError, watch, reset, formState: { errors }, } = useForm();
    const queryClient = useQueryClient()
    const image = watch("media");
    const preview = image && image[0] ? URL.createObjectURL(image[0]) : null;
    const { mutate: createPost } = useMutation({
        mutationFn: (data) => {
            const formData = new FormData();
            formData.append("media", data.media[0]);
            formData.append("caption", data.caption || "");
            return axios.post(
                "http://127.0.0.1:8000/api/posts",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
        },

        onSuccess: (res) => {
            queryClient.invalidateQueries({
                queryKey: ["posts", user?.id],
            });
            toast.success(res.data.message, {
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
            navigate('/profile')
        },
    });

    const onSubmit = (data) => {
        createPost(data);
    };

    return (
        <div className='w-full p-5 lg:p-10'>
            <TitlePage title="Add Post" />
            <form onSubmit={handleSubmit(onSubmit)} className='w-full my-10 grid grid-cols-1'>
                <div className='col-span-1'>
                    {preview && (
                        <img loading='lazy'  
                            src={preview}
                            alt="preview"
                            className="w-full max-w-sm mt-4 rounded-lg"
                        />
                    )}
                    <p className='text-lg text-gray-500 mb-2'><span className='text-red-500 font-black'>*</span> Select Image</p>

                    <input
                        id="post-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        {...register("media", {
                            required: "Image is required",
                            validate: {
                                fileType: (files) =>
                                    files?.[0]?.type.startsWith("image/") || "Only image files are allowed",

                                fileSize: (files) =>
                                    files?.[0]?.size <= 3 * 1024 * 1024 || "File size must be less than 3MB",
                            },
                        })}
                    />


                    <label
                        htmlFor="post-image" className={`w-full outline-none border ${errors.media?.message ? "border-red-500" : "border-gray-200"} text-gray-500 flex items-center p-5 cursor-pointer h-10 rounded-lg`} >
                        <span><FaImage /></span>
                    </label>
                    {errors.media && <p className='text-sm ml-2 flex mt-2 items-center text-red-500'> <FaExclamationCircle className='mr-2' />{errors.media?.message}</p>}
                </div>
                <div className='col-span-3'>
                    <p className='text-lg text-gray-500 mb-2 mt-5'>Enter Caption</p>
                    <textarea

                        {...register("caption", {
                            maxLength: {
                                value: 700,
                                message: "Caption must not exceed 400 characters",
                            },
                            validate: {
                                notEmpty: (value) =>
                                    value.trim().length === 0 || value.trim().length >= 3 || "Caption is too short",
                            },
                        })}
                        className={`w-full h-52 outline-none border ${errors.caption?.message ? "border-red-500" : "border-gray-200"
                            } p-5 rounded-lg`}
                    />

                    {errors.caption && <p className='text-sm ml-2 flex items-center text-red-500'> <FaExclamationCircle className='mr-2' />{errors.caption?.message}</p>}
                </div>
                <Btn text="Upload" />
            </form>
        </div>
    )
}

export default CreatePost