import { AxiosResponse } from 'axios'
import axios from '../services/api'
import { ConnectionFailed, ErrInternetDisconnected } from './errors'

export interface IRegister {
  username: string
  password: string
  passwordConfirm: string
}

const signup = {
  register: async (data: IRegister) => {
    try {
      const response: AxiosResponse = await axios.post('/register', data)
      return response.data
    } catch (err: any) {
      if (err.name === 'ERR_INTERNET_DISCONNECTED') throw new ErrInternetDisconnected()
      if (!err.response) throw new ConnectionFailed()
      throw err.response.data 
    }
  },
}

export default signup