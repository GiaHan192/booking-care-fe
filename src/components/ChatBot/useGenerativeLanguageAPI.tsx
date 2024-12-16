import { useState } from 'react'

interface MessagePart {
  text: string
}

interface Message {
  role: string
  parts: MessagePart[]
}

const useGenerativeLanguageAPI = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const generateContent = async (
    message: string,
    allMessages: Message[],
    setAllMessages: React.Dispatch<React.SetStateAction<Message[]>>
  ) => {
    setIsLoading(true)

    const API_KEY = 'AIzaSyAvBp5X5BieLHHwYljisMoEXFB6wtb3M-8' // Replace
    // lấy API_KEY từ https://aistudio.google.com/app/apikey
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY} `

    const trainingPrompt: Message[] = [] // Define the trainingPrompt variable

    const messagesToSend: Message[] = [
      ...trainingPrompt,
      ...allMessages,
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ]

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: messagesToSend })
      })

      const data = await response.json()
      const responseMessage = data.candidates[0].content.parts[0].text

      const newAllMessages: Message[] = [
        ...allMessages,
        { role: 'user', parts: [{ text: message }] },
        { role: 'model', parts: [{ text: responseMessage }] }
      ]

      setAllMessages(newAllMessages)
    } catch (error) {
      console.error('Error:', error)
    }

    setIsLoading(false)
  }

  return { generateContent, isLoading }
}

export default useGenerativeLanguageAPI
