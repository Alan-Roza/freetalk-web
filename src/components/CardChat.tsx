import React from 'react'
import styles from '../../styles/Card.module.css'

interface ICardChat {
  name: string
  messagePreview: string
  notification: boolean
  updateAt: string
}

function CardChat({ name, messagePreview, notification, updateAt }: ICardChat) {
  return (
    <div className={styles.main}>
      <p className={styles.name}>{name}</p>
      <p className={styles.message}>{messagePreview}</p>
      <p className={styles.notification}>{notification}</p>
      <p className={styles.time}>{updateAt}</p>
    </div>
  )
}

export default CardChat