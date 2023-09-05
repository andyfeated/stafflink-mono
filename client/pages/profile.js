import React, { useEffect, useState } from "react"
import Header from "../components/Header"
import userServices from '../services/users';
import * as yup from 'yup'
import { useFormik } from "formik";
import EditIcon from '@mui/icons-material/Edit';
import useUserStore from "../stores/userStore";
import { Alert, Button, Snackbar, TextField } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';

const validationSchema = yup.object({
  firstName: yup
    .string('Enter your First Name')
    .required('First Name is required'),
  lastName: yup
    .string('Enter your Last Name')
    .required('Last Name is required'),
  email: yup
    .string('Enter your Company email')
    .email('Enter a valid email')
    .required('Email is required'),
});

export default function Profile() {
  const userId = useUserStore((state) => state.id)
  const [editProfile, setEditProfile] = useState(false)
  const [openSuccess, setOpenSuccess] = useState(false)

  const handleUpdateUser = async (values) => {
    const userJSON = localStorage.getItem('currentEmployee');
    const parsedUser = JSON.parse(userJSON);

    await userServices.updateUser(userId, parsedUser.token, values)
    setOpenSuccess(true)
    setEditProfile(false)
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSuccess(false);
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      department: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => handleUpdateUser(values),
  })

  useEffect(() => {
    const getEmployeeData = async () => {
      const userJSON = localStorage.getItem('currentEmployee');
      const parsedUser = JSON.parse(userJSON);
      
      const result = await userServices.getUser(userId, parsedUser.token)
      if (result.data) {
        formik.setValues({
          firstName: result.data.first_name,
          lastName: result.data.last_name,
          email: result.data.email,
          phone: result.data.phone,
          role: result.data.role === 'hrManager' ? "HR Manager" : "Employee",
          title: result.data.title,
          department: result.data.department
        })
      }
    }

    if(userId){
      getEmployeeData()
    }
  }, [userId])
  
  return (
    <>
      <Header activeTab='profile'></Header>

      <div style={{background: "#f5f4f4", height: 760, padding: 25}}>
        <div style={{ height: '100%', background: 'white', width: '60%', padding: 20, borderRadius: 10}}>
          <p className="source-font-bold" style={{ fontWeight: 500, fontSize: 19, margin: 0, color: "#0b0045", marginTop: 5 }}>Profile</p>

          <form onSubmit={formik.handleSubmit} style={{display:'flex', flexWrap:'wrap'}}>
            <div style={{width: '49.5%', marginTop: 10}}>
              <p className="source-font" style={{margin: '10px 0'}}>First Name</p>
              <TextField
                disabled={!editProfile}
                name="firstName"
                onChange={formik.handleChange} 
                value={formik?.values?.firstName} 
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName} 
                size='small' 
                style={{width: '98%'}} 
              />
            </div>

            <div style={{width: '49.5%', marginTop: 10}}>
              <p className="source-font" style={{margin: '10px 0'}}>Last Name</p>
              <TextField
                disabled={!editProfile}
                name="lastName"
                onChange={formik.handleChange} 
                value={formik?.values?.lastName} 
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName} 
                size='small' 
                style={{width: '98%'}} 
              />
            </div>

            <div style={{width: '100%', marginTop: 10}}>
              <p className="source-font" style={{margin: '10px 0'}}>Company Email</p>
              <TextField
                disabled={!editProfile}
                name="email"
                onChange={formik.handleChange} 
                value={formik?.values?.email} 
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email} 
                size='small' 
                style={{width: '98%'}} 
              />
            </div>

            <div style={{width: '100%', marginTop: 10}}>
              <p className="source-font" style={{margin: '10px 0'}}>Title</p>
              <TextField
                disabled={!editProfile}
                name="title"
                onChange={formik.handleChange} 
                value={formik?.values?.title} 
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title} 
                size='small' 
                style={{width: '98%'}} 
                placeholder="Enter your Title"
              />
            </div>

            <div style={{width: '100%', marginTop: 10}}>
              <p className="source-font" style={{margin: '10px 0'}}>Department</p>
              <TextField
                disabled={!editProfile}
                name="department"
                onChange={formik.handleChange} 
                value={formik?.values?.department} 
                error={formik.touched.department && Boolean(formik.errors.department)}
                helperText={formik.touched.department && formik.errors.department} 
                size='small' 
                style={{width: '98%'}} 
                placeholder="Enter your Department"
              />
            </div>

            <div style={{width: '100%', marginTop: 10}}>
              <p className="source-font" style={{margin: '10px 0'}}>Phone</p>
              <TextField
                disabled={!editProfile}
                name="phone"
                onChange={formik.handleChange} 
                value={formik?.values?.phone} 
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone} 
                size='small' 
                placeholder="Enter your Phone Number"
                style={{width: '98%'}} 
              />
            </div>

            <div style={{width: '100%', marginTop: 10}}>
              <p className="source-font" style={{margin: '10px 0'}}>Role</p>
              <TextField
                disabled
                name="role"
                onChange={formik.handleChange} 
                value={formik?.values?.role} 
                error={formik.touched.role && Boolean(formik.errors.role)}
                helperText={formik.touched.role && formik.errors.role} 
                size='small' 
                style={{width: '98%'}} 
              />
            </div>

            <div style={{display: 'flex', justifyContent: 'end', width:'100%'}}>
              {editProfile && (
                <>
                  <Button 
                    className="source-font"
                    style={{
                      background: '#0b0045', color: 'white', textTransform:'capitalize', marginTop: 25, width: '20', marginRight: 10
                    }}
                    startIcon={<CheckIcon></CheckIcon>}
                    type="submit"
                  >
                    Save Changes
                  </Button>

                  <Button 
                    className="source-font"
                    startIcon={<CancelIcon></CancelIcon>}
                    style={{
                      background: '#e94100', color: 'white', textTransform:'capitalize', marginTop: 25, width: '20', marginRight: 20
                    }}
                    onClick={() => setEditProfile(false)}
                  >
                    Cancel
                  </Button>
                </>
              )}

              {!editProfile && (
                <>
                  <Button 
                    className="source-font"
                    startIcon={<EditIcon></EditIcon>}
                    style={{
                      background: '#0b0045', color: 'white', textTransform:'capitalize', marginTop: 25, width: '20', marginRight: 20
                    }}
                    onClick={() => setEditProfile(true)}
                  >
                    Edit Profile
                  </Button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>

      <Snackbar
        open={openSuccess}
        autoHideDuration={3000}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
        onClose={handleClose}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Profile was successfully updated
        </Alert>
      </Snackbar>
    </>
  )
}
