import React, { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { IoClose } from 'react-icons/io5'
import { toast } from 'react-hot-toast'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  bookingTime: {
    id: number
    fromTime: string
    toTime: string
    price: number
  }
  doctor: {
    id: number
    fullName: string
    title: string
  }
  onConfirm: (formData: BookingFormData) => Promise<void>
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

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  bookingTime,
  doctor,
  onConfirm
}) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<BookingFormData>({
    patientName: '',
    phone: '',
    email: '',
    gender: 'MALE',
    birthDate: '',
    address: '',
    reason: ''
  })

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g
    return phoneRegex.test(phone)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Chỉ cho phép nhập số
    if (value && !/^[0-9]+$/.test(value)) {
      return
    }
    setFormData({ ...formData, phone: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate phone number
    if (!validatePhoneNumber(formData.phone)) {
      toast.error('Số điện thoại không hợp lệ')
      return
    }

    setLoading(true)
    try {
      await onConfirm(formData)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg p-6 w-[90vw] max-w-lg max-h-[85vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-bold">
              Đặt lịch khám
            </Dialog.Title>
            <Dialog.Close className="text-gray-400 hover:text-gray-500">
              <IoClose size={24} />
            </Dialog.Close>
          </div>

          <div className="mb-4">
            <h3 className="font-medium">Thông tin lịch khám:</h3>
            <p className="text-sm text-gray-600">Bác sĩ: {doctor.title} {doctor.fullName}</p>
            <p className="text-sm text-gray-600">Thời gian: {bookingTime.fromTime} - {bookingTime.toTime}</p>
            <p className="text-sm text-gray-600">Giá khám: {bookingTime.price?.toLocaleString('vi-VN')} VNĐ</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Họ và tên bệnh nhân
              </label>
              <input
                type="text"
                required
                value={formData.patientName}
                onChange={e => setFormData({...formData, patientName: e.target.value})}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="Nhập số điện thoại"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Giới tính
                </label>
                <select
                  value={formData.gender}
                  onChange={e => setFormData({...formData, gender: e.target.value as 'MALE' | 'FEMALE'})}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  required
                  value={formData.birthDate}
                  onChange={e => setFormData({...formData, birthDate: e.target.value})}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Địa chỉ
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Lý do tư vấn
              </label>
              <textarea
                required
                value={formData.reason}
                onChange={e => setFormData({...formData, reason: e.target.value})}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div className="mt-6 flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  'Xác nhận đặt lịch'
                )}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default BookingModal 