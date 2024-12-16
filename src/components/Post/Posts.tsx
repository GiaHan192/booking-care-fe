import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { IPostItem } from 'src/models/post'
import { PostResponse } from 'src/models/api-response'
import axios from 'axios'

interface PaginationParams {
  page: number
  size: number
  totalPages: number
  totalItems: number
}

export default function Posts() {
  const [posts, setPosts] = useState<IPostItem[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 0,
    size: 6, // Hiển thị 6 bài viết mỗi trang
    totalPages: 0,
    totalItems: 0
  })

  const fetchPosts = async (page: number = 0) => {
    try {
      setLoading(true)
      const response: { data: PostResponse } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/posts?page=${page}&size=${pagination.size}`
      )
      setPosts(response.data.data.items)
      setPagination({
        ...pagination,
        page: response.data.data.currentPage,
        totalPages: response.data.data.totalPages,
        totalItems: response.data.data.totalItems
      })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchPosts(newPage)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Cẩm nang sức khỏe</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/post/detail/${post.id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-gray-600 line-clamp-3">{post.shortDescription}</p>
              <div className="mt-4 text-sm text-gray-500">
                {new Date(post.createdDate).toLocaleDateString('vi-VN')}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <nav className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 0}
            className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
          >
            Trước
          </button>
          
          {[...Array(pagination.totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index)}
              className={`px-3 py-1 rounded ${
                pagination.page === index
                  ? 'bg-indigo-600 text-white'
                  : 'border border-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages - 1}
            className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
          >
            Sau
          </button>
        </nav>
      </div>
    </div>
  )
}