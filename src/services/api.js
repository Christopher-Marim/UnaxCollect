import axios from 'axios'
      const api = axios.create({
        baseURL:'https://proton.etm.ltda',
        headers:{Authorization:''}
    })
export default api;