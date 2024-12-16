import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RiSearchLine, RiMentalHealthLine } from 'react-icons/ri'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate('/chatbot', { 
        state: { 
          initialMessage: query.trim() 
        }
      })
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      <div className="text-center mb-4">
        <p className="text-white/90 text-lg mb-2">
          Hãy đặt câu hỏi về sức khỏe tinh thần của bạn
        </p>
        <p className="text-white/75 text-sm">
          AI sẽ giúp bạn giải đáp những thắc mắc về tâm lý, stress, lo âu...
        </p>
      </div>

      <form onSubmit={handleSearch} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <RiMentalHealthLine className="h-6 w-6 text-indigo-500" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ví dụ: Làm thế nào để giảm stress?"
          className="w-full px-4 py-4 pl-12 pr-32 text-gray-900 bg-white/95 backdrop-blur-sm border-2 border-white/20 rounded-full focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-lg"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2 group-hover:gap-3"
        >
          <span>Hỏi AI</span>
          <RiSearchLine className="w-4 h-4 transition-transform group-hover:scale-110" />
        </button>
      </form>

      <div className="text-center mt-3">
        <p className="text-white/60 text-sm">
          Nhấn Enter hoặc click "Hỏi AI" để được tư vấn
        </p>
      </div>
    </div>
  )
} 