import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { FormEvent, useEffect, useState } from 'react'
import styles from '../../styles/Home.module.scss'
import { onlyIcon, plus, sendButton, backArrow, withoutMessage, logout } from '../assets'
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
import { clearStorage } from '../utils/localStorage'

// Interfaces para tipagem
interface IChat {
  _id: string
  references: IRef[]
  privateChat: boolean
  messages: IMessage[] | []
}

interface IRef {
  name: string | null
  userId: string | null
  _id: string
}

interface IMessage {
  message: string
  _id: string
  senderId: string
  createdAt: string
}

const Home: NextPage = () => {
  const router = useRouter()

  const [list, setList] = useState<IChat[] | null>([])
  const [textareaValue, setTextareaValue] = useState<string>('')
  const [currentUser, setCurrentUser] = useState<{ username: string | null, userId: string | null }>({ username: null, userId: null })
  const [currentConversation, setCurrentConversation] = useState<IChat | null>()
  const [chatReceiver, setChatReceiver] = useState<IRef>()
  const [showMessage, setShowMessage] = useState<boolean>(true)

  // Constante para distinção de dispositivos 
  const isTabletOrMobile = useMediaQuery({
    query: '(max-width: 991px)'
  })

  // Ao clicar num chat é feito um emit para pegar as informações deste chat
  const onClickChat = (_id: string) => {
    if (_id !== currentConversation?._id) {
      socket.emit('join', _id)
    } else setCurrentConversation(null)
  }

  // Sair do chat (logout)
  const logoutChat = () => {
    clearStorage()
    router.push('/Signin')
  }

  // Inicia-se a escuta dos eventos logo que inicia a página
  useEffect(() => {
    socket.on('joined', (joinedChat: any) => {
      setCurrentConversation(joinedChat)
    })

    socket.on('output-messages', (chats: any) => {
      setList(chats)
    })

    socket.on('chat-created', (chats: any) => {
      setList((prev: any) => ([...prev, chats]))
    })

    socket.on('message', (message: any) => {
      message && setCurrentConversation(message)
    })

    return () => {
      socket.removeAllListeners()
    }
  }, [])

  useEffect(() => {
    socket.emit('chat-in', currentUser?.userId)
  }, [currentUser, currentConversation?.messages])

  // emit para iniciar um novo chat
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

  // Refresh Token, caso não possua token retorna para o SignIn
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

  // Verifica qual o dispositivo que está sendo utilizado (através de media query)
  useEffect(() => {
    (() => {
      if (!isTabletOrMobile) return setShowMessage(true)

      if (isTabletOrMobile && currentConversation) return setShowMessage(true)
      if (isTabletOrMobile && !currentConversation) return setShowMessage(false)
    })()

    if (currentConversation) {
      const receiverName = Array.isArray(currentConversation?.references) ? currentConversation.references?.find((item: any) => item.userId !== currentUser.userId) : undefined
      setChatReceiver(receiverName)
      if (!receiverName && currentConversation?.references) setChatReceiver(currentConversation?.references[0]) 
    }
  }, [currentConversation, isTabletOrMobile])

  // Adiciona uma nova conversa
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
        })
      }
    })
  }

  return (
    <div className={styles.container}>
      {/* Meta configurações */}
      <Head>
        <title>FreeTalk</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        <meta name="description" content="Talk with any people anywhere" />
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Conteúdo da página */}
      <main className={styles.main}>

        {/* Listagem de conversas         */}
        <section className={styles.chats} style={!isTabletOrMobile ? { display: 'initial' } : !showMessage ? { display: 'initial' } : { display: 'none' }}>

          {/* Header */}
          <div className={styles.header}>
            <div className={styles.search} onClick={() => onPlus()}>
              <Image height={'20px'} src={plus} alt="Sinal de mais" />
            </div>
            {isTabletOrMobile && (
              <div className={styles.logout}>
                <Image src={logout} height={'40%'} width={'40%'} onClick={() => logoutChat()} />
              </div>
            )}
            <p className={styles.headerTitle} >Meus Chats</p>
          </div>

          {/* Listagem */}
          <div className={styles.listChats}>
            {list && list.map((chat: any, index: number) => (
              <div className={styles.eachChat} key={index}>
                <CardChat
                  onClick={(_id: string) => onClickChat(_id)}
                  _id={chat._id}
                  currentUser={currentUser}
                  chat={chat}
                  messagePreview={chat?.messages[chat?.messages?.length - 1]?.message}
                  notification={chat.notification}
                  updatedAt={chat.messages[chat.messages.length - 1]?.createdAt}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Linha divisora entre listagem e chat */}
        <div className={styles.divider} />

        {/* Chat para Conversa */}
        <section className={styles.messenger} style={!isTabletOrMobile ? { display: 'grid' } : showMessage ? { display: 'grid' } : { display: 'none' }}>

          {/* Header */}
          <header className={styles.messengerHeader}>
            {isTabletOrMobile && (
              <div className={styles.goBack}>
                <Image src={backArrow} height={'40%'} width={'40%'} onClick={() => setCurrentConversation(null)} />
              </div>
            )}
            <Image height={70} width={70} src={onlyIcon} alt="Avatar" />
            <p>{chatReceiver && currentConversation ? chatReceiver.name : 'FreeTalk'}</p>
            {!isTabletOrMobile && (
              <div className={styles.logout}>
                <Image src={logout} height={'40%'} width={'40%'} onClick={() => logoutChat()} />
              </div>
            )}
          </header>

          {/* Corpo da conversa */}
          <div className={styles.messageBody}>
            {currentConversation ? currentConversation?.messages?.map((message: any) => (
              <Message isSender={message.senderId === currentUser.userId} message={message?.message} createdAt={message.createdAt} />
            )) : (
              <div className={styles.withoutImage}>
                <Image className={styles.withoutImage} src={withoutMessage} />
              </div>
            )}
          </div>

          {/* Input para envio das conversas */}
          {currentConversation && (
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
                        createdAt: new Date(),
                        currentUser: currentUser?.userId
                      })
                    setTextareaValue('')
                  }
                }}
                placeholder='Digite sua mensagem...'
                autoFocus
                className={styles.textarea}
                minRows={1}
                maxRows={5}
              />
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
          )}
        </section>
      </main>
    </div>
  )
}

export default Home
