import { useForm } from "react-hook-form"
import { FaExclamationCircle } from "react-icons/fa"

function CommentForm({ postId, onSubmitComment, isSending }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const submitHandler = (data) => {
    onSubmitComment(data, postId)
    reset()
  }

  return (
    <div className='w-full px-5 my-5'>
      <form
        onSubmit={handleSubmit(submitHandler)}
        className={`w-full bg-white overflow-hidden h-12 flex items-center ${
          errors.text ? "border-red-500" : "border-gray-200"
        } justify-between rounded-md border`}
      >
        <input
          type="text"
          {...register("text", { required: "Please enter a comment." })}
          className="w-10/12 outline-none h-full px-5 text-sm"
          placeholder="What is your opinion ?"
        />

        <button
          type="submit"
          disabled={isSending}
          className="w-2/12 bg-green-100 text-green-600 h-full cursor-pointer text-sm hover:bg-green-200 disabled:opacity-50"
        >
          Send
        </button>
      </form>

      {errors.text && (
        <p className="text-sm mt-2 flex items-center text-red-500">
          <FaExclamationCircle className="mr-2" />
          {errors.text.message}
        </p>
      )}
    </div>
  )
}

export default CommentForm
