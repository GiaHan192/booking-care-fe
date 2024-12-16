import React, { useState, FormEvent, ChangeEvent, useRef, useEffect } from 'react'
import useGenerativeLanguageAPI from './useGenerativeLanguageAPI'
import { FaPaperPlane } from 'react-icons/fa'
import { useLocation } from 'react-router-dom'

import { FaSpinner } from 'react-icons/fa'

interface MessagePart {
  text: string
}

interface Message {
  role: string
  parts: MessagePart[]
}

const ChatBot: React.FC = () => {
  const { generateContent, isLoading } = useGenerativeLanguageAPI()
  const [message, setMessage] = useState<string>('')
  const [allMessages, setAllMessages] = useState<Message[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const location = useLocation()

  const userAvatarUrl =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRlmyJG9V3y7C-qme6ZY7VXuBA0goQLwR-Ag&usqp=CAU'
  const botAvatarUrl =
    'https://imageio.forbes.com/specials-images/imageserve/64b5825a5b9b4d3225e9bd15/artificial-intelligence--ai/960x0.jpg?format=jpg&width=960'
  const backgroundUrl =
    'https://images.unsplash.com/photo-1713562861618-b18992824170?q=80&w=1890&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault()
    if (message.trim() === '') {
      return
    }
    await generateContent(message, allMessages, setAllMessages)
    setMessage('')
  }

  const handleInitialQuery = (query: string) => {
    setMessage(query)
    const event = new Event('submit') as any
    sendMessage(event)
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [allMessages])

  useEffect(() => {
    const state = location.state as { initialMessage?: string }
    if (state?.initialMessage) {
      generateContent(state.initialMessage, allMessages, setAllMessages)
      window.history.replaceState({}, document.title)
    }
  }, [])

  return (
    <div
      className='flex flex-col items-center bg-cover p-3 rounded-lg w-96 mx-auto '
      style={{ backgroundImage: `url("${backgroundUrl}")` }}
    >
      <MessageDisplay allMessages={allMessages} userAvatarUrl={userAvatarUrl} botAvatarUrl={botAvatarUrl} />
      <form className='flex mt-4' onSubmit={sendMessage}>
        <input
          ref={inputRef}
          className='rounded-l-lg p-4 border-t mr-0 border-b border-l text-gray-800 border-gray-200 bg-white outline-slate-400'
          type='text'
          placeholder='Message Chat Bot...'
          onChange={(e: ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
          value={message}
        />
        <button
          className='px-8 rounded-r-lg bg-blue-400 text-white font-bold p-4 uppercase border-blue-500 border-t border-b border-r'
          type='submit'
        >
          <FaPaperPlane color='white' size={50} />
        </button>
      </form>
      {isLoading && <LoadingIndicator />}
    </div>
  )
}

const LoadingIndicator: React.FC = () => (
  <div className='flex justify-center items-center'>
    <FaSpinner className='w-6 h-6 animate-spin' />
  </div>
)

interface MessageDisplayProps {
  allMessages: Message[]
  userAvatarUrl: string
  botAvatarUrl: string
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ allMessages, userAvatarUrl, botAvatarUrl }) => {
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [allMessages])

  return (
    <div className='flex flex-col space-y-8 p-3 h-96 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'>
      <div className='flex items-end'>
        <div className='flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2'>
          <div>
            <div className='px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600'>
              Chào bạn, tôi là chat bot, tôi sẽ giúp bạn trả lời câu hỏi.
            </div>
          </div>
        </div>
        <div className='flex flex-shrink-0 order-1'>
          <img className='h-8 w-8 rounded-full object-cover' src={botAvatarUrl} alt='Avatar' />
        </div>
      </div>
      {allMessages.map((message, index) => (
        <div key={index} className={`flex items-end ${message.role === 'user' ? 'justify-end' : ''}`}>
          <div
            className={`flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 ${
              message.role === 'user' ? 'items-end' : ''
            }`}
          >
            {message.parts.map((part, i) => (
              <div key={i}>
                <div
                  className={`px-4 py-2 rounded-lg inline-block rounded-bl-none ${
                    message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600 late-100'
                  }`}
                >
                  {part.text.split('').map((char, j) => (
                    <span key={j} style={{ animationDelay: `${j * 0.1}s` }}>
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className='flex flex-shrink-0 order-1'>
            <img
              className='h-8 w-8 rounded-full object-cover'
              src={message.role === 'user' ? userAvatarUrl : botAvatarUrl}
              alt='Avatar'
            />
          </div>
        </div>
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  )
}

export default ChatBot
