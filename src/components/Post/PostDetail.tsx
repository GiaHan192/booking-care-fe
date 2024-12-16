import React, { useState, useEffect } from 'react'
import { IPostItem } from 'src/models/post'
import { PostResponse } from 'src/models/api-response'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import bannerImg from '../../assets/images/banner.jpg'
import HomePost from './HomePost'

const PostDetail: React.FunctionComponent = () => {
  const location = useLocation()
  const articleId = location.pathname.split('/').pop()
  const [post, setPost] = useState<IPostItem>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response: { data: PostResponse } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/posts/${articleId}`
        )
        setPost(response.data.data)
        setLoading(false)
      } catch (error) {
        setError('Không thể tải thông tin bài viết')
        setLoading(false)
      }
    }

    fetchPost()
  }, [articleId])

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
      </div>
    )
  }

  if (error) {
    return <div className='text-center py-8 text-red-600'>{error}</div>
  }

  return (
    <div>
      {/* Banner Section */}
      <div className='w-full'>
        <div className='container mx-auto px-4 py-8'>
          <div className='relative h-[400px] rounded-2xl overflow-hidden'>
            <img 
              className='absolute inset-0 w-full h-full object-cover rounded-2xl' 
              src={post?.thumbnail} 
              alt={post?.title} 
            />
            <div className='absolute inset-0 bg-black opacity-30 rounded-2xl'></div>
            <div className='relative z-10 h-full flex flex-col items-center justify-center text-center px-4'>
              <h1 className='text-4xl font-bold text-white mb-4'>{post?.title}</h1>
              <p className='text-lg text-white opacity-90'>
                {new Date(post?.createdDate || '').toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-4 py-8'>
        {/* Main Content */}
        <div className='bg-white rounded-lg shadow-md overflow-hidden mb-12'>
          <div className='p-6'>
            <article
              dangerouslySetInnerHTML={{
                __html: post?.content || ''
              }}
              className='prose max-w-none
                                [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-4 
                                [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:mb-3 
                                [&>h3]:text-xl [&>h3]:font-medium [&>h3]:mb-2
                                [&>p]:text-base [&>p]:leading-relaxed [&>p]:mb-4 
                                [&>ul]:list-disc [&>ul]:ml-5 [&>ul]:mb-4 
                                [&>ol]:list-decimal [&>ol]:ml-5 [&>ol]:mb-4
                                [&>li]:mb-2 
                                [&>img]:max-w-full [&>img]:h-auto [&>img]:rounded-lg [&>img]:my-6
                                [&>a]:text-blue-600 [&>a]:underline [&>a:hover]:text-blue-800'
            />
          </div>
        </div>

        {/* Related Posts */}
        <div className='mt-12'>
          {/* <h2 className='text-2xl font-bold mb-6'>Cẩm nang liên quan</h2> */}
          <HomePost />
        </div>
      </div>
    </div>
  )
}

export default PostDetail
