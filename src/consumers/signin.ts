import { AxiosResponse } from 'axios'
import axios from '../services/api'
import { ConnectionFailed, ErrInternetDisconnected } from './errors'

export interface ILogin {
  username: string
  password: string
}

const signin = {
  login: async (data: ILogin) => {
    try {
      const response: AxiosResponse = await axios.post('/login', data)
      return response.data
    } catch (err: any) {
      if (err.name === 'ERR_INTERNET_DISCONNECTED') throw new ErrInternetDisconnected()
      if (!err.response) throw new ConnectionFailed()
      throw err.response.data 
    }
  },
}

export default signin