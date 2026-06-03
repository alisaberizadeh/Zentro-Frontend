import React, { useContext } from 'react'
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext';
import { FaExclamationCircle } from 'react-icons/fa';
import { DevTool } from '@hookform/devtools';

function Login() {
    const { register, control, handleSubmit, setError, watch, formState: { errors }, } = useForm();
    const { signIn, user } = useContext(AuthContext)

    const onSubmit = async (data) => {
        const result = await signIn(data)
        if (!result?.status) {
            setError("root", {
                type: "manual",
                message: "Email or password is incorrect.",
            });
        }
    }
    return (
        <div className='w-full h-screen flex items-center justify-center'>
            <div className='lg:w-4/12 w-10/12 bg-white rounded-ss-3xl rounded-ee-3xl p-10'>
                <img loading='lazy'   src="src/assets/images/avatar.jpg" className='w-2/6 rounded-full m-auto' alt="" />
                <h1 className='text-center text-xl font-medium mt-2 mb-4'>Log in to Your Account</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {errors?.root && <p className='text-sm ml-2 flex items-center text-red-500'> <FaExclamationCircle className='mr-2' />{errors?.root.message}</p>}

                    <input type="text"
                        {...register('username', {
                            required: 'Username is required',
                            pattern: {
                                value: /^[a-zA-Z0-9._]+$/,
                                message:
                                    "Username can contain : English letters | numbers | _ | . ",
                            },
                        })}
                        className={`w-full h-11 lg:h-14 py-3 px-6 outline-none rounded-full my-2 border  ${errors.username ? "border-red-400" : "border-gray-200"}`} placeholder='Username' />
                    {errors.username && <p className='text-sm ml-2 flex items-center text-red-500'> <FaExclamationCircle className='mr-2' />{errors.username.message}</p>}

                    <input type="password"
                        {...register('password', {
                            required: 'Password is required',
                            pattern: {
                                value: /^.{8,}$/,
                                message:
                                    "Password must be more than 8 characters",
                            }
                        })}
                        className={`w-full h-11 lg:h-14 py-3 px-6 outline-none rounded-full my-2 border  ${errors.password ? "border-red-400" : "border-gray-200"}`} placeholder='Password' />
                    {errors.password && <p className='text-sm ml-2 flex items-center text-red-500'> <FaExclamationCircle className='mr-2' />{errors.password.message}</p>}

                    <Link to="" className='text-indigo-700 my-2 ml-2 flex text-xs'>Forgot password ?</Link>
                    <button className='w-full cursor-pointer h-11 lg:h-14 flex items-center justify-center p-3 outline-none rounded-full my-2 bg-green-100 text-green-600 hover:bg-green-200 transition-all duration-300'>Sign In</button>
                    <Link to="/register" className='text-indigo-700 my-2 ml-2 flex text-xs'>Don't have an account? Create one.</Link>
                </form>

            </div>
        </div>
    )
}

export default Login