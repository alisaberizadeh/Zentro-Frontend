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

function CreateStory() {
    const navigate = useNavigate();
    const { user, token } = useContext(AuthContext)
    const { register, control, handleSubmit, setError, watch, reset, formState: { errors }, } = useForm();
    const queryClient = useQueryClient()
    const image = watch("image");
    const preview = image && image[0] ? URL.createObjectURL(image[0]) : null;

    const { mutate: CreateStory } = useMutation({
        mutationFn: (data) => {
            const formData = new FormData();
            formData.append("image", data.image[0]);
            return axios.post(
                "http://127.0.0.1:8000/api/stories",
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
                queryKey: ["stories", user?.id],
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
        CreateStory(data);
    };

    return (
        <div className='w-full p-5 lg:p-10'>
            <TitlePage title="Add Story" />
            <form onSubmit={handleSubmit(onSubmit)} className='w-full my-10 grid grid-cols-1'>
                <div className='col-span-1'>
                    {preview && (
                        <img loading='lazy'  
                            src={preview}
                            alt="preview"
                            className="w-1/6   mt-4 rounded-lg"
                        />
                    )}
                    <p className='text-lg text-gray-500 mb-2'><span className='text-red-500 font-black'>*</span> Select Image</p>

                    <input
                        id="post-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        {...register("image", {
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
                        htmlFor="post-image" className={`w-full outline-none border ${errors.image?.message ? "border-red-500" : "border-gray-200"} text-gray-500 flex items-center p-5 cursor-pointer h-10 rounded-lg`} >
                        <span><FaImage /></span>
                    </label>
                    {errors.image && <p className='text-sm ml-2 flex mt-2 items-center text-red-500'> <FaExclamationCircle className='mr-2' />{errors.image?.message}</p>}
                </div>
          
                <Btn text="Upload" />
            </form>
        </div>
    )
}

export default CreateStory