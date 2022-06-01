import dayjs from 'dayjs'
import React, { useEffect, useRef } from 'react'
import styles from '../../styles/Message.module.scss'

interface IMessage {
  isSender: boolean
  message: string
  createdAt: string
}

export default function Message({ isSender, message, createdAt }: IMessage) {
  const messagesEndRef = useRef<any>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [message, messagesEndRef])

  return (
    <div className={!isSender ? styles.card : styles.cardReverse}>
      <div className={!isSender ? styles.textbox : styles.textboxReverse}>
        <p className={styles.message} ref={messagesEndRef}>
          {message}
        </p>
        <p className={styles.messageCreatedAt}>
          {dayjs(createdAt).format('HH:mm')}
        </p>
      </div>
    </div>
  )
}