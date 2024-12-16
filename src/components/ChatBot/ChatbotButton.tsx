import { Link } from 'react-router-dom'
import { RiRobot2Fill } from 'react-icons/ri'

export default function ChatbotButton() {
  return (
    <Link
      to="/chatbot"
      className="fixed bottom-8 right-8 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center group"
    >
      <RiRobot2Fill className="w-7 h-7" />
      <span className="absolute right-full mr-3 bg-white text-gray-900 px-3 py-1 rounded-lg text-sm font-medium shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        Chat với AI
      </span>
    </Link>
  )
} 