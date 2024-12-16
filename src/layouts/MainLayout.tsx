import { Outlet } from 'react-router-dom'
import Header from '../components/Header/Header'
import ChatbotButton from '../components/ChatBot/ChatbotButton'

export default function MainLayout() {
  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <main className='flex-1 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <Outlet />
        </div>
      </main>
      <ChatbotButton />
    </div>
  )
}
