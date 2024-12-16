/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from 'react'
import bannerImg from '../../assets/images/healthcare.jpg'
import khamChuyenKhoaIcon from '../../assets/icons/services/icon-kham-chuyen-khoa.webp'
import khamTongQuatIcon from '../../assets/icons/services/icon-kham-tong-quat.webp'
import sucKhoeTinhThanIcon from '../../assets/icons/services/icon-suc-khoe-tinh-than.webp'
import baiTestSucKhoeIcon from '../../assets/icons/services/icon-bai-test-suc-khoe.webp'
import yTeGanNhaIcon from '../../assets/icons/services/icon-near-home.webp'
import { Link, useNavigate } from 'react-router-dom'
import HomePost from '../Post/HomePost'
import HomeDoctors from '../Doctor/HomeDoctors'
import SearchBar from './SearchBar'

const Home = () => {
  const navigate = useNavigate()
  const [showPopup, setShowPopup] = useState(false)
  const [surveyStarted, setSurveyStarted] = useState(false) // State mới để theo dõi khi bắt đầu làm bài test

  useEffect(() => {
    if (surveyStarted) {
      navigate('/survey')
    }
  }, [surveyStarted])

  const handleButtonClick = () => {
    setShowPopup(true) // Hiển thị popup khi click vào button
  }

  const handleStartSurvey = () => {
    setSurveyStarted(true) // Đánh dấu rằng bài test đã được bắt đầu
    setShowPopup(false) // Ẩn popup khi bắt đầu làm bài test
  }

  const handleOverlayClick = () => {
    setShowPopup(false) // Ẩn popup khi click ra ngoài
  }

  const handlePopupClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation() // Ngăn chặn sự kiện click từ phát sinh ra ngoài popup
  }

  return (
    <div className=' w-full'>
      <div className='flex'>
        <div className='w-full relative'>
          <img className='w-full h-[600px] object-center object-cover' src={bannerImg} alt='banner' />
          <div className='bg-black absolute top-0 left-0 w-full h-full opacity-30 z-10'></div>
          <div className='w-[90%] mx-auto'>
            <div className='absolute top-1/3 left-[10%] z-20 flex flex-col gap-y-4'>
              <span className='text-5xl font-bold text-white'>Booking Care</span>
              <span className='xl:text-4xl text-3xl font-bold text-white'>
                Nơi chăm sóc sức khoẻ tinh thần cho mọi người
              </span>
              <SearchBar />
            </div>
          </div>
        </div>
      </div>

      <div className='w-full xl:w-4/5 mx-auto mt-20'>
        <div className='flex flex-col gap-y-4 mb-10'>
          <h3 className='text-2xl font-bold'>Dịch vụ toàn diện</h3>
          <div className='grid xl:grid-cols-2 grid-cols-1 gap-8'>
            <Link 
              to='/kham-than-kinh' 
              state={{ fromMedical: true }}
              className='flex gap-x-8 p-6 items-center w-full border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200'
            >
              <img className='h-16' src={khamChuyenKhoaIcon} alt='khamChuyenKhoa' />
              <span className='font-bold text-xl'>Khám Khoa Tâm Thần</span>
            </Link>
            <Link to='/posts'>
              <div
                className='flex gap-x-8 p-6 items-center w-full border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200'
                key='Khám Khoa Tâm Thần'
              >
                <img className='h-16' src={khamTongQuatIcon} alt='khamKhoaTamThan' />
                <span className='font-bold text-xl'>Cẩm nang</span>
              </div>
            </Link>
            <Link to='/danh-sach-bac-si'>
              <div
                className='flex gap-x-8 p-6 items-center w-full border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200'
                key='sucKhoeTinhThan'
              >
                <img className='h-16' src={sucKhoeTinhThanIcon} alt='Sức khoẻ tinh thần' />
                <span className='font-bold text-xl'>Danh sách bác sĩ</span>
              </div>
            </Link>
            <Link to='/survey'>
              <div
                className='flex gap-x-8 p-6 items-center w-full border border-gray-300 rounded-xl'
                key='baiTestSucKhoe'
              >
                <img className='h-16' src={baiTestSucKhoeIcon} alt='Bài test sức khoẻ' />
                <span className='font-bold text-xl'>Bài test sức khoẻ</span>
              </div>
            </Link>
            {/* <div className='flex gap-x-8 p-6 items-center w-full border border-gray-300 rounded-xl' key='yTeGanNha'>
              <img className='h-16' src={yTeGanNhaIcon} alt='Y tế gần bạn' />
              <span className='font-bold text-xl'>Y tế gần bạn</span>
            </div> */}
          </div>
        </div>

        <HomePost />
        <HomeDoctors />
      </div>

      {showPopup && (
        <div
          className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-60'
          onClick={handleOverlayClick}
          // eslint-disable-next-line react/jsx-no-comment-textnodes
        >
          <div
            className='fixed bottom-0 left-0 right-0 top-0 m-auto h-[285px] w-[90%] rounded-[10px] bg-white px-5 pt-2 md:h-[336px] md:w-[48%]'
            onClick={handlePopupClick}
          >
            <div className='absolute right-2 top-2 md:right-4 md:top-4'>
              <button onClick={() => setShowPopup(false)}>
                <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
                    fill='#312f2f'
                  />
                </svg>
              </button>
            </div>
            <div className='mt-4 md:mt-2 text-center text-22 font-bold text-black md:text-24 text-md'>
              Vui lòng cho biết lý do bạn làm bài test này
            </div>
            <div className='flex items-end'>
              <div className='flex flex-col justify-center mx-auto mt-4 w-[290px] border-1 border-[#62BAC3] rounded-3xl md:mt-9 md:w-[494px] '>
                <button
                  onClick={handleStartSurvey}
                  className='h-14 px-7 py-2 my-2 text-center text-sm font-medium text-black border taiwin hover:bg-[rgba(69,190,229,1)] hover:text-white md:px-0 rounded-2xl border-primary'
                >
                  Tình cờ biết đến bài test, muốn làm thử
                </button>
                <button
                  onClick={handleStartSurvey}
                  className='h-14 px-7 py-2 my-2 text-center text-sm font-medium text-black border taiwin hover:bg-[rgba(69,190,229,1)] hover:text-white md:px-0 rounded-2xl border-primary '
                >
                  Đang gặp vấn đề tâm lý, cần tìm giải pháp hỗ trợ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
