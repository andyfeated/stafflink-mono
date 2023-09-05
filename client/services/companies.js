import axios from "axios";
import { baseUrl } from "./users";

const apiUrl = `${baseUrl}/api/companies`

const getCompany = (id, token) => {
  const request = axios.get(`${apiUrl}/${id}`, { headers: { Authorization: token }})
  return request
}

const updateCompany = (id, token, values) => {
  const request = axios.put(`${apiUrl}/${id}`, values, {headers: {Authorization: token}})
  return request
}

export default { getCompany, updateCompany }