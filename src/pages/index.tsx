import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { FormEvent, useEffect, useState } from 'react'
import styles from '../../styles/Home.module.scss'
import { onlyIcon, plus, sendButton, backArrow } from '../assets'
import CardChat from '../components/CardChat'
import socket from '../services/socket'
import TextareaAutosize from 'react-textarea-autosize';
import Message from '../components/Messages'
import axios from 'axios'
import signin from '../consumers/signin'
import authentication from '../consumers/authentication'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import user from '../consumers/user'
import { useMediaQuery } from 'react-responsive'

interface IList {
  name: string
  receiverName: string
  message: string[]
  notification: boolean
  updateAt: Date | string
  _id: string
}

interface IMessage {
  message: string
  _id?: string
}

const Home: NextPage = () => {
  const router = useRouter()

  const [list, setList] = useState<IList[] | any>([])
  const [textareaValue, setTextareaValue] = useState<string>('')
  const [currentUser, setCurrentUser] = useState<{ username: string | null, userId: string | null }>({ username: null, userId: null })
  const [currentConversation, setCurrentConversation] = useState<IList | any>()
  const [chatReceiver, setChatReceiver] = useState<{name: string, userId: string}>()
  const [showMessage, setShowMessage] = useState<boolean>(true)

  const isTabletOrMobile = useMediaQuery({
    query: '(max-width: 991px)'
  })

  const onClickChat = (_id: string) => {
    socket.emit('join', _id)
  }

  useEffect(() => {
    socket.on('output-messages', (chats: any) => {
      setList(chats)
    })

    socket.on('joined', (joinedChat: any) => {
      setCurrentConversation(joinedChat)
    })

    socket.on('chat-created', (chats: any) => {
      setList((prev: any) => ([...prev, chats]))
    })

    socket.on('chat-updated', (chats: any) => {
      setList(chats)
    })

    socket.on('message', (message: any) => {
      message && setCurrentConversation(message)
      const newList = list.map((chat: any) => chat._id === message._id ? message : chat)
      console.log(newList, 'new list')
    })
  }, [])

  useEffect(() => {
    console.log(currentUser, 'haha')
    socket.emit('chat-in', currentUser?.userId)
  }, [currentUser])

  const newChat = (targetUser: any) => {
    socket.emit('create', {
      references: [{
        name: targetUser.username,
        userId: targetUser._id,
      },
      {
        name: currentUser.username,
        userId: currentUser.userId
      }],
      messages: [],
      privateChat: true
    })
  }

  useEffect(() => {
    async function getRefreshToken() {
      try {
        const response = await authentication.refreshToken()
        if (response) {
          setCurrentUser(response)
        }
      } catch (err: any) {
        console.error(err)
        router.push('/Signin')
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          confirmButtonText: 'Entendi',
          text: err
        })
      }
    }

    getRefreshToken()
  }, [])

  useEffect(() => {
    (() => {
      if (!isTabletOrMobile) return setShowMessage(true)

      if (isTabletOrMobile && currentConversation) return setShowMessage(true)
      if (isTabletOrMobile && !currentConversation) return setShowMessage(false)
    })()
    
    if (currentConversation) {
      const receiverName = Array.isArray(currentConversation?.references) && currentConversation.references?.find((item: any) => item.userId !== currentUser.userId)
      setChatReceiver(receiverName)
    }
  }, [currentConversation, isTabletOrMobile])

  const onPlus = () => {
    Swal.fire({
      title: 'Digite o nome do usuário',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Procurar',
      showLoaderOnConfirm: true,
      preConfirm: async (username) => {
        try {
          const response = await user.find({ username })
          if (response) {
            newChat(response.data[0])
            return response
          }
          throw new Error(response.statusText)
        } catch (err: any) {
          console.log(err)
          Swal.showValidationMessage(
            `Falha na requisição: ${err?.message || 'Não foi possível localizar o usuário'}`
          )
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: `Localizado: ${result.value.data[0].username}`,
          text: 'Envie uma mensagem para começar a conversa.'
          // imageUrl: result.value.avatar_url
        })
      }
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
        <section className={styles.chats} style={!isTabletOrMobile ? { display: 'initial' } : !showMessage ? { display: 'initial' } : { display: 'none' }}>
          <div className={styles.header}>
            <div className={styles.search} onClick={() => onPlus()}>
              <Image height={'20px'} src={plus} alt="Sinal de mais" />
            </div>
            <p className={styles.headerTitle} >Meus Chats</p>
          </div>
          <div className={styles.listChats}>
            {list && list.map((chat: any, index: any) => (
              <div className={styles.eachChat} key={index}>
                <CardChat
                  onClick={(_id: any) => onClickChat(_id)}
                  _id={chat._id}
                  currentUser={currentUser}
                  chat={chat}
                  messagePreview={chat.messages[chat.messages.length - 1]?.message}
                  notification={chat.notification}
                  updatedAt={chat.messages[chat.messages.length - 1]?.createdAt}
                />
              </div>
            ))}
          </div>
        </section>

        <div className={styles.divider} />

        <section className={styles.messenger} style={!isTabletOrMobile ? { display: 'grid' } : showMessage ? { display: 'grid' } : { display: 'none' }}>
          <header className={styles.messengerHeader}>
            {isTabletOrMobile && (
              <div className={styles.goBack}>
                <Image src={backArrow} height={'40%'} width={'40%'} onClick={() => setCurrentConversation(null)} />
              </div>
            )}
            <Image height={70} width={70} src={onlyIcon} alt="Avatar" />
            <p>{chatReceiver && chatReceiver.name}</p>
          </header>

          <div className={styles.messageBody}>
            {currentConversation && currentConversation?.messages?.map((message: any) => (
              <Message isSender={message.senderId === currentUser.userId} message={message?.message} />
            ))}
          </div>

          <div className={styles.sender}>
            <TextareaAutosize
              value={textareaValue}
              onChange={(event) => {
                setTextareaValue(event?.currentTarget?.value)
              }}
              onKeyDown={(event) => {
                if (event.code.toLowerCase() === 'enter') event.preventDefault()
                if (event.code.toLowerCase() === 'enter' && textareaValue !== '') {
                  socket.emit('message',
                    {
                      message: String(textareaValue),
                      senderId: currentUser.userId,
                      createdAt: new Date()
                    })
                  setTextareaValue('')
                }
              }}
              placeholder='Digite sua mensagem...' autoFocus={true} className={styles.textarea} minRows={1} maxRows={5} />
            <div className={styles.senderButton}>
              <Image height={50} width={50} src={sendButton} alt="Botão de enviar" onClick={() => {
                if (textareaValue !== '') {
                  socket.emit('message',
                    {
                      message: String(textareaValue),
                      senderId: currentUser.userId,
                      createdAt: new Date()
                    })
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
