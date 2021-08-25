import {API} from '../../commonsVariables'
import axios from 'axios'
      const api = axios.create({
        baseURL:API.BASE_URL_API,
        headers:{Authorization:API.HEADER_AUTHORIZATION_API}
    })
export default api;