import React, { useState, useEffect } from 'react'
import * as RadixRadioGroup from '@radix-ui/react-radio-group'
import { questionsTest } from 'src/assets/data/data'

interface Answer {
  id: number
  answer: string
  point: number
}

interface Question {
  id: number
  questionTitle: string
  answers: Answer[]
}

const SurveyQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1) // -1 để hiển thị intro
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null)
  const [totalPoints, setTotalPoints] = useState(0)
  const [userAnswers, setUserAnswers] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // New states for form submission
  const [userResponses, setUserResponses] = useState<{ questionId: number; index: number; answerId: number }[]>([])
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)

  const [showPopup, setShowPopup] = useState(false)

  const handleButtonClick = () => {
    setShowPopup(true)
  }

  const handleOverlayClick = () => {
    setShowPopup(false)
  }

  const handlePopupClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const fetchQuestions = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8080/questions')
      if (!response.ok) {
        throw new Error('Failed to fetch questions')
      }
      const data = await response.json()
      setQuestions(data)
      setCurrentQuestionIndex(0) // Bắt đầu hiển thị câu hỏi đầu tiên
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleStartTest = () => {
    setShowPopup(false)
    fetchQuestions()
  }

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswerIndex(index)
  }

  const handleNextQuestion = () => {
    if (selectedAnswerIndex !== null) {
      const selectedAnswer = questions[currentQuestionIndex].answers[selectedAnswerIndex]
      setUserAnswers((prev) => [...prev, selectedAnswerIndex])
      setTotalPoints((prev) => prev + selectedAnswer.point)

      // Save answer in userResponses array
      setUserResponses((prev) => [
        ...prev,
        { questionId: questions[currentQuestionIndex].id, index: selectedAnswerIndex + 1, answerId: selectedAnswer.id }
      ])

      setSelectedAnswerIndex(null)
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  // Xử lý khi nhấn nút "Quay lại"
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const lastAnswerIndex = userAnswers.pop() // Lấy câu trả lời gần nhất
      const lastAnswer = questions[currentQuestionIndex - 1].answers[lastAnswerIndex || 0]
      setTotalPoints((prev) => prev - (lastAnswer?.point || 0))
      setCurrentQuestionIndex((prev) => prev - 1)
      setSelectedAnswerIndex(lastAnswerIndex || null)

      // Remove the last answer from userResponses
      setUserResponses((prev) => prev.slice(0, -1))
    }
  }

  const renderResult = () => {
    let resultMessage = ''

    if (totalPoints < 14) {
      resultMessage = 'Không biểu hiện trầm cảm'
    } else if (totalPoints >= 14 && totalPoints <= 19) {
      resultMessage = 'Trầm cảm nhẹ'
    } else if (totalPoints >= 20 && totalPoints <= 29) {
      resultMessage = 'Trầm cảm vừa'
    } else {
      resultMessage = 'Trầm cảm nặng'
    }

    return (
      <div className='mt-8'>
        <h3 className='text-2xl font-bold'>Kết quả</h3>
        <p className='mt-2'>Tổng số điểm của bạn: {totalPoints}</p>
        <p className='mt-2'>Đánh giá: {resultMessage}</p>

        {/* Additional form for user information */}
        <form className='mt-6' onSubmit={handleSubmit}>
          <label className='block mb-2'>Họ và tên</label>
          <input
            type='text'
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className='w-full mb-4 p-2 border rounded'
          />
          <label className='block mb-2'>Email</label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='w-full mb-4 p-2 border rounded'
          />
          <button type='submit' className='bg-blue-500 text-white py-2 px-4 rounded'>
            Lưu kết quả
          </button>
        </form>

        {/* Display submit message */}
        {submitMessage && <p className='mt-4'>{submitMessage}</p>}
      </div>
    )
  }

  const renderIntroduction = () => (
    <div className='max-w-6xl mx-auto mt-10 p-6 bg-white shadow rounded'>
      <div className='flex justify-between pb-9'>
        <h6 className='text-2xl font-semibold'>Bài Test đánh giá trầm cảm Beck </h6>
      </div>
      <div className='md:relative w-full h-[200px] sm:h-[300px] md:h-[380px]'>
        <img
          className='md:absolute inset-0 w-full h-full object-cover block'
          src='https://cdn.bookingcare.vn/fo/w1920/2023/12/27/170354-test-beck.png'
          alt=''
        />
      </div>
      <div className='py-5'>
        <p className='pt-4 pb-2'>
          <strong>Bài Test đánh giá trầm cảm Beck </strong> Bài test mức độ trầm cảm BECK là một trong những phương pháp
          nhằm đánh giá về cảm xúc và mức độ trầm cảm tương đối phổ biến, được sử dụng trong các bệnh viện, phòng khám
          chuyên sâu về sức khoẻ tinh thần hiện nay.
        </p>
        <p className='py-2'>Bài test nhằm mục đích:</p>
        <ul className='py-2 list-disc px-10'>
          <li>Tự đánh giá tình trạng Sức khoẻ tinh thần cá nhân.</li>
          <li>Dự đoán về Sức khoẻ tinh thần và có kế hoạch thăm khám phù hợp.</li>
          <li>Tổng hợp thông tin để thuận tiện khi thăm khám với Bác sĩ/Chuyên gia</li>
        </ul>
        <p className='py-2'>
          <strong>Nguyên tắc thực hiện bài test:</strong>
        </p>
        <p className='py-2'>
          Hãy đọc mỗi câu hỏi sau và chọn đáp án gần giống nhất với{' '}
          <strong>tình trạng mà bạn cảm thấy trong suốt một tuần qua</strong>. Không có câu trả lời đúng hay sai. Và
          đừng dừng lại quá lâu ở bất kỳ câu nào.
        </p>
        <p className='py-2'>
          <strong>Lưu ý:</strong>
        </p>
        <p className='py-2'>
          Kết quả bài test này chỉ mang tính chất tham khảo, không có giá trị thay thế chẩn đoán y khoa bởi bác
          sĩ/chuyên gia có chuyên môn.
        </p>
        <p className='py-2'>
          <strong>Nguồn tham khảo:</strong>
        </p>
        <p className='py-2'>
          <strong>
            <a
              href='https://nimh.gov.vn/thang-danh-gia-tram-cam-beck-bdi/'
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary hover:text-primary-dark'
            >
              Viện Sức khỏe Tâm thần - Bệnh viện Bạch Mai
            </a>
          </strong>
        </p>
      </div>
      <div className='flex justify-center pt-2 pb-20'>
        <button
          onClick={handleButtonClick}
          className='w-1/2 bg-yellow-400 text-white py-2 rounded-sm text-xl font-semibold outline-primary'
        >
          BẮT ĐẦU
        </button>
      </div>

      {showPopup && (
        <div
          className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-60'
          onClick={handleOverlayClick}
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
              <div className='flex flex-col justify-center mx-auto mt-4 w-[290px] border-1 border-[#62BAC3] rounded-3xl md:mt-9 md:w-[494px]'>
                <button
                  onClick={handleStartTest}
                  className='h-14 px-7 py-2 my-2 text-center text-sm font-medium text-black border taiwin hover:bg-[rgba(69,190,229,1)] hover:text-white md:px-0 rounded-2xl border-primary'
                >
                  Tình cờ biết đến bài test, muốn làm thử
                </button>
                <button
                  onClick={handleStartTest}
                  className='h-14 px-7 py-2 my-2 text-center text-sm font-medium text-black border taiwin hover:bg-[rgba(69,190,229,1)] hover:text-white md:px-0 rounded-2xl border-primary'
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const submissionData = {
      email,
      fullName,
      content: userResponses
    }

    try {
      const response = await fetch('http://localhost:8080/questions/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      })
      if (response.ok) {
        setSubmitMessage('Kết quả đã được lưu thành công!')
      } else {
        setSubmitMessage('Đã có lỗi xảy ra khi lưu kết quả!')
      }
    } catch (error) {
      setSubmitMessage('Không thể kết nối đến máy chủ!')
    }
  }

  if (loading) {
    return <div className='text-center mt-10'>Loading...</div>
  }

  if (error) {
    return <div className='text-center mt-10 text-red-500'>Error: {error}</div>
  }

  if (currentQuestionIndex === -1) {
    return renderIntroduction()
  }

  // Tạo danh sách A, B, C,... cho các câu trả lời
  const answerLabels = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z'
  ]

  return (
    <div className='max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded'>
      {currentQuestionIndex < questions.length ? (
        <>
          <h2 className='text-2xl font-bold mb-6'>
            Câu {currentQuestionIndex + 1}: {questions[currentQuestionIndex].questionTitle}
          </h2>
          <RadixRadioGroup.Root
            className='flex flex-col space-y-4'
            value={selectedAnswerIndex !== null ? selectedAnswerIndex.toString() : ''}
            onValueChange={(value) => handleAnswerSelect(Number(value))}
          >
            {questions[currentQuestionIndex].answers.map((answer, index) => (
              <RadixRadioGroup.Item
                key={index}
                value={index.toString()}
                className={`flex flex-row cursor-pointer p-2 rounded-md border ${
                  selectedAnswerIndex === index ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
              >
                <span className='mr-2'>{answerLabels[index]}.</span> {answer.answer}
              </RadixRadioGroup.Item>
            ))}
          </RadixRadioGroup.Root>
          <div className='mt-6 flex justify-between'>
            <button
              className='bg-gray-300 text-black py-2 px-4 rounded disabled:opacity-50'
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Quay lại
            </button>
            <button
              className='bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50'
              onClick={handleNextQuestion}
              disabled={selectedAnswerIndex === null}
            >
              Câu hỏi kế tiếp
            </button>
          </div>
        </>
      ) : (
        renderResult()
      )}
    </div>
  )
}

export default SurveyQuestions
