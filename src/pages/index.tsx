import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'
import { plus } from '../assets'
import CardChat from '../components/CardChat'

const mockData = [
  { name: 'Sara Roza', messagePreview: 'Eu estou tocando', notification: false, updateAt: 'Agora' },
  { name: 'Alan Roza', messagePreview: 'Eu estou estudando', notification: false, updateAt: '5:00AM' },
  { name: 'Júlia Roza', messagePreview: 'Eu estou indo para a escola', notification: false, updateAt: 'Ontem' }
]

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>FreeTalk</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        <meta name="description" content="Talk with any people anywhere" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <section className={styles.chats}>
          <div className={styles.header}>
            <p>Meus Chats</p>
            <div className={styles.plusButton}>
              <Image height={'15px'} src={plus} alt="Sinal de mais" />
            </div>
          </div>
          {mockData.map((chat, index) => (
            <div className={styles.eachChat} key={index}>
              <CardChat
                name={chat.name}
                messagePreview={chat.messagePreview}
                notification={chat.notification}
                updateAt={chat.updateAt}
              />
            </div>
          ))}

        </section>

        <div className={styles.divider} />

        <section></section>
      </main>
    </div>
  )
}

export default Home
