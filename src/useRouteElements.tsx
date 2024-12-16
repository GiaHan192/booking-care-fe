import { useRoutes } from 'react-router-dom'
import Home from './components/Home/Home'
import ChatBot from './components/ChatBot/ChatBox'
import LoginForm from './components/Login/LoginForm'
import RegisterForm from './components/Register/RegisterForm'
import SurveyQuestions from './components/SurveyQuestions/SurveyQuestions'
import DoctorList from './components/Doctor/DoctorList'
import BookingForm from './components/Reservation/BookingForm'
import Posts from './components/Post/Posts'
import PostDetail from './components/Post/PostDetail'

import AdminLayout from './layouts/AdminLayout'
import ProtectedAdminRoute from './components/ProtectedRoute'
import AdminDoctors from './pages/Admin/Doctors'
import AdminUsers from './pages/Admin/Users'
import MainLayout from './layouts/MainLayout'
import DoctorDetails from './pages/Admin/DoctorDetails'
import DoctorEdit from './pages/Admin/DoctorEdit'
import DoctorCreate from './pages/Admin/DoctorCreate'
import AdminPosts from './pages/Admin/Posts'
import SystemTimeSlots from './pages/Admin/SystemTimeSlots'
import PostCreate from './pages/Admin/PostCreate'
import PostEdit from './pages/Admin/PostEdit'
import BookingPrices from './pages/Admin/BookingPrices'
import Tests from './pages/Admin/Tests'
import DoctorDetail from './components/Doctor/DoctorDetail'

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      element: <MainLayout />,
      children: [
        {
          path: '/',
          element: <Home />
        },
        {
          path: '/chatbot',
          element: <ChatBot />
        },
        {
          path: '/login',
          element: <LoginForm />
        },
        {
          path: '/register',
          element: <RegisterForm />
        },
        {
          path: '/survey',
          element: <SurveyQuestions />
        },
        {
          path: '/doctor/:id',
          element: <DoctorDetail />
        },
        {
          path: '/kham-than-kinh',
          element: <DoctorList />
        },
        {
          path: '/danh-sach-bac-si',
          element: <DoctorList />
        },
        {
          path: '/thong-tin-dat-lich',
          element: <BookingForm />
        },
        {
          path: '/posts',
          element: <Posts />
        },
        {
          path: '/post/detail/:id',
          element: <PostDetail />
        }
      ]
    },

    // Admin routes
    {
      path: '/admin',
      element: (
        <ProtectedAdminRoute>
          <AdminLayout />
        </ProtectedAdminRoute>
      ),
      children: [
        {
          path: 'posts',
          element: <AdminPosts />
        },
        {
          path: 'doctors',
          element: <AdminDoctors />
        },
        {
          path: 'users',
          element: <AdminUsers />
        },
        {
          path: 'doctors/create',
          element: <DoctorCreate />
        },
        {
          path: 'doctors/:id',
          element: <DoctorDetails />
        },
        {
          path: 'doctors/edit/:id',
          element: <DoctorEdit />
        },
        {
          path: 'time-slots',
          element: <SystemTimeSlots />
        },
        {
          path: 'posts/create',
          element: <PostCreate />
        },
        {
          path: 'posts/:id/edit',
          element: <PostEdit />
        },
        {
          path: 'booking-prices',
          element: <BookingPrices />
        },
        {
          path: 'tests',
          element: <Tests />
        }
      ]
    }
  ])
  return routeElements
}
