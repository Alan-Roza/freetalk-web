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
import authentication from '../consumers/authentication'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import user from '../consumers/user'

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
  const [messages, setMessages] = useState<IMessage[]>([])
  const [textareaValue, setTextareaValue] = useState<string>('')
  const [currentUser, setCurrentUser] = useState<any>({})
  const [currentConversation, setCurrentConversation] = useState<IList | any>()
  const [allChats, setAllChats] = useState<IList | any>()

  const onClickChat = (_id: string) => {
    const chatSelected = list.filter((chat: any) => chat._id === _id)
    console.log(chatSelected)
    setCurrentConversation(chatSelected)
  }

  const newChat = (targetUser: any) => {
    console.log(targetUser, 'target')
    socket.emit('new-chat', {
      references: [
        targetUser._id,
        currentUser.userId
      ],
      messages: [{
        senderId: currentUser.userId
      }],
      receiverName: targetUser.username,
      privateChat: true
    })
  }

  useEffect(() => {
    async function getRefreshToken() {
      try {
        const response = await authentication.refreshToken()
        if (response) {
          setCurrentUser(response.data)
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
    socket.on('output-messages', (chats: any) => {
      setList(chats)
    })
  }, [])

  useEffect(() => {
    socket.on('chat-created', (chats: any) => {
      setList( (prev: any) => ([...prev, chats]))
    })
  }, [])

  // const sendMessage = () => {
  //   socket.emit('chat-message', messages[messages.length - 1])
  // }

  // useEffect(() => {
  //   sendMessage()
  // }, [messages])

  // useEffect(() => {
  //   socket.on('chatlist', (list: any) => {
  //     setList(list)
  //   })

  //   return () => socket.off('chatlist')
  // }, [])

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
          const response = await user.find({username})
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
        <section className={styles.chats}>
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
                  receiverName={chat.receiverName}
                  messagePreview={chat.messages[chat.messages.length -1].message}
                  // notification={chat.notification}
                  updatedAt={chat.messages[chat.messages.length -1].createdAt}
                />
              </div>
            ))}
          </div>
        </section>

        <div className={styles.divider} />

        <section className={styles.messenger} >
          <header className={styles.messengerHeader}>
            <Image height={70} width={70} src={onlyIcon} alt="Avatar" />
            <p>{currentConversation && currentConversation[0]?.receiverName}</p>
          </header>

              {console.log(currentConversation)}

          <div className={styles.messageBody}>
            {currentConversation && currentConversation[0]?.messages?.map((message: any) => (
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
                if ((event.ctrlKey) && event.code.toLowerCase() === 'enter' && textareaValue !== '') {
                  setMessages(state => [
                    ...state, { message: String(textareaValue) }
                  ])
                  setTextareaValue('')
                }
              }}
              placeholder='Digite sua mensagem...' autoFocus={true} className={styles.textarea} minRows={1} maxRows={5} />
            <div className={styles.senderButton}>
              <Image height={50} width={50} src={sendButton} alt="Botão de enviar" onClick={() => {
                if (textareaValue !== '') {
                  setMessages(state => [
                    ...state, { message: String(textareaValue) }
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
