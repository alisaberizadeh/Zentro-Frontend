import { useContext, useEffect, useState } from "react"
import { FaArrowLeft, FaArrowRight, FaRightLong } from "react-icons/fa6"
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";

export default function StoryViewer({ story, onClose }) {
    const { user, token } = useContext(AuthContext)
    const [i, seti] = useState(0)
    const queryClient = useQueryClient()
    const [viewedIds, setViewedIds] = useState(new Set());
    const [open, setopen] = useState(false)
    const { mutate: viewStory } = useMutation({
        mutationFn: (id) =>
            axios.post(`http://127.0.0.1:8000/api/stories/${id}/view`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ['stories'],
            })
            queryClient.invalidateQueries({
                queryKey: ['Allstories', user.id],
            })
        },
    })
    const { data: viewersData, isLoading: isLoadingViewers } = useQuery({
        queryKey: ['viewers', story.stories[i].id],
        queryFn: async () => {
            const res = await axios.get(
                `http://127.0.0.1:8000/api/stories/${story.stories[i].id}/viewers`,
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
        enabled: !!user?.id,
        staleTime: 30000

    })

    useEffect(() => {
        if (!story?.stories?.[i]) return;

        const currentId = story.stories[i].id;
        if (!viewedIds.has(currentId) && !story.stories[i].viewed) {
            viewStory(currentId);
            setViewedIds(prev => new Set(prev).add(currentId));
        }

    }, [i, story]);

    return (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">

            <button
                onClick={onClose}
                className="absolute z-40 top-2 right-5 text-black font-bold text-2xl cursor-pointer"
            >
                ✕
            </button>

            <div className="w-full lg:w-1/4 m-auto h-screen relative">
                <div className="w-full flex items-center absolute left-0 top-0 py-2 px-5 bg-[#0000007d] justify-between">
                    <Link to={story.user.id !== user.id ? `/user/${story.user.id}` : "/profile"} className="flex items-center">
                        <img loading='lazy' src={import.meta.env.VITE_AVATAR_IMAGE_BASE_URL + story.user.profile_photo} className='w-10 h-10  object-cover border border-gray-200 rounded-full' alt={story.user.username} />
                        <p className='text-md text-white tracking-wide font-bold ml-2'>
                            {story.user.username}
                            <p className="text-gray-500 text-xs">
                                {new Date(story.stories[i].created_at).toLocaleString("en-US", {
                                    year: "numeric",
                                    day: "numeric",
                                    month: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                })}
                            </p>
                        </p>
                    </Link>
              


                </div>
                {i < story.stories.length - 1 && (
                    <div
                        onClick={() => seti(i + 1)}
                        className="text-white text-xl  absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer bg-[#0000007d] p-5 rounded-full"
                    >
                        <FaArrowRight />
                    </div>
                )}

                {i > 0 && (
                    <div
                        onClick={() => seti(i - 1)}
                        className="text-white text-xl absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer bg-[#0000007d] p-5 rounded-full"
                    >
                        <FaArrowLeft />
                    </div>
                )}
                {/* show likes */}
                <div
                    onClick={() => setopen(false)}
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
                            Views ({viewersData?.length})
                        </h2>

                        <div className="space-y-3">
                            {viewersData?.length > 0 ? viewersData?.map((item, index) => (
                                <div key={index} className='flex items-center justify-between m-0 p-3 border-t border-gray-200'>
                                    <Link target="_blank" to={item.user.id != user.id ? `/user/${item.user.id}` : "/profile"} className='flex items-center'>
                                        <img loading='lazy' src={import.meta.env.VITE_AVATAR_IMAGE_BASE_URL + item.user.profile_photo} className='w-12 h-12  object-cover mr-3 rounded-full' alt={item.user.username} />
                                        {item.user.username}
                                    </Link>
                                </div>
                            )) : (
                                <h1>The number of views is 0 , currently.</h1>
                            )}
                        </div>
                    </div>
                </div>

                {story.user_id === user.id && (
                    <div onClick={() => setopen(true)} className=" rounded-lg absolute left-10 py-2 px-5 bottom-5 flex items-center cursor-pointer">
                        {viewersData?.slice(0, 3).map((item, index) => (
                            <img loading='lazy' key={index} src={import.meta.env.VITE_AVATAR_IMAGE_BASE_URL + item.user.profile_photo} className="w-10 h-10  object-cover -ml-5 rounded-full" alt={item.user.username} />

                        ))}
                        <span className="text-white ml-2 font-bold">{viewersData?.length} View</span>

                    </div>
                )}



                <img loading='lazy' src={import.meta.env.VITE_STORY_IMAGE_BASE_URL + story.stories[i].image} className="w-full h-full object-cover" alt={story.user.username} />

            </div>
        </div>
    )
}
