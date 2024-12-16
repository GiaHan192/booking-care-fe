import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { toast } from 'react-hot-toast'
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { vi } from 'date-fns/locale';

interface Doctor {
  id: number
  fullName: string
  introduction: string
  longIntroduction: string
  major: string
  title: string
  image: string
}

interface BookingTimeInfo {
  id: number;
  fromTime: string;
  toTime: string;
  price: number;
  booked: boolean;
}

interface BookingResponse {
  doctorId: number;
  bookingDate: string;
  bookingTimeInfoDTOS: BookingTimeInfo[];
}

interface DayBookings {
  date: Date;
  bookings: BookingTimeInfo[];
}

const DoctorDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  const [bookings, setBookings] = useState<BookingTimeInfo[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    fetchDoctorDetails()
  }, [id])

  useEffect(() => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 }); // Start from Monday
    const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
    setWeekDays(days);
    setSelectedDate(today);
  }, []);

  const fetchDoctorDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/doctors/${id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('access_token')}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch doctor details')
      }

      const data = await response.json()
      if (data.status === "OK") {
        setDoctor(data.data)
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Có lỗi xảy ra khi tải thông tin bác sĩ')
    } finally {
      setLoading(false)
    }
  }

  const fetchBookings = async (date: Date) => {
    try {
      setLoadingBookings(true);
      const utcDate = new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        0, 0, 0, 0
      ));
      const formattedDate = utcDate.toISOString();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/doctor?doctorId=${id}&bookingDate=${formattedDate}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('access_token')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      if (data.status === "OK") {
        const bookedTimes = data.data.bookingTimeInfoDTOS.filter((time: BookingTimeInfo) => time.booked);
        setBookings(bookedTimes);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Có lỗi xảy ra khi tải lịch hẹn');
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchBookings(selectedDate);
    }
  }, [selectedDate]);

  const handleEdit = () => {
    navigate(`/admin/doctors/edit/${id}`)
  }

  const handleBack = () => {
    navigate('/admin/doctors')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold mb-4">Không tìm thấy thông tin bác sĩ</h2>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          Quay lại
        </button>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='bg-white rounded-lg shadow-md'>
        <div className='p-6'>
          {/* Header */}
          <div className='flex justify-between items-center mb-6'>
            <h1 className='text-2xl font-semibold text-gray-900'>Chi tiết bác sĩ</h1>
            <div className='space-x-4'>
              <button onClick={handleBack} className='px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200'>
                Quay lại
              </button>
              <button
                onClick={handleEdit}
                className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700'
              >
                Chỉnh sửa
              </button>
            </div>
          </div>

          {/* Doctor Information */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {/* Left Column - Image */}
            <div className='flex justify-center'>
              <div className='w-80 h-80 max-w-md'>
                <img
                  src={doctor.image || '/default-doctor.png'}
                  alt={doctor.fullName}
                  className='w-full h-full rounded-full object-cover'
                />
              </div>
            </div>

            {/* Right Column - Details */}
            <div className='space-y-6'>
              <div>
                <h2 className='text-xl font-semibold text-gray-900 mb-4'>Thông tin cá nhân</h2>
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-500'>Họ và tên</label>
                    <p className='mt-1 text-lg text-gray-900'>{doctor.fullName}</p>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-500'>Chức danh</label>
                    <p className='mt-1 text-lg text-gray-900'>{doctor.title}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className='text-xl font-semibold text-gray-900 mb-4'>Giới thiệu ngắn</h2>
                <div className='bg-gray-100 p-4 rounded-lg'>
                  <p className='text-gray-700'>{doctor.introduction}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Long Introduction Section - Full Width */}
          <div className='mt-8'>
            <h2 className='text-xl font-semibold text-gray-900 mb-4'>Giới thiệu chi tiết</h2>
            <div className='bg-gray-100 p-6 rounded-lg prose max-w-none'>
              <div
                dangerouslySetInnerHTML={{ __html: doctor.longIntroduction }}
                className='text-gray-700 [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-4 
                  [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:mb-3
                  [&>h3]:text-lg [&>h3]:font-medium [&>h3]:mb-2
                  [&>p]:mb-4 [&>ul]:list-disc [&>ul]:ml-5 [&>ul]:mb-4
                  [&>ol]:list-decimal [&>ol]:ml-5 [&>ol]:mb-4
                  [&>li]:mb-2 [&>strong]:font-semibold
                  [&>a]:text-blue-600 [&>a]:underline [&>a:hover]:text-blue-800'
              />
            </div>
          </div>

          {/* Appointments Section */}
          <div className='mt-8'>
            <h2 className='text-xl font-semibold text-gray-900 mb-4'>Lịch hẹn trong tuần</h2>
            
            {/* Week Day Buttons */}
            <div className='flex gap-2 mb-4 overflow-x-auto pb-2'>
              {weekDays.map((day) => (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`px-4 py-2 rounded-md whitespace-nowrap ${
                    isSameDay(selectedDate, day)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {format(day, 'EEEE, dd/MM', { locale: vi })}
                </button>
              ))}
            </div>

            {/* Bookings List */}
            <div className='bg-gray-100 rounded-lg p-4'>
              {loadingBookings ? (
                <div className='flex justify-center py-8'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
                </div>
              ) : bookings.length > 0 ? (
                <div className='space-y-4'>
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className='bg-white p-4 rounded-md shadow-sm'
                    >
                      <div className='flex justify-between items-center'>
                        <div>
                          <p className='font-medium'>
                            {booking.fromTime} - {booking.toTime}
                          </p>
                          <p className='text-sm text-gray-500'>
                            Giá: {booking.price.toLocaleString('vi-VN')} VNĐ
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-center py-8 text-gray-500'>
                  Không có lịch hẹn nào trong ngày này
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDetails 