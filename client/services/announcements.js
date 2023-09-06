import axios from "axios";
import { baseUrl } from "./users";

const apiUrl = `${baseUrl}/api/announcements`

const addAnnouncement = (values, token) => {
  const request = axios.post(apiUrl, values, { headers: {Authorization: token}})
  return request
}

const getAnnouncements = (companyId, token) => {
  const request = axios.get(`${apiUrl}?companyId=${companyId}`, { headers: {Authorization: token}})
  return request
}

const deleteAnnouncement = (id, token) => {
  const request = axios.delete(`${apiUrl}/${id}`, { headers: { Authorization: token }})
  return request
}

export default { addAnnouncement, getAnnouncements, deleteAnnouncement }