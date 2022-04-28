import { AxiosResponse } from 'axios'
import axios from '../services/api'
import { ConnectionFailed, ErrInternetDisconnected } from './errors'

const authentication = {
  refreshToken: async () => {
    try {
      const response: AxiosResponse = await axios.get('/refreshToken')
      return response.data.data
    } catch (err: any) {
      if (err.name === 'ERR_INTERNET_DISCONNECTED') throw new ErrInternetDisconnected()
      if (!err.response) throw new ConnectionFailed()
      throw err.response.data 
    }
  },
}

export default authentication