import axios, { AxiosRequestConfig } from 'axios'
import { server } from '../config'
import { getToken } from '../utils/localStorage'

const api = axios.create({
  baseURL: server,
  timeout: 30000
})

api.defaults.headers.post['Content-Type'] = 'application/json'

function setBearerToken() {
  api.interceptors.request.use(async (config: AxiosRequestConfig) => {
    const token = getToken()

    if (config?.headers && token) {
      config.headers.Authorization = 'Bearer ' + token
    }
    return config
  }, error => Promise.reject(error))
}

setBearerToken()

api.interceptors.response.use(
  (response) => {
    return response
  }, (error) => {
    return Promise.reject(error)
  }
)

api.defaults.headers.post['Content-Type'] = 'application/json'

export default api