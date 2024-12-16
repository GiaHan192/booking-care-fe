import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'react-hot-toast'
import Cookies from 'js-cookie'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'

interface Answer {
  id: number;
  answer: string;
  point: number;
}

interface Question {
  id: number;
  questionTitle: string;
  answers: Answer[];
}

export default function Tests() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchTests = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/questions`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('access_token')}`
        }
      })
      if (!response.ok) throw new Error('Failed to fetch tests')
      const data = await response.json()
      setQuestions(data)
    } catch (error) {
      console.error('Error fetching tests:', error)
      toast.error('Không thể tải danh sách bài kiểm tra')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/questions/import`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${Cookies.get('access_token')}`
        },
        body: formData
      })

      if (!response.ok) throw new Error('Import failed')

      const result = await response.json()
      toast.success('Import bài kiểm tra thành công')
      fetchTests() // Refresh the list
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Error importing test:', error)
      toast.error('Import bài kiểm tra thất bại')
    }
  }

  useEffect(() => {
    fetchTests()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Quản lý bài kiểm tra</h1>
        <div className="mt-4 sm:mt-0 flex items-center gap-4">
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            ref={fileInputRef}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
          >
            <FaPlus className="mr-2" />
            Import bài kiểm tra
          </label>
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-800">
            Tổng: {questions.length} câu hỏi
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {questions.map((question) => (
          <div key={question.id} className="bg-white shadow rounded-lg overflow-hidden">
            <div
              className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
              onClick={() => setExpandedQuestionId(expandedQuestionId === question.id ? null : question.id)}
            >
              <div className="flex items-center">
                <span className="text-gray-500 mr-4">Câu {question.id}</span>
                <h3 className="text-sm font-medium text-gray-900">{question.questionTitle}</h3>
              </div>
              <span className="text-gray-400">
                {expandedQuestionId === question.id ? '▼' : '▶'}
              </span>
            </div>

            {expandedQuestionId === question.id && (
              <div className="px-6 py-4 bg-gray-50 border-t">
                <div className="space-y-3">
                  {question.answers.map((answer) => (
                    <div key={answer.id} className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 mt-1">
                        <div className="h-full w-full rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">{answer.point}</span>
                        </div>
                      </div>
                      <p className="ml-3 text-sm text-gray-600">{answer.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 