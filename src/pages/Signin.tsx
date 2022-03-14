import React, { useState } from 'react'
import styles from '../../styles/Login.module.scss'
import { onlyIcon, eyeVisible, eyeNotVisible } from '../assets'
import Image from 'next/image'
import { useRouter } from 'next/router'
import signin from '../consumers/signin'
const Swal = require('sweetalert2')

function SignIn() {
  const router = useRouter()

  const [togglePassword, setTogglePassword] = useState(false)

  const onSubmit = async (values: any) => {
    values.preventDefault();

    try {
      const response = await signin.login({
        username: values.target.username.value, 
        password: values.target.password.value
      })
      if (response) router.push('/')
      console.log(response)
    } catch(error: any) {
      console.log(error)
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        confirmButtonText: 'Entendi',
        text: error.message
      })
    }
  }

  return (
    <>
      <div className={styles.background} />

      <div className={styles.logo}>
        <Image height={70} width={70} src={onlyIcon} alt="FreeTalk logo marca" />
        <p>FreeTalk</p>
      </div>

      <div className={styles.card}>
        <div className={styles.logoCard}>
          <Image height={70} width={70} src={onlyIcon} alt="FreeTalk logo marca" />
          <p>FreeTalk</p>
        </div>

        <div className={styles.form}>
          <div className={styles.headerCard}>
            <p className={styles.wellcome}>Bem-vindo de volta</p>
            <p className={styles.titleCard}>Faça login na sua conta</p>
          </div>

          <form name="signin" onSubmit={onSubmit}>
            <div className={styles.field}>
              <label htmlFor="username">Nome do Usuário</label>
              <input placeholder='Digite o seu usuário' id="username" name="username" type="text" />
            </div>
            <div className={styles.field}>
              <label htmlFor="password">Senha</label>
              <div className={styles.inputPassword}>
                <input placeholder='Digite sua senha' type={togglePassword ? 'text' : 'password'} id="password" name="password" />
                <span className={styles.passwordVisibility} onClick={() => setTogglePassword(prev => !prev)}>
                  <Image height={25} width={25} src={togglePassword ? eyeVisible : eyeNotVisible} />
                </span>
              </div>
            </div>

            <input value="Acessar" type="submit" className={styles.buttonSubmit} />
          </form>
        </div>

        <p className={styles.switchLog}>Ainda não é registrado? <a onClick={() => router.push('/Signup')} tabIndex={0}>Registrar</a></p>
      </div>
    </>
  )
}

export default SignIn