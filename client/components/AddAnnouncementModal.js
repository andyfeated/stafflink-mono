import { Box, Button, Modal, TextField, TextareaAutosize } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import * as yup from 'yup'
import CheckIcon from '@mui/icons-material/Check'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import useUserStore from "../stores/userStore";
import announcementServices from '../services/announcements'


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  p: 3,
};

const announcemnetValidationSchema = yup.object({
  content: yup
    .string("Enter Content")
    .required('Announcement Content is required'),
});

export default function AddAnnouncementModal({ setAddOpenAnnouncementModal, openAddAnnouncementModal, announcements, setAnnouncements }){
  const companyId = useUserStore((state) => state.companyId)
  
  const formik = useFormik({
    initialValues: {
      start_date: null,
      end_date: null,
      content: '',
    },
    validationSchema: announcemnetValidationSchema,
    onSubmit: async (values) => {
      const input = {
        text: values.content,
        start_date: dayjs(values.start_date).format('YYYY-MM-DD'),
        end_date: dayjs(values.end_date).format('YYYY-MM-DD'),
        company_id: companyId,
      }

      const userJSON = localStorage.getItem('currentEmployee');
      const parsedUser = JSON.parse(userJSON);

      await announcementServices.addAnnouncement(input, parsedUser.token)
      const result = await announcementServices.getAnnouncements(companyId, parsedUser.token)

      setAnnouncements(result.data)
      setAddOpenAnnouncementModal(false)
    }
  })

  return (
    <Modal
      open={openAddAnnouncementModal}
      onClose={() => {
        formik.resetForm()
        setAddOpenAnnouncementModal(false)
      }}
    >
      <Box sx={style}>
        <form onSubmit={formik.handleSubmit} style={{display: 'flex', flexWrap: 'wrap'}}>
          <div style={{ width: '100%'}}>
            <p className="source-font-bold" style={{ fontSize: 20, margin: 0, marginTop: -5}}>Add Announcement</p>
          </div>
          
          <div style={{width: '100%', marginTop: 10}}>              
            <p className="source-font" style={{margin: '10px 0'}}>Content</p>
            <TextField
              name="content"
              placeholder="Enter Content"
              onChange={formik.handleChange} 
              value={formik?.values?.content} 
              error={formik.touched.content && Boolean(formik.errors.content)}
              helperText={formik.touched.content && formik.errors.content} 
              size='small' 
              style={{width: '98%'}} 
              multiline
              rows={8}
            />
          </div>

          <div style={{width: '50%', marginTop: 10}}>              
            <p className="source-font" style={{margin: '10px 0'}}>Start Date</p>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                name="start_date"
                value={formik.values.start_date}
                onChange={(date) => formik.setFieldValue('start_date', date)}
                autoOk
                sx={{width: 350}}
              />
            </LocalizationProvider>
          </div>

          <div style={{width: '50%', marginTop: 10}}>              
            <p className="source-font" style={{margin: '10px 0'}}>End Date</p>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                name="end_date"
                value={formik.values.end_date}
                onChange={(date) => formik.setFieldValue('end_date', date)}
                autoOk
                sx={{width: 350}}
              />
            </LocalizationProvider>
          </div>

          <div style={{ width: '100%', display:'flex', justifyContent: 'end'}}>
            <Button
              className="source-font"
              style={{
                background: '#0b0045', color: 'white', textTransform:'capitalize', marginTop: 25, width: '20', marginRight: 10
              }}
              startIcon={<CheckIcon></CheckIcon>}
              type="submit"
            >
              Submit
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  )
}