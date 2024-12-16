import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import Cookies from 'js-cookie'

interface TimeSlot {
  id?: number
  fromTime: string
  toTime: string
}

const SystemTimeSlots = () => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [newSlot, setNewSlot] = useState<TimeSlot>({
    fromTime: '',
    toTime: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null)

  // Helper function để tạo options cho giờ và phút
  const generateTimeOptions = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));
    return { hours, minutes };
  };

  const { hours, minutes } = generateTimeOptions();

  // Helper để parse time string thành giờ và phút
  const parseTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    return { hours, minutes };
  };

  // Helper để format giờ và phút thành time string
  const formatTime = (hours: string, minutes: string) => {
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    fetchTimeSlots()
  }, [])

  const fetchTimeSlots = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/booking-time`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('access_token')}`
        }
      })
      if (!response.ok) throw new Error('Failed to fetch time slots')
      const data = await response.json()
      if (data) {
        setTimeSlots(data)
      }
    } catch (error) {
      toast.error('Không thể tải danh sách khung giờ', {
        duration: 2000
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const startTime = new Date(`2000/01/01 ${newSlot.fromTime}`)
    const endTime = new Date(`2000/01/01 ${newSlot.toTime}`)
    
    if (endTime <= startTime) {
      toast.error('Giờ kết thúc phải lớn hơn giờ bắt đầu', {
        duration: 2000
      })
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/booking-time`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('access_token')}`
        },
        body: JSON.stringify(newSlot)
      })

      if (!response.ok) throw new Error('Failed to create time slot')
      
      const data = await response.json()
      if (data) {
        toast.success('Thêm khung giờ thành công', {
          duration: 2000
        })
        setTimeSlots([...timeSlots, data])
        setNewSlot({ fromTime: '', toTime: '' })
      }
    } catch (error) {
      toast.error('Không thể thêm khung giờ', {
        duration: 2000
      })
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa khung giờ này?')) return

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/booking-time/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${Cookies.get('access_token')}`
        }
      })

      if (!response.ok) throw new Error('Failed to delete time slot')
      
      toast.success('Xóa khung giờ thành công', {
        duration: 2000
      })
      setTimeSlots(timeSlots.filter(slot => slot.id !== id))
    } catch (error) {
      toast.error('Không thể xóa khung giờ', {
        duration: 2000
      })
    }
  }

  const handleEdit = (slot: TimeSlot) => {
    setEditingSlot(slot)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingSlot) return

    const startTime = new Date(`2000/01/01 ${editingSlot.fromTime}`)
    const endTime = new Date(`2000/01/01 ${editingSlot.toTime}`)
    
    if (endTime <= startTime) {
      toast.error('Giờ kết thúc phải lớn hơn giờ bắt đầu', {
        duration: 2000
      })
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/booking-time/${editingSlot.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('access_token')}`
        },
        body: JSON.stringify(editingSlot)
      })

      if (!response.ok) throw new Error('Failed to update time slot')
      
      const data = await response.json()
      if (data) {
        toast.success('Cập nhật khung giờ thành công', {
          duration: 2000
        })
        setTimeSlots(timeSlots.map(slot => 
          slot.id === editingSlot.id ? data : slot
        ))
        setEditingSlot(null)
      }
    } catch (error) {
      toast.error('Không thể cập nhật khung giờ', {
        duration: 2000
      })
    }
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='bg-white rounded-lg shadow-md p-6'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-xl font-bold text-gray-900'>
            {editingSlot ? 'Chỉnh sửa khung giờ' : 'Quản lý khung giờ hệ thống'}
          </h1>
        </div>

        <form 
          onSubmit={editingSlot ? handleUpdate : handleSubmit} 
          className='mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200'
        >
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Từ giờ
              </label>
              <div className='flex gap-2'>
                <select
                  value={parseTime(editingSlot ? editingSlot.fromTime : newSlot.fromTime).hours}
                  onChange={(e) => {
                    const currentMinutes = parseTime(editingSlot ? editingSlot.fromTime : newSlot.fromTime).minutes;
                    const newTime = formatTime(e.target.value, currentMinutes || '00');
                    if (editingSlot) {
                      setEditingSlot({ ...editingSlot, fromTime: newTime });
                    } else {
                      setNewSlot({ ...newSlot, fromTime: newTime });
                    }
                  }}
                  className='w-1/2 p-2 border rounded focus:ring-purple-500 focus:border-purple-500'
                >
                  <option value="">Giờ</option>
                  {hours.map(hour => (
                    <option key={hour} value={hour}>{hour}</option>
                  ))}
                </select>
                <select
                  value={parseTime(editingSlot ? editingSlot.fromTime : newSlot.fromTime).minutes}
                  onChange={(e) => {
                    const currentHours = parseTime(editingSlot ? editingSlot.fromTime : newSlot.fromTime).hours;
                    const newTime = formatTime(currentHours || '00', e.target.value);
                    if (editingSlot) {
                      setEditingSlot({ ...editingSlot, fromTime: newTime });
                    } else {
                      setNewSlot({ ...newSlot, fromTime: newTime });
                    }
                  }}
                  className='w-1/2 p-2 border rounded focus:ring-purple-500 focus:border-purple-500'
                >
                  <option value="">Phút</option>
                  {minutes.map(minute => (
                    <option key={minute} value={minute}>{minute}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Đến giờ
              </label>
              <div className='flex gap-2'>
                <select
                  value={parseTime(editingSlot ? editingSlot.toTime : newSlot.toTime).hours}
                  onChange={(e) => {
                    const currentMinutes = parseTime(editingSlot ? editingSlot.toTime : newSlot.toTime).minutes;
                    const newTime = formatTime(e.target.value, currentMinutes || '00');
                    if (editingSlot) {
                      setEditingSlot({ ...editingSlot, toTime: newTime });
                    } else {
                      setNewSlot({ ...newSlot, toTime: newTime });
                    }
                  }}
                  className='w-1/2 p-2 border rounded focus:ring-purple-500 focus:border-purple-500'
                >
                  <option value="">Giờ</option>
                  {hours.map(hour => (
                    <option key={hour} value={hour}>{hour}</option>
                  ))}
                </select>
                <select
                  value={parseTime(editingSlot ? editingSlot.toTime : newSlot.toTime).minutes}
                  onChange={(e) => {
                    const currentHours = parseTime(editingSlot ? editingSlot.toTime : newSlot.toTime).hours;
                    const newTime = formatTime(currentHours || '00', e.target.value);
                    if (editingSlot) {
                      setEditingSlot({ ...editingSlot, toTime: newTime });
                    } else {
                      setNewSlot({ ...newSlot, toTime: newTime });
                    }
                  }}
                  className='w-1/2 p-2 border rounded focus:ring-purple-500 focus:border-purple-500'
                >
                  <option value="">Phút</option>
                  {minutes.map(minute => (
                    <option key={minute} value={minute}>{minute}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className='mt-4 flex gap-2'>
            <button
              type='submit'
              className='bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors duration-200'
            >
              {editingSlot ? 'Cập nhật' : 'Thêm khung giờ'}
            </button>
            {editingSlot && (
              <button
                type='button'
                onClick={() => setEditingSlot(null)}
                className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors duration-200'
              >
                Hủy
              </button>
            )}
          </div>
        </form>

        <div className='overflow-x-auto ring-1 ring-gray-200 rounded-lg'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead>
              <tr className='bg-gray-50'>
                <th scope='col' className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Từ giờ
                </th>
                <th scope='col' className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Đến giờ
                </th>
                <th scope='col' className='px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {timeSlots.map((slot, index) => (
                <tr 
                  key={slot.id}
                  className={`hover:bg-gray-50 transition-colors duration-150 ease-in-out
                    ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                    <span className='inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700'>
                      {slot.fromTime}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                    <span className='inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700'>
                      {slot.toTime}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm'>
                    <div className='flex justify-end gap-2'>
                      <button
                        onClick={() => handleEdit(slot)}
                        className='inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 ease-in-out'
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => slot.id && handleDelete(slot.id)}
                        className='inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150 ease-in-out'
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {timeSlots.length === 0 && (
                <tr>
                  <td colSpan={3} className='px-6 py-8 text-center text-sm text-gray-500'>
                    Chưa có khung giờ nào được tạo
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default SystemTimeSlots 