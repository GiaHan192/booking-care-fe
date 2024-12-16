import { Link, useLocation, Outlet } from 'react-router-dom'
import { FaNewspaper, FaUserMd, FaCalendarAlt, FaUsers, FaSignOutAlt, FaClock, FaDollarSign, FaClipboardList } from 'react-icons/fa'
import { getUser, logout } from '../utils/auth'

export default function AdminLayout() {
  const location = useLocation()
  const user = getUser()

  const isActive = (path: string) => {
    return location.pathname === path ? 
      'bg-indigo-500 text-white' : 
      'text-gray-700 hover:bg-indigo-500 hover:text-white'
  }

  const menuItems = [
    {
      path: '/admin/posts',
      icon: <FaNewspaper />,
      label: 'Quản lý bài viết'
    },
    {
      path: '/admin/doctors',
      icon: <FaUserMd />,
      label: 'Quản lý bác sĩ'
    },
    {
      path: '/admin/time-slots',
      icon: <FaClock />,
      label: 'Quản lý khung giờ'
    },
    {
      path: '/admin/booking-prices',
      icon: <FaDollarSign />,
      label: 'Quản lý giá khám'
    },
    {
      path: '/admin/users',
      icon: <FaUsers />,
      label: 'Quản lý người dùng'
    },
    {
      path: '/admin/tests',
      icon: <FaClipboardList />,
      label: 'Quản lý bài kiểm tra'
    }
  ]

  return (
    <div className='min-h-screen flex'>
      <div className='w-64 bg-white border-r shadow-sm'>
        {/* Admin Info */}
        <div className='p-4 border-b'>
          <h2 className='text-2xl font-bold text-gray-800'>Trang Quản Lý</h2>
          <div className='mt-4 flex items-center'>
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'Admin')}`}
              alt='Admin'
              className='w-10 h-10 rounded-full'
            />
            <div className='ml-3'>
              <p className='text-sm font-medium text-gray-800'>{user?.fullName || 'Admin'}</p>
              <p className='text-xs text-gray-500'>{user?.email || 'admin@example.com'}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className='mt-6 px-3 relative h-[calc(100vh-200px)]'>
          <div className='space-y-2'>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-purple-100 hover:text-purple-700 transition-colors duration-200 flex items-center text-sm ${
                  location.pathname === item.path
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                }`}
              >
                <span className='mr-3 text-lg'>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Logout Button */}
          <div className='absolute bottom-4 left-3 right-3'>
            <button
              onClick={logout}
              className='w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-red-500 hover:text-white transition-colors duration-200 flex items-center text-sm'
            >
              <FaSignOutAlt className='mr-3 text-lg' />
              Đăng xuất
            </button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className='flex-1 bg-gray-50 h-screen overflow-y-auto'>
        <main className='p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
