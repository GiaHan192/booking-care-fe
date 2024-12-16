import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { toast } from 'react-hot-toast'
import { FaLock, FaLockOpen, FaCalendarAlt } from 'react-icons/fa'
import { getUser } from 'src/utils/auth'
import { totalmem } from 'os'
import { format } from 'date-fns'
import * as Dialog from '@radix-ui/react-dialog'
import { IoClose } from 'react-icons/io5'

interface User {
  id: number
  fullName: string
  userName: string
  roles: {
    id: number
    roleName: string
  }
  activate: boolean
}

interface PaginationParams {
  page: number;
  size: number;
  totalPages: number;
  totalItems: number;
}

interface Booking {
  id: number;
  user: {
    id: number;
    fullName: string;
    userName: string;
  };
  doctor: {
    id: number;
    fullName: string;
    title: string;
    image: string;
  };
  bookingTime: {
    id: number;
    fromTime: string;
    toTime: string;
  };
  bookingDate: string;
  status: string;
  price: number;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 0,
    size: 10,
    totalPages: 0,
    totalItems: 0
  });
  const [loading, setLoading] = useState<boolean>(true);
  const currentUser = getUser();
  const [userBookings, setUserBookings] = useState<Booking[]>([])
  const [selectedUserId, setSelectedUserId] = useState<number>(0)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  const fetchUsers = async (page: number = 0) => {
    try {
      setLoading(true)
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users?page=${page}&size=${pagination.size}`,
        {
          headers: {
            'Authorization': `Bearer ${Cookies.get('access_token')}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch users');

      const data = await response.json();
      setUsers(data.data.items);
      setPagination({
        ...pagination,
        page: data.data.currentPage,
        totalPages: data.data.totalPages,
        totalItems: data.data.totalItems
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Có lỗi xảy ra khi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      console.log('Changing to page:', newPage) // Debug log
      fetchUsers(newPage)
    }
  }
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleActivate = async (userId: number, currentStatus: boolean) => {
    try {
      console.log('Sending request:', {
        userId,
        currentStatus,
        newStatus: !currentStatus
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/activate/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('access_token')}`
        },
        body: JSON.stringify({
          activate: !currentStatus
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.message || 'Failed to update status');
      }

      await fetchUsers(); // Refresh data
      toast.success(currentStatus ? 'Đã khóa tài khoản' : 'Đã mở khóa tài khoản');
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const fetchUserBookings = async (userId: number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('access_token')}`
        }
      })
      if (!response.ok) throw new Error('Failed to fetch user bookings')
      const data = await response.json()
      setUserBookings(data)
    } catch (error) {
      console.error('Error fetching user bookings:', error)
      toast.error('Không thể tải lịch khám của người dùng')
    }
  }

  const UserBookingsModal = () => (
    <Dialog.Root open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg p-6 w-[90vw] max-w-3xl max-h-[85vh] overflow-y-auto shadow-xl">
          <div className="border-b pb-4 mb-4">
            <Dialog.Title className="text-xl font-bold text-gray-900">
              <div className="flex items-center">
                <FaCalendarAlt className="mr-2 text-indigo-600" />
                Lịch khám của {users.find(u => u.id === selectedUserId)?.fullName}
              </div>
            </Dialog.Title>
          </div>
          
          <Dialog.Close className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full p-1">
            <IoClose size={24} />
          </Dialog.Close>

          {userBookings.length > 0 ? (
            <div className="mt-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày khám
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bác sĩ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {format(new Date(booking.bookingDate), 'dd/MM/yyyy')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm bg-blue-50 text-blue-700 rounded-full px-3 py-1 inline-flex items-center">
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {booking.bookingTime.fromTime.slice(0, 5)} - {booking.bookingTime.toTime.slice(0, 5)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {booking.doctor.image ? (
                            <img
                              src={booking.doctor.image}
                              alt={booking.doctor.fullName}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                              <span className="text-indigo-700 font-medium text-sm">
                                {booking.doctor.fullName.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.doctor.fullName}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="flex justify-center">
                <FaCalendarAlt className="h-12 w-12 text-gray-300" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Chưa có lịch khám</h3>
              <p className="mt-2 text-sm text-gray-500">
                Người dùng này chưa đặt lịch khám nào.
              </p>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='p-6'>
      <div className='sm:flex sm:items-center sm:justify-between mb-6'>
        <h1 className='text-2xl font-semibold text-gray-900'>Quản lý người dùng</h1>
        <div className='mt-4 sm:mt-0'>
          <span className='rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-800'>
            Tổng: {pagination.totalItems} người dùng
          </span>
        </div>
      </div>

      <div className='mt-4 flex flex-col'>
        <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
            <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5'>
                      Người dùng
                    </th>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4'>
                      Email
                    </th>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6'>
                      Vai trò
                    </th>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6'>
                      Trạng thái
                    </th>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6'>
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {users.map((user) => {
                    const isCurrentUser = user.userName === currentUser?.email;
                    
                    return (
                      <tr key={user.id} className={isCurrentUser ? 'bg-blue-50' : ''}>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='flex items-center'>
                            <div className='flex-shrink-0 h-10 w-10'>
                              <div className='h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center'>
                                <span className='text-xl text-gray-600'>{user.fullName[0]}</span>
                              </div>
                            </div>
                            <div className='ml-4'>
                              <div className='flex items-center'>
                                <span className='text-sm font-medium text-gray-900'>{user.fullName}</span>
                                {isCurrentUser && (
                                  <span className='ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800'>
                                    Tài khoản của bạn
                                  </span>
                                )}
                              </div>
                              <div className='text-sm text-gray-500'>ID: {user.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{user.userName}</td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.roles.roleName === 'ROLE_ADMIN' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.roles.roleName === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${user.activate ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                          >
                            {user.activate ? 'Hoạt động' : 'Đã khóa'}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                          {user.roles.roleName !== 'ROLE_ADMIN' && (
                            <button
                              onClick={() => {
                                setSelectedUserId(user.id)
                                fetchUserBookings(user.id)
                                setIsBookingModalOpen(true)
                              }}
                              className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors duration-200 mr-2"
                            >
                              <FaCalendarAlt className="mr-1.5 h-4 w-4" />
                              Lịch khám
                            </button>
                          )}
                          
                          {isCurrentUser ? (
                            <span className='text-sm text-gray-500 italic'>
                              Không thể thao tác
                            </span>
                          ) : (
                            <button 
                              onClick={() => handleToggleActivate(user.id, user.activate)}
                              className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
                                user.activate 
                                  ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                                  : 'bg-green-50 text-green-600 hover:bg-green-100'
                              }`}
                            >
                              {user.activate ? (
                                <>
                                  <FaLock className="mr-1.5 h-4 w-4" />
                                  Khóa
                                </>
                              ) : (
                                <>
                                  <FaLockOpen className="mr-1.5 h-4 w-4" />
                                  Mở khóa
                                </>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
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

      <UserBookingsModal />
    </div>
  )
}

export default Users 