import axios from 'axios'

// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// axios.defaults.withCredentials = true
// axios.defaults.crossDomain = true

export default axios.create({
  baseURL: process.env.baseUrl
})
