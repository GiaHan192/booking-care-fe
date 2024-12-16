import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface Doctor {
  id: number
  fullName: string
  introduction: string
  major: string
  title: string
  image: string
}

export default function HomeDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)

  const fetchDoctors = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/doctors?page=0&size=4`)
      if (!response.ok) throw new Error('Failed to fetch doctors')
      const data = await response.json()
      setDoctors(data.data.items)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDoctors()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="mt-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Đội ngũ bác sĩ</h2>
        <Link 
          to="/danh-sach-bac-si"
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Xem tất cả →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {doctors.map((doctor) => (
          <Link 
            key={doctor.id} 
            to={`/danh-sach-bac-si/${doctor.id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="aspect-w-3 aspect-h-2">
              <img
                src={doctor.image}
                alt={doctor.fullName}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-900 mb-1">
                {doctor.title} {doctor.fullName}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {doctor.major}
              </p>
              <p className="text-sm text-gray-500 line-clamp-2">
                {doctor.introduction}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 