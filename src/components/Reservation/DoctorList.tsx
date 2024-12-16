import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Dialog from '@radix-ui/react-dialog'
import Cookies from 'js-cookie'

interface Doctor {
  id: number
  fullName: string
  introduction: string
  major: string
  title: string
  image: string
}

const DoctorCard: React.FC<{ doctor: Doctor }> = ({ doctor }) => {
  const navigate = useNavigate()

  // Hàm xử lý khi nhấn vào nút "Đặt lịch tư vấn"
  const handleBooking = () => {
    // kiểm tra đăng nhập
    if (!Cookies.get('access_token')) {
      alert('Vui lòng đăng nhập trước khi đặt lịch')
      return
    }
    // Chuyển hướng sang trang "/thong-tin-dat-lich" với thông tin của bác sĩ
    navigate('/thong-tin-dat-lich', { state: { doctor } })
  }

  return (
    <div className='border p-4 rounded-lg shadow-md'>
      <img src={doctor.image} alt={doctor.fullName} className='w-full h-48 object-cover rounded-lg' />
      <h2 className='text-xl font-bold mt-4'>{doctor.fullName}</h2>
      <p className='text-sm text-gray-500'>{doctor.title}</p>
      <p className='text-md mt-2'>{doctor.major}</p>
      <p className='text-gray-700 mt-2'>{doctor.introduction}</p>
      <p className='text-lg mt-2'>Giá: Tuỳ theo từng trường hợp</p>
      <button
        onClick={handleBooking}
        className='mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-all'
      >
        Đặt lịch tư vấn
      </button>
    </div>
  )
}

const DoctorList: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([])

  // const listDoctorsApi = {
  //   status: 'OK',
  //   data: {
  //     totalPages: 1,
  //     totalItems: 2,
  //     currentPage: 0,
  //     first: true,
  //     last: true,
  //     pageItemSize: 2,
  //     pageSize: 20,
  //     items: [
  //       {
  //         id: 2,
  //         fullName: 'John Doe',
  //         introduction: 'Bác sĩ đa khoa giàu kinh nghiệm.',
  //         major: 'Y học tổng hợp',
  //         title: 'MD',
  //         image: 'doctor1.jpg'
  //       },
  //       {
  //         id: 3,
  //         fullName: 'Jane Smith',
  //         introduction: 'Bác sĩ chuyên khoa răng trẻ em.',
  //         major: 'Răng hàm mặt trẻ em',
  //         title: 'DDS',
  //         image: 'doctor2.jpg'
  //       }
  //     ]
  //   }
  // }

  useEffect(() => {
    // Gọi API lấy danh sách bác sĩ
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/doctors')
        // const response = listDoctorsApi
        const data = await response.json()
        // setDoctors(response.data.items)
        setDoctors(data.data.items)
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu bác sĩ:', error)
      }
    }

    fetchDoctors()
  }, [])

  return (
    <div className='max-w-6xl mx-auto py-8'>
      <h1 className='text-3xl font-bold text-center mb-8'>Danh sách bác sĩ</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </div>
  )
}

export default DoctorList
