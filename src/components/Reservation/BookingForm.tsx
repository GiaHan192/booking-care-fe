import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { toast } from 'react-hot-toast'
import BookingModal from './BookingModal'

interface BookingTime {
  id: number
  fromTime: string
  toTime: string
  price: number
  booked: boolean
}

interface Doctor {
  id: number
  fullName: string
  introduction: string
  longIntroduction: string
  major: string
  title: string
  image: string
}

interface BookingFormData {
  patientName: string
  phone: string
  email: string
  gender: 'MALE' | 'FEMALE'
  birthDate: string
  address: string
  reason: string
}

const BookingForm = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState('')
  const [bookingTimes, setBookingTimes] = useState<BookingTime[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedTime, setSelectedTime] = useState<BookingTime | null>(null)
  const doctor = location.state?.doctor as Doctor

  // Tạo mảng 7 ngày kể từ ngày hiện tại
  const getNextSevenDays = () => {
    const dates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      dates.push(date.toISOString().split('T')[0])
    }
    return dates
  }

  const fetchBookingTimes = async (date: string) => {
    if (!doctor?.id || !date) return

    try {
      setLoading(true)
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/doctor?doctorId=${doctor.id}&bookingDate=${new Date(
          date
        ).toISOString()}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('access_token')}`
          }
        }
      )
      const data = await response.json()
      setBookingTimes(data.data.bookingTimeInfoDTOS)
    } catch (error) {
      console.error('Error fetching booking times:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!doctor) {
      navigate('/danh-sach-bac-si')
      return
    }
    // Set ngày mặc định là ngày hiện tại
    const today = new Date().toISOString().split('T')[0]
    setSelectedDate(today)
    fetchBookingTimes(today)
  }, [doctor, navigate])

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
    fetchBookingTimes(date)
  }

  const handleBookingConfirm = async (formData: BookingFormData) => {
    if (!selectedTime) return

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('access_token')}`
        },
        body: JSON.stringify({
          doctorId: doctor.id,
          bookingTimeId: selectedTime.id,
          bookingDate: selectedDate,
          patientName: formData.patientName,
          phoneNumber: formData.phone,
          email: formData.email,
          gender: formData.gender,
          address: formData.address,
          reason: formData.reason,
          bookingType: true
        })
      })

      if (response.ok) {
        toast.success('Đặt lịch thành công!')
        setSelectedTime(null)
        fetchBookingTimes(selectedDate)
      } else {
        toast.error('Có lỗi xảy ra khi đặt lịch')
      }
    } catch (error) {
      console.error('Error booking appointment:', error)
      toast.error('Có lỗi xảy ra khi đặt lịch')
    }
  }

  if (!doctor) return null

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        <div className='md:col-span-1'>
          <div className='bg-white rounded-lg shadow-md p-6'>
            <img src={doctor.image} alt={doctor.fullName} className='w-full h-48 object-cover rounded-lg mb-4' />
            <h2 className='text-xl font-bold'>{doctor.fullName}</h2>
            <p className='text-sm text-gray-500 mt-1'>{doctor.title}</p>
            <p className='text-md mt-2'>{doctor.major}</p>
            <p className='mt-4 text-gray-700'>{doctor.introduction}</p>
          </div>
        </div>

        <div className='md:col-span-2'>
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h3 className='text-lg font-semibold mb-4'>Chọn thời gian khám</h3>

            {/* Chọn ngày */}
            <div className='flex flex-wrap gap-2 mb-6'>
              {getNextSevenDays().map((date) => (
                <button
                  key={date}
                  onClick={() => handleDateChange(date)}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    selectedDate === date ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {new Date(date).toLocaleDateString('vi-VN', {
                    weekday: 'short',
                    month: 'numeric',
                    day: 'numeric'
                  })}
                </button>
              ))}
            </div>

            {/* Danh sách giờ khám */}
            {loading ? (
              <div className='flex justify-center py-8'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
              </div>
            ) : (
              <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
                {bookingTimes.map((time) => (
                  <button
                    key={time.id}
                    disabled={time.booked}
                    onClick={() => setSelectedTime(time)}
                    className={`p-4 rounded-lg border transition-all ${
                      time.booked ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:border-blue-500'
                    }`}
                  >
                    <div className='text-sm font-medium'>
                      {time.fromTime} - {time.toTime}
                    </div>
                    <div className='text-xs mt-1 text-gray-500'>{time.price?.toLocaleString('vi-VN')} VNĐ</div>
                    <div className='text-xs mt-1'>{time.booked ? '(Đã đặt)' : '(Còn trống)'}</div>
                  </button>
                ))}
              </div>
            )}

            {/* Add Modal */}
            {selectedTime && (
              <BookingModal
                isOpen={!!selectedTime}
                onClose={() => setSelectedTime(null)}
                bookingTime={selectedTime}
                doctor={doctor}
                onConfirm={handleBookingConfirm}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingForm
