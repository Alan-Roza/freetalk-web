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

function CardChat({ receiverName, messagePreview, notification, updatedAt, _id, onClick }:  any) {
  return (
    <div className={styles.main} onClick={() => onClick(_id)}>
      <p className={styles.name}>{receiverName}</p>
      <p className={styles.message}>{messagePreview || 'Clique aqui e comece uma conversa'}</p>
      {/* <div className={styles.notification}>{notification && circleSVG}</div> */}
      <p className={styles.time}>{dayjs(updatedAt).format('h:mm A')}</p>
    </div>
  )
}

export default CardChat