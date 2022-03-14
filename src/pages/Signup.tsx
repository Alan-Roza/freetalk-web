import React, { useState } from 'react'
import styles from '../../styles/Login.module.scss'
import { onlyIcon, eyeVisible, eyeNotVisible } from '../assets'
import Image from 'next/image'
import { useRouter } from 'next/router'
import signup from '../consumers/signup'
import Swal from 'sweetalert2'

function SignUp() {
  const router = useRouter()

  const [togglePasswordMain, setTogglePasswordMain] = useState(false)
  const [togglePasswordConfirm, setTogglePasswordConfirm] = useState(false)

  const onSubmit = async (values: any) => {
    values.preventDefault();

    console.log(values)

    try {
      const response = await signup.register({
        username: values.target.username.value, 
        password: values.target.password.value,
        passwordConfirm: values.target.passwordConfirm.value
      })
      if (response) {
        router.push('/Signin')
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Sucesso',
          text: response.message,
          showConfirmButton: false,
          timer: 1500
        })
      }
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

      <div className={styles.cardSignup}>
        <div className={styles.logoCard}>
          <Image height={70} width={70} src={onlyIcon} alt="FreeTalk logo marca" />
          <p>FreeTalk</p>
        </div>

        <div className={styles.form}>
          <div className={styles.headerCard}>
            <p className={styles.wellcome}>Seja muito Bem-vindo</p>
            <p className={styles.titleCard}>Para começar, crie seu cadastro</p>
          </div>

          <form name="signup" onSubmit={onSubmit}>
            <div className={styles.field}>
              <label htmlFor="username">Nome do Usuário</label>
              <input placeholder='Digite um nome' id="username" name="username" type="text" />
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Senha</label>
              <div className={styles.inputPassword}>
                <input placeholder='Digite uma senha' type={togglePasswordMain ? 'text' : 'password'} id="password" name="password" />
                <span className={styles.passwordVisibility} onClick={() => setTogglePasswordMain(prev => !prev)}>
                  <Image height={25} width={25} src={togglePasswordMain ? eyeVisible : eyeNotVisible} />
                </span>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="passwordConfirm">Confirmar Senha</label>
              <div className={styles.inputPassword}>
                <input placeholder='Confirme sua senha' type={togglePasswordConfirm ? 'text' : 'password'} id="passwordConfirm" name="passwordConfirm" />
                <span className={styles.passwordVisibility} onClick={() => setTogglePasswordConfirm(prev => !prev)}>
                  <Image height={25} width={25} src={togglePasswordConfirm ? eyeVisible : eyeNotVisible} />
                </span>
              </div>
            </div>

            <input value="Cadastrar" type="submit" className={styles.buttonSubmit} />
          </form>
        </div>

        <p className={styles.switchLog}>Já possui cadastro? <a onClick={() => router.push('/Signin')} tabIndex={0}>Entrar</a></p>
      </div>
    </>
  )
}

export default SignUp