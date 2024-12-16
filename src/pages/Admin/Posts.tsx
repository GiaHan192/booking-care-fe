import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

interface Post {
  id?: number
  title: string
  brief: string
  content: string
  thumbnail: string
  isVisible: boolean
  readNumber: number
  createdDate: string
  postcol?: string
}

interface PaginationParams {
  page: number
  size: number
  totalPages: number
  totalItems: number
}

// Thêm hàm format date
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 0,
    size: 10,
    totalPages: 0,
    totalItems: 0
  })
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async (page: number = 0) => {
    try {
      setIsLoading(true)
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts?page=${page}&size=${pagination.size}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('access_token')}`
          }
        }
      )
      if (!response.ok) throw new Error('Failed to fetch posts')
      const data = await response.json()
      setPosts(data.data.items)
      setPagination({
        ...pagination,
        page: data.data.currentPage,
        totalPages: data.data.totalPages,
        totalItems: data.data.totalItems
      })
    } catch (error) {
      toast.error('Không thể tải danh sách bài viết')
      setPosts([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa bài viết này?')) return

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${Cookies.get('access_token')}`
        }
      })

      if (!response.ok) throw new Error('Failed to delete post')
      
      toast.success('Xóa bài viết thành công')
      setPosts(posts.filter(post => post.id !== id))
    } catch (error) {
      toast.error('Không thể xóa bài viết')
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchPosts(newPage)
    }
  }

  const handleCreatePost = () => {
    navigate('/admin/posts/create');
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='bg-white rounded-lg shadow-md p-6'>
        <div className="sm:flex sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Quản lý bài viết</h1>
          <div className="mt-4 sm:mt-0 flex items-center gap-4">
            <button
              onClick={handleCreatePost}
              className="inline-flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Thêm bài viết
            </button>
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-800">
              Tổng: {pagination.totalItems} bài viết
            </span>
          </div>
        </div>

        {/* Danh sách bài viết */}
        <div className='mt-6 overflow-x-auto'>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3'>
                    Tiêu đề
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3'>
                    Tóm tắt
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4'>
                    Ngày tạo
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {posts.map(post => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className='px-6 py-4 text-sm text-gray-900'>
                      <div className="line-clamp-2">{post.title}</div>
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-900'>
                      <div className="line-clamp-2">{post.brief}</div>
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-900'>
                      {formatDateTime(post.createdDate)}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-900'>
                      <div className="flex items-center gap-3">
                        <Link 
                          to={`/admin/posts/${post.id}/edit`} 
                          className='text-blue-500 hover:text-blue-700 transition-colors'
                        >
                          <FaEdit size={18} />
                        </Link>
                        <button 
                          onClick={() => post.id && handleDelete(post.id)} 
                          className='text-red-500 hover:text-red-700 transition-colors'
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {posts.length > 0 && (
          <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 0}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Trước
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages - 1}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Sau
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị <span className="font-medium">{pagination.page * pagination.size + 1}</span> đến{' '}
                  <span className="font-medium">
                    {Math.min((pagination.page + 1) * pagination.size, pagination.totalItems)}
                  </span>{' '}
                  trong tổng số{' '}
                  <span className="font-medium">{pagination.totalItems}</span> kết quả
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 0}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {[...Array(pagination.totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageChange(index)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        pagination.page === index
                          ? 'z-10 bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                          : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages - 1}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}