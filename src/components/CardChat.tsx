import dayjs, { Dayjs } from 'dayjs'
import React, { useEffect, useState } from 'react'
import styles from '../../styles/Card.module.scss'

interface ICardChat {
  name: string
  messagePreview: string | string[]
  notification?: boolean
  updateAt: Dayjs | string | Date
  _id: string
  onClick: (_id: string) => void
}

const circleSVG = (
  <svg width="10" height="14" >
    <circle cx="5" cy="5" r="5" fill="white" />
  </svg>
)

function CardChat({ chat, messagePreview, notification, updatedAt, _id, onClick, currentUser }: any) {
  const [name, setName] = useState<any>()

  useEffect(() => {
    (() => {
      const receiverName = Array.isArray(chat.references) && chat.references?.find((item: any) => item.userId !== currentUser.userId)
      setName(receiverName?.name ?? 'Eu')
    })()
  }, [chat, currentUser])

  return (
    <div className={styles.main} onClick={() => onClick(_id)}>
      <p className={styles.name}>{name && name}</p>
      <p className={styles.message}>{messagePreview || 'Clique aqui e comece uma conversa'}</p>
      <div className={styles.notification}>{notification && circleSVG}</div>
      <p className={styles.time}>{updatedAt && dayjs(updatedAt).format('h:mm A')}</p>
    </div>
  )
}

export default CardChat