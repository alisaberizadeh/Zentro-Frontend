import { useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import StoryViewer from "./StoryViewer"

export default function Story({ data }) {
  const [activeStory, setActiveStory] = useState(null)
  return (
    <>
      <div className="border border-gray-200 py-3 rounded-2xl mb-5">
        <Swiper
          spaceBetween={12}
          grabCursor={true}
          breakpoints={{
            320: {
              slidesPerView: 4,
            },
            640: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 5,
            },
          }}
        >
          {data?.map((story) => (
            <SwiperSlide key={story.id}>
              <div className="text-center   cursor-pointer" onClick={() => setActiveStory(story)} >
                <div className="lg:w-20 w-16 aspect-square m-auto rounded-full">
                  <img loading='lazy'
                    src={import.meta.env.VITE_AVATAR_IMAGE_BASE_URL + story.user.profile_photo}
                    className={`w-full h-full object-cover rounded-full p-1 border-4 ${story?.stories?.length > 0
                      ? story.stories.every(s => s.viewed)
                        ? "border-gray-300"
                        : "border-red-600"
                      : "border-gray-200"
                      }`}
                    alt=""
                  />

                </div>
                <p className="text-sm mt-2 font-medium tracking-wide overflow-hidden">{story.user.username}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {activeStory && (
        <StoryViewer
          story={activeStory}
          onClose={() => setActiveStory(null)}
        />
      )}
    </>
  )
}
