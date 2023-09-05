import axios from "axios";

export const baseUrl = process.env.NEXT_PUBLIC_LOCAL_SERVER_BASE_URL;

const apiUrl = `${baseUrl}/api/users`

const signUp = (values) => {
  const request = axios.post(`${apiUrl}/register`, values)
  return request;
}

const getUser = (id, token) => {
  const request = axios.get(`${apiUrl}/${id}`, { headers: { Authorization: token }})
  return request
}

const getUsers = (companyId, token) => {
  const request = axios.get(`${apiUrl}?companyId=${companyId}`, { headers: {Authorization: token}})
  return request
}

const addUser = (companyId, token, values) => {
  const request = axios.post(apiUrl, { ...values, companyId }, { headers: { Authorization: token }})
  return request
}

const updateUser = (id, token, values) => {
  const request = axios.put(`${apiUrl}/${id}`, values, { headers: { Authorization: token }})
  return request
}

const deleteUser = (id, token) => {
  const request = axios.delete(`${apiUrl}/${id}`, { headers: { Authorization: token }})
  return request
}

export default { signUp, getUser, getUsers, addUser, updateUser, deleteUser }