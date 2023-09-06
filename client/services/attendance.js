import axios from "axios";
import { baseUrl } from "./users";

const apiUrl = `${baseUrl}/api/attendance`

const getHasTimedIn = (id, token) => {
  const request = axios.get(`${apiUrl}/hasTimedIn/${id}`, { headers: {Authorization: token}})
  return request
}

const timeIn = (id, companyId, token) => {
  const request = axios.post(`${apiUrl}/timeIn/${id}`, { companyId: companyId } ,{ headers: {Authorization: token}})
  return request
}

const attendance = (companyId, token) => {
  const request = axios.get(`${apiUrl}?companyId=${companyId}`, { headers: {Authorization:token}})
  return request
}

export default { getHasTimedIn, timeIn, attendance }