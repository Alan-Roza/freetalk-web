import axios from 'axios'
import { server } from '../config'

const api = axios.create({
  baseURL: server,
  timeout: 30000
})

api.interceptors.response.use(
  (response) => {
    return response
  }, (error) => {
    return Promise.reject(error)
  }
)

api.defaults.headers.post['Content-Type'] = 'application/json'

export default api