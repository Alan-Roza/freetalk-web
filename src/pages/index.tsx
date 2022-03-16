import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { FormEvent, useEffect, useState } from 'react'
import styles from '../../styles/Home.module.scss'
import { onlyIcon, plus, sendButton } from '../assets'
import CardChat from '../components/CardChat'
import socket from '../services/socket'
import TextareaAutosize from 'react-textarea-autosize';
import Message from '../components/Messages'
import axios from 'axios'
import signin from '../consumers/signin'

interface IList {
  name: string
  message: string[]
  notification: boolean
  updateAt: Date | string
  _id: string
}

interface IMessage {
  message:  string
  _id?: string
}

const Home: NextPage = () => {
  const [list, setList] = useState<IList[]>()
  const [messages, setMessages] = useState<IMessage[]>([])
  const [textareaValue, setTextareaValue] = useState<string>('')
  const [currentConversation, setCurrentConversation] = useState<IList>()

  const onClickChat = (_id: string) => {
    console.log(_id, 'id')
    socket.emit('clickChatToConversation', _id)
  }

  useEffect(() => {
    socket.on('chatConversation', (conversation: any) => {
      setCurrentConversation(conversation)
    })
  }, [])
  
  const sendMessage = () => {
    socket.emit('chat-message', messages[messages.length - 1])
  }

  useEffect(() => {
    sendMessage()
  }, [messages])

  useEffect(() => {
    socket.on('chatlist', (list: any) => {
      setList(list)
    })

    return () => socket.off('chatlist')
  }, [])

  function onPlus() {
    signin.login({
      username: 'teste', 
      password: 'password'
    })
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>FreeTalk</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        <meta name="description" content="Talk with any people anywhere" />
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <section className={styles.chats}>
          <div className={styles.header}>
            <div className={styles.search} onClick={() => onPlus()}>
              <Image height={'20px'} src={plus} alt="Sinal de mais" />
            </div>
            <p className={styles.headerTitle} >Meus Chats</p>
          </div>
          {list && list.map((chat, index) => (
            <div className={styles.eachChat} key={index}>
              {console.log(chat)}
              <CardChat
                onClick={(_id) => onClickChat(_id)}
                _id={chat._id}
                name={chat.name}
                messagePreview={chat.message}
                notification={chat.notification}
                updateAt={chat.updateAt}
              />
            </div>
          ))}
        </section>

        <div className={styles.divider} />

        <section className={styles.messenger} >
          <header className={styles.messengerHeader}>
            <Image height={70} width={70} src={onlyIcon} alt="Avatar" />
            <p>{currentConversation?.name}</p>
          </header>

          <div className={styles.messageBody}>
            {currentConversation?.message?.map((message) => (
              <Message isSender={true} message={message} />
            ))}
          </div>

          <div className={styles.sender}>
            <TextareaAutosize
            value={textareaValue}
            onChange={(event) => {
              setTextareaValue(event?.currentTarget?.value)
            }}
              onKeyDown={(event) => {
                if ((event.ctrlKey) && event.code.toLowerCase() === 'enter' && textareaValue !== '') {
                  setMessages(state => [
                    ...state, { message: String(textareaValue)}
                  ])
                  setTextareaValue('')
                }
              }}
              placeholder='Digite sua mensagem...' autoFocus={true} className={styles.textarea} minRows={1} maxRows={5} />
            <div className={styles.senderButton}>
              <Image height={50} width={50} src={sendButton} alt="Botão de enviar" onClick={() => {
                if (textareaValue !== '') {
                  setMessages(state => [
                    ...state, { message: String(textareaValue)}
                  ])
                  setTextareaValue('')
                }
              }} />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home
