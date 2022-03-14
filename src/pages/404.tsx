import Head from 'next/head'
import Link from 'next/link'
import styles from '../../styles/Error.module.scss'

export default function FourOhFour() {
  return <>
    <Head>
      <title>404 - FreeTalk</title>
      <meta name="description" content="Abertura de conta digital" />
      <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    
    <h1 className={styles.title}>404 - Erro na Página</h1>
    <p className={styles.zoomArea}>A página que você está tentando acessar <b>não existe</b> </p>
    <section className={styles.errorContainer}>
      <span className={styles.four}><span className={styles.screenReaderText}>4</span></span>
      <span className={styles.zero}><span className={styles.screenReaderText}>0</span></span>
      <span className={styles.four}><span className={styles.screenReaderText}>4</span></span>
    </section>
    <div className={styles.linkContainer}>
      <Link href="/">
        <a className={styles.moreLink}>Volte para a página principal</a>
      </Link>
    </div>
  </>
}