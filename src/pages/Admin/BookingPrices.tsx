import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import Cookies from 'js-cookie'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import * as Dialog from '@radix-ui/react-dialog'
import { IoClose } from 'react-icons/io5'

interface BookingPrice {
  id: number
  price: number
  doctor: {
    id: number
    fullName: string
    title: string
    image: string
  }
  bookingTime: {
    id: number
    fromTime: string
    toTime: string
    price: number | null
    booked: boolean
  }
}

interface GroupedBookings {
  [doctorId: number]: {
    doctor: BookingPrice['doctor']
    bookings: BookingPrice[]
  }
}

interface AddPriceFormState {
  doctorId: number
  price: number
  bookingTimeId: number
}

interface BookingTime {
  id: number
  fromTime: string
  toTime: string
}

interface Doctor {
  id: number
  fullName: string
  title: string
  image: string
  introduction: string
  major: string
}

export default function BookingPrices() {
  const [loading, setLoading] = useState(true)
  const [groupedBookings, setGroupedBookings] = useState<GroupedBookings>({})
  const [expandedDoctors, setExpandedDoctors] = useState<number[]>([])
  const [addPriceForm, setAddPriceForm] = useState<AddPriceFormState>({
    doctorId: 0,
    price: 0,
    bookingTimeId: 0
  })
  const [bookingTimes, setBookingTimes] = useState<BookingTime[]>([])
  const [editingPrice, setEditingPrice] = useState<BookingPrice | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [doctors, setDoctors] = useState<Doctor[]>([])

  const fetchDoctorPrices = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/booking-price`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('access_token')}`
        }
      })

      if (!response.ok) throw new Error('Failed to fetch prices')

      const data: BookingPrice[] = await response.json()

      const grouped = data.reduce((acc, booking) => {
        const doctorId = booking.doctor.id
        if (!acc[doctorId]) {
          acc[doctorId] = {
            doctor: booking.doctor,
            bookings: []
          }
        }
        acc[doctorId].bookings.push(booking)
        return acc
      }, {} as GroupedBookings)

      setGroupedBookings(grouped)
    } catch (error) {
      console.error('Error fetching prices:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBookingTimes = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/booking-time`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('access_token')}`
        }
      })
      if (!response.ok) throw new Error('Failed to fetch booking times')
      const data = await response.json()
      setBookingTimes(data)
    } catch (error) {
      console.error('Error fetching booking times:', error)
    }
  }

  const fetchDoctors = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/doctors`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('access_token')}`
        }
      })
      if (!response.ok) throw new Error('Failed to fetch doctors')
      const data = await response.json()
      setDoctors(data.data.items)
    } catch (error) {
      console.error('Error fetching doctors:', error)
    }
  }

  const toggleDoctor = (doctorId: number) => {
    setExpandedDoctors((prev) => (prev.includes(doctorId) ? prev.filter((id) => id !== doctorId) : [...prev, doctorId]))
  }

  const handleSubmitPrice = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/booking-price`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('access_token')}`
        },
        body: JSON.stringify({
          doctorId: addPriceForm.doctorId,
          price: addPriceForm.price,
          bookingTimeId: addPriceForm.bookingTimeId
        })
      })

      if (!response.ok) throw new Error('Failed to add price')

      toast.success('Thêm giá khám thành công')
      setAddPriceForm({ doctorId: 0, price: 0, bookingTimeId: 0 })
      fetchDoctorPrices()
    } catch (error) {
      toast.error('Thêm giá khám thất bại')
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePrice = async (priceId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa giá khám này?')) return

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/booking-price/${priceId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${Cookies.get('access_token')}`
        }
      })

      if (!response.ok) throw new Error('Failed to delete price')

      toast.success('Xóa giá khám thành công')
      fetchDoctorPrices()
    } catch (error) {
      toast.error('Xóa giá khám thất bại')
    }
  }

  const handleUpdatePrice = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPrice) return

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/booking-price/${editingPrice.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('access_token')}`
        },
        body: JSON.stringify({
          doctorId: editingPrice.doctor.id,
          bookingTimeId: editingPrice.bookingTime.id,
          price: addPriceForm.price
        })
      })

      if (!response.ok) throw new Error('Failed to update price')

      toast.success('Cập nhật giá khám thành công')
      setEditingPrice(null)
      setAddPriceForm({ doctorId: 0, price: 0, bookingTimeId: 0 })
      fetchDoctorPrices()
    } catch (error) {
      toast.error('Cập nhật giá khám thất bại')
    }
  }

  useEffect(() => {
    fetchDoctorPrices()
    fetchBookingTimes()
    fetchDoctors()
  }, [])

  if (loading)
    return (
      <div className='flex justify-center py-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
      </div>
    )

  return (
    <div className='p-6'>
      <div className='sm:flex sm:items-center sm:justify-between mb-6'>
        <h1 className='text-2xl font-semibold text-gray-900'>Quản lý giá khám</h1>
        <div className='mt-4 sm:mt-0 flex items-center gap-4'>
          <button
            onClick={() => {
              setIsModalOpen(true)
              setAddPriceForm({ doctorId: 0, price: 0, bookingTimeId: 0 })
            }}
            className='inline-flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200'
          >
            <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 4v16m8-8H4' />
            </svg>
            Thêm giá khám
          </button>
          <span className='rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-800'>
            Tổng: {Object.keys(groupedBookings).length} bác sĩ
          </span>
        </div>
      </div>

      <div className='mt-4 flex flex-col'>
        <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
            {Object.values(groupedBookings).map(({ doctor, bookings }) => (
              <div key={doctor.id} className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg mb-6'>
                <div
                  className='bg-white px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50'
                  onClick={() => toggleDoctor(doctor.id)}
                >
                  <div className='flex items-center'>
                    <img src={doctor.image} alt={doctor.fullName} className='h-10 w-10 rounded-full object-cover' />
                    <div className='ml-4'>
                      <div className='text-sm font-medium text-gray-900'>{doctor.fullName}</div>
                    </div>
                  </div>
                  <span className='text-gray-500'>{expandedDoctors.includes(doctor.id) ? '▼' : '▶'}</span>
                </div>

                {expandedDoctors.includes(doctor.id) && (
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          Thời gian
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          Giá tiền
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {bookings.map((booking: BookingPrice) => (
                        <tr key={booking.id} className='hover:bg-gray-50'>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                            {booking.bookingTime.fromTime} - {booking.bookingTime.toTime}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                            {booking.price?.toLocaleString('vi-VN')} VNĐ
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                            <button
                              onClick={() => {
                                setEditingPrice(booking)
                                setAddPriceForm((prev) => ({
                                  ...prev,
                                  price: booking.price,
                                  bookingTimeId: booking.bookingTime.id
                                }))
                              }}
                              className='text-indigo-600 hover:text-indigo-900 mr-4'
                            >
                              Sửa
                            </button>
                            <button
                              onClick={() => handleDeletePrice(booking.id)}
                              className='text-red-600 hover:text-red-900'
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog.Root
        open={isModalOpen || editingPrice !== null}
        onOpenChange={(open) => {
          setIsModalOpen(open)
          if (!open) {
            setAddPriceForm({ doctorId: 0, price: 0, bookingTimeId: 0 })
            setEditingPrice(null)
          }
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 bg-black/30' />
          <Dialog.Content className='fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg p-6 w-[90vw] max-w-lg max-h-[85vh] overflow-y-auto'>
            <Dialog.Title className='text-xl font-bold mb-4'>
              {editingPrice ? 'Cập nhật giá khám' : 'Thêm giá khám mới'}
            </Dialog.Title>
            <Dialog.Close className='absolute top-4 right-4 text-gray-400 hover:text-gray-500'>
              <IoClose size={24} />
            </Dialog.Close>

            <form onSubmit={editingPrice ? handleUpdatePrice : handleSubmitPrice} className='space-y-4'>
              {!editingPrice && (
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Chọn bác sĩ</label>
                  <select
                    value={addPriceForm.doctorId}
                    onChange={(e) => setAddPriceForm((prev) => ({ ...prev, doctorId: parseInt(e.target.value) }))}
                    className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 sm:text-sm'
                    required
                  >
                    <option value=''>Chọn bác sĩ</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.title} {doctor.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Khung giờ</label>
                {editingPrice ? (
                  <div className='text-gray-900'>
                    {editingPrice.bookingTime.fromTime} - {editingPrice.bookingTime.toTime}
                  </div>
                ) : (
                  <select
                    value={addPriceForm.bookingTimeId}
                    onChange={(e) => setAddPriceForm((prev) => ({ ...prev, bookingTimeId: parseInt(e.target.value) }))}
                    className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 sm:text-sm'
                    required
                  >
                    <option value=''>Chọn khung giờ</option>
                    {bookingTimes.map((time) => (
                      <option key={time.id} value={time.id}>
                        {time.fromTime.slice(0, 5)} - {time.toTime.slice(0, 5)}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Giá khám (VNĐ)</label>
                <input
                  type='number'
                  value={addPriceForm.price}
                  onChange={(e) => setAddPriceForm((prev) => ({ ...prev, price: parseFloat(e.target.value) }))}
                  className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 sm:text-sm'
                  required
                />
              </div>

              <div className='mt-4 flex justify-end'>
                <button
                  type='submit'
                  className='px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700'
                >
                  {editingPrice ? 'Cập nhật' : 'Thêm giá khám'}
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
