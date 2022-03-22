import { AxiosResponse } from 'axios'
import axios from '../services/api'
import { ConnectionFailed, ErrInternetDisconnected } from './errors'

export interface IUser {
  username: string
}

const user = {
  find: async (data: IUser) => {
    try {
      const response: AxiosResponse = await axios.post('/user', data)
      return response.data
    } catch (err: any) {
      if (err.name === 'ERR_INTERNET_DISCONNECTED') throw new ErrInternetDisconnected()
      if (!err.response) throw new ConnectionFailed()
      throw err.response.data 
    }
  },
}

export default user