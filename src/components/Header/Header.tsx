import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

const Header = () => {
  const [fullName, setFullName] = useState<string | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const accessToken = Cookies.get('access_token')
    const savedFullName = Cookies.get('fullName')
    if (accessToken && savedFullName) {
      setFullName(savedFullName)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    Cookies.remove('access_token')
    Cookies.remove('fullName')
    setFullName(null)
    navigate('/')
  }

  return (
    <>
      <header className='flex w-full bg-[#EDFFFA]'>
        <div className='flex h-[78px] w-4/5 mx-auto items-center lg:w-lg justify-between'>
          <div className='w-1/5 flex items-center'>
            <Link to='/' className='cursor-pointer'>
              <img
                className='w-[200px] h-[43px]'
                src='https://bookingcare.vn/assets/icon/bookingcare-2020.svg'
                alt=''
              />
            </Link>
          </div>
          <div className='w-4/5 flex flex-row gap-x-3 justify-end'>


            {fullName ? (
              <div className='relative' ref={dropdownRef}>
                <button 
                  className='cursor-pointer px-4 py-2 hover:bg-green-400 hover:text-white rounded'
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  Hello, {fullName}
                </button>
                {isDropdownOpen && (
                  <div className='absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg z-50'>
                    <button
                      onClick={handleLogout}
                      className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className='cursor-pointer px-4 py-2 hover:bg-green-400 hover:text-white rounded'>
                <Link to='/login'>Đăng nhập</Link>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
