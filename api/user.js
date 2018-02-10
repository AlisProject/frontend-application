import axios from '~/plugins/axios'

export function getUserInfo({ userId }) {
  return axios.get(`/users/${userId}`).then((response) => response.data)
}
