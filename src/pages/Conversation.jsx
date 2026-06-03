import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import chatBg from '../assets/images/chatbg.png';
import { BiCheck, BiCheckDouble, BiLink, BiSend } from 'react-icons/bi'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import Btn from '../components/Btn'
import { FaExclamationCircle } from 'react-icons/fa'

function Conversation() {
  const { id } = useParams()
  const { user, token } = useContext(AuthContext)
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false);

  const scrollRef = useRef(null);
  let lastDate = null;
  const { register, control, handleSubmit, setError, watch, reset, formState: { errors }, } = useForm();
  const { register: register_sendFile, handleSubmit: handleSubmit_sendFile, watch: watch_sendFile, reset: reset_sendFile, formState: { errors: errors_sendFile }, } = useForm();
  const { mutate: messagesSeen } = useMutation({
    mutationFn: () =>
      axios.post(`http://127.0.0.1:8000/api/messages/${id}/seen`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["conversations_list"],
      });
    },
  })

  const { data: conversation, isLoading: isLoadingconversation } = useQuery({
    queryKey: ['conversation', id],
    queryFn: async () => {
      const res = await axios.get(`http://127.0.0.1:8000/api/conversations/show/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      return res.data
    },
    staleTime: 30000
  })
  const { data: messages, isLoading: isLoadingmessages } = useQuery({
    queryKey: ['messages', id],
    queryFn: async () => {
      const res = await axios.get(`http://127.0.0.1:8000/api/messages/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return res.data;
    },
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    staleTime: 0,
  });
  const { mutate: sendMessage } = useMutation({
    mutationFn: (form) => {
      return axios.post(
        "http://127.0.0.1:8000/api/messages/send",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
    },

    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["conversations_list"],
      });


      reset()
    },
  });
  const onSubmit = (data) => {
    const form = {
      "conversation_id": id,
      "message": data.message
    }
    sendMessage(form)

  }
  const { mutate: sendFile } = useMutation({
    mutationFn: (formData) => {
      return axios.post(
        "http://127.0.0.1:8000/api/messages/file",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
    },

    onSuccess: (res) => {
      setOpen(false)

      queryClient.invalidateQueries({
        queryKey: ["messages", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["conversations_list"],
      });
      reset()
      reset_sendFile()
    },
  });
  const onSubmit_sendFile = (data) => {
    const formData = new FormData();
    formData.append("file", data.file[0]);
    formData.append("conversation_id", id);
    formData.append("message", data.message);
    sendFile(formData)
  }

  useEffect(() => {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    messagesSeen()
  }, [messages]);


  return (

    <div
      className='h-full m-auto bg-green-100 bg-repeat'
      style={{
        backgroundImage: `url(${chatBg})`,
        backgroundSize: 'auto', // مطمئن شوید که سایز اصلی عکس حفظ می‌شود (تکرار شود)
        backgroundRepeat: 'repeat' // تکرار در هر دو جهت
      }}
    >

      <Link to={conversation?.data?.partner.id !== user.id ? `/user/${conversation?.data?.partner.id}` : "/profile"} className='flex shadow- shadow-black  items-center h-[8%] px-5 w-full bg-green-600'>
        <img loading='lazy' src={import.meta.env.VITE_AVATAR_IMAGE_BASE_URL + conversation?.data?.partner.profile_photo}
          className='w-12 border border-gray-200   object-cover h-12 mr-3 rounded-full' alt={conversation?.data?.partner.username} />
        <span className='text-white font-bold text-xl tracking-wide'>  {conversation?.data?.partner.username}</span>
      </Link>

      <div ref={scrollRef} className='w-full lg:h-[86%] h-[77%] overflow-y-scroll '>

        {isLoadingmessages && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-20 h-20 border-8 border-white border-t-green-600 rounded-full animate-spin"></div>
          </div>

        )}


        {messages?.map((item) => {
          const currentDate = new Date(item.created_at).toLocaleDateString("en-US");
          const showDate = currentDate !== lastDate;
          if (showDate) lastDate = currentDate;

          const timeString = new Date(item.created_at).toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

          const isMe = item.sender_id == user.id;

          const messageElement = (
            <div className={`w-full flex ${isMe ? 'justify-end' : 'justify-start'} my-5`}>
              <div className={`${isMe ? 'bg-green-700 text-white rounded-tl-xl rounded-bl-xl rounded-tr-xl' : 'bg-white rounded-tr-xl rounded-tl-xl rounded-br-xl'} mx-5 px-6 py-1 shadow shadow-black`}>
                {item.attachment && (
                  <Link target='_blank' to={import.meta.env.VITE_CHAT_FILE_BASE_URL + item?.attachment}
                    className=' lg:text-4xl text-2xl justify-center rounded-xl items-center border border-gray-200 p-1 flex m-2'
                  >
                    {item?.attachment && (
                      (() => {
                        const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(item.attachment);
                        return isImage ? (
                          <img
                            src={`${import.meta.env.VITE_CHAT_FILE_BASE_URL}${item.attachment}`}
                            alt="attachment"
                            style={{ maxWidth: '200px', borderRadius: '8px' }}
                          />
                        ) : (
                          <div className="flex items-center">
                            <BiLink />
                            <span className='lg:text-lg text-sm ml-3'>{item.attachment}</span>
                          </div>
                        );
                      })()
                    )}


                  </Link>
                )}
                <p className='text-sm lg:text-base'>{item.message}</p>
                <p className={`text-xs font-light tracking-wider ${isMe ? 'flex items-center text-gray-300' : 'text-gray-400'}`}>
                  {timeString}
                  {isMe && (
                    <span className='text-xl ml-2'>
                      {item.is_seen ? <BiCheckDouble /> : <BiCheck />}
                    </span>
                  )}
                </p>
              </div>
            </div>
          );

          return (
            <React.Fragment key={item.id}>
              {showDate && (
                <div className='bg-[#32066b4d] text-white tracking-wider font-light flex items-center justify-center my-2'>
                  {currentDate}
                </div>
              )}
              {messageElement}
            </React.Fragment>
          );
        })}








      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='w-full h-[6%] flex items-center justify-between bg-white'>
        <input {...register("message", {
          required: "message is required",
          maxLength: {
            value: 700,
            message: "message must not exceed 700 characters",
          },
          validate: {
            minLength: (value) =>
              value.trim().length >= 3 || "message is too short",

            noScript: (value) =>
              !/<script\b[^>]*>([\s\S]*?)<\/script>/gim.test(value) || "Invalid characters detected",

            notOnlySpaces: (value) =>
              value.trim().length > 0 || "message cannot be empty"
          },
        })}
          type="text" className={`w-[80%] h-full outline-none px-5`} placeholder='Write your message...' />
        <button type='button' onClick={() => setOpen(true)} className='w-[10%] cursor-pointer hover:bg-green-200 transition-all
         duration-300 text-green-600 text-3xl h-full flex items-center justify-center bg-green-100'><BiLink /></button>
        <button className='w-[10%] cursor-pointer hover:bg-green-700 text-white text-2xl h-full flex items-center justify-center bg-green-600'><BiSend /></button>
      </form>


      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/50 flex items-center justify-center transition-all duration-300 z-50 ${open
          ? "opacity-100 visible"
          : "opacity-0 invisible"
          }`}>
        <div
          onClick={(e) => e.stopPropagation()}
          className={`bg-white w-1/3 max-h-2/3 overflow-y-auto rounded-2xl p-5 transition-all duration-300 ${open
            ? "scale-100 translate-y-0"
            : "scale-90 translate-y-10"
            }`}
        >
          <h2 className="text-xl font-bold mb-4">
            Send File
          </h2>

          <div className="space-y-3">
            <form onSubmit={handleSubmit_sendFile(onSubmit_sendFile)} className='w-full my-10 grid grid-cols-1'>
              <div className='col-span-1'>

                <p className='text-lg text-gray-500 mb-2'><span className='text-red-500 font-black'>*</span> Select File</p>

                <input
                  id="file"
                  type="file"
                  className="hidden"
                  {...register_sendFile("file", {
                    required: "File is required",
                    validate: {
                      fileSize: (files) =>
                        files?.[0]?.size <= 10 * 1024 * 1024 || "File size must be less than 10MB",
                    },
                  })}
                />


                <label
                  htmlFor="file" className={`w-full outline-none border ${errors_sendFile.file?.message ? "border-red-500" : "border-gray-200"} text-gray-500 flex items-center p-5 cursor-pointer h-10 rounded-lg`} >
                  <span><BiLink /></span>
                </label>
                {errors_sendFile.file && <p className='text-sm ml-2 flex mt-2 items-center text-red-500'> <FaExclamationCircle className='mr-2' />{errors_sendFile.file?.message}</p>}
              </div>
              <div className='col-span-3'>
                <p className='text-lg text-gray-500 mb-2 mt-5'>Enter Message</p>
                <textarea

                  {...register_sendFile("message", {
                    maxLength: {
                      value: 700,
                      message: "message must not exceed 700 characters",
                    },
                    validate: {
                      noScript: (value) =>
                        !/<script\b[^>]*>([\s\S]*?)<\/script>/gim.test(value) || "Invalid characters detected",
                    },
                  })}
                  className={`w-full h-52 outline-none border ${errors_sendFile.message?.message ? "border-red-500" : "border-gray-200"
                    } p-5 rounded-lg`}
                />

                {errors_sendFile.message && <p className='text-sm ml-2 flex items-center text-red-500'> <FaExclamationCircle className='mr-2' />{errors_sendFile.message?.message}</p>}
              </div>
              <Btn text="Send" />
            </form>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Conversation