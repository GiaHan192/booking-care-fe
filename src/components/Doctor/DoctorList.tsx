import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaCalendarPlus } from 'react-icons/fa'

interface Doctor {
  id: number
  fullName: string
  introduction: string
  major: string
  title: string
  image: string
}

interface PaginationParams {
  page: number
  size: number
  totalPages: number
  totalItems: number
}

export default function DoctorList() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 0,
    size: 6,
    totalPages: 0,
    totalItems: 0
  })

  // Determine if the current path is for booking
  const isBookingPage = location.pathname === '/kham-than-kinh'

  const fetchDoctors = async (page: number = 0) => {
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/doctors?page=${page}&size=${pagination.size}`)
      if (!response.ok) throw new Error('Failed to fetch doctors')
      const data = await response.json()
      setDoctors(data.data.items)
      setPagination({
        ...pagination,
        page: data.data.currentPage,
        totalPages: data.data.totalPages,
        totalItems: data.data.totalItems
      })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDoctors()
  }, [])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchDoctors(newPage)
    }
  }

  const handleBooking = (doctor: Doctor) => {
    navigate('/thong-tin-dat-lich', {
      state: { doctor }
    })
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold text-gray-900 mb-8'>
        {isBookingPage ? 'Đặt lịch hẹn bác sĩ' : 'Danh sách bác sĩ'}
      </h1>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'
          >
            <Link to={`/doctor/${doctor.id}`}>
              <div className='aspect-w-16 aspect-h-9'>
                <img src={doctor.image} alt={doctor.fullName} className='w-full h-48 object-cover' />
              </div>
              <div className='p-6'>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                  {doctor.title} {doctor.fullName}
                </h3>
                <p className='text-indigo-600 font-medium mb-3'>{doctor.major}</p>
                <p className='text-gray-600 mb-4 line-clamp-2'>{doctor.introduction}</p>
              </div>
            </Link>

            <div className='px-6 pb-6'>
              <div className='flex gap-3'>
                <Link
                  to={`/doctor/${doctor.id}`}
                  className={`px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-center ${
                    isBookingPage ? 'flex-1' : 'w-full'
                  }`}
                >
                  Xem chi tiết
                </Link>
                {isBookingPage && (
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleBooking(doctor)
                    }}
                    className='flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2'
                  >
                    <FaCalendarPlus className='w-4 h-4' />
                    Đặt lịch
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className='mt-8 flex justify-center'>
        <nav className='flex items-center gap-2'>
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 0}
            className='px-3 py-1 rounded border border-gray-300 disabled:opacity-50'
          >
            Trước
          </button>

          {[...Array(pagination.totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index)}
              className={`px-3 py-1 rounded ${
                pagination.page === index ? 'bg-indigo-600 text-white' : 'border border-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages - 1}
            className='px-3 py-1 rounded border border-gray-300 disabled:opacity-50'
          >
            Sau
          </button>
        </nav>
      </div>
    </div>
  )
}
