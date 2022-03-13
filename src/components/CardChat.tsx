import dayjs, { Dayjs } from 'dayjs'
import React from 'react'
import styles from '../../styles/Card.module.scss'

interface ICardChat {
  name: string
  messagePreview: string | string[]
  notification: boolean
  updateAt: Dayjs | string | Date
  _id: string
  onClick: (_id: string) => void
}

const circleSVG = (
  <svg width="10" height="14" >
    <circle cx="5" cy="5" r="5" fill="white" />
  </svg>
)

function CardChat({ name, messagePreview, notification, updateAt, _id, onClick }: ICardChat) {
  return (
    <div className={styles.main} onClick={() => onClick(_id)}>
      <p className={styles.name}>{name}</p>
      <p className={styles.message}>{messagePreview.slice(-1)}</p>
      <div className={styles.notification}>{notification && circleSVG}</div>
      <p className={styles.time}>{dayjs(updateAt).format('h:mm A')}</p>
    </div>
  )
}

export default CardChat