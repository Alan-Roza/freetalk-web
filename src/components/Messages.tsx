import React from 'react'
import styles from '../../styles/Message.module.scss'

interface IMessage {
  isSender: boolean
  message: string
}

export default function Message({ isSender, message }: IMessage | any) {
  return (
    <div className={!isSender ? styles.card : styles.cardReverse}>
      <div className={!isSender ? styles.textbox : styles.textboxReverse}>
        <p className={styles.message}>
          {message}
        </p>
      </div>
    </div>
  )
}