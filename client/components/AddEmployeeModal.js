import { useFormik } from "formik";
import CheckIcon from '@mui/icons-material/Check';
import { Box, Button, MenuItem, Modal, Select, TextField } from "@mui/material";
import * as yup from 'yup'
import userServices from '../services/users'
import useUserStore from "../stores/userStore";
import { useEffect } from "react";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  p: 3,
};

const addEmployeeValidationSchema = yup.object({
  firstName: yup
    .string("Enter the Employee's First Name")
    .required('First Name is required'),
  lastName: yup
    .string("Enter the Employee's Last Name")
    .required('Last Name is required'),
  email: yup
    .string("Enter the Employee's Company email")
    .email('Enter a valid email')
    .required('Email is required'),
  role: yup
    .string("Enter the Employee's Role email")
    .required('Role is required'),
  password: yup
    .string('Enter your password')
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
});

export default function AddEmployeeModal({ openAddEmployeeModal, setOpenAddEmployeeModal, employees, setEmployees }) {
  const companyId = useUserStore((state) => state.companyId)

  const formik = useFormik({
    initialValues: {
      title: '',
      department: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: addEmployeeValidationSchema,
    onSubmit: async (values) => {
      const userJSON = localStorage.getItem('currentEmployee');
      const parsedUser = JSON.parse(userJSON);
      
      const result = await userServices.addUser(companyId, parsedUser.token, values)
      setOpenAddEmployeeModal(false)
      setEmployees([...employees, result.data])
    }
  })
  
  return (
    <Modal
      open={openAddEmployeeModal}
      onClose={() => {
        formik.resetForm()
        setOpenAddEmployeeModal(false)
      }}
    >
      <Box sx={style}>
        <form onSubmit={formik.handleSubmit} style={{display:'flex', flexWrap:'wrap'}}>
          <div style={{ width: '100%'}}>
            <p className="source-font-bold" style={{ fontSize: 20, margin: 0, marginTop: -5}}>Add Employee</p>
          </div>
                      
          <div style={{width: '49.5%', marginTop: 10}}>              
            <p className="source-font" style={{margin: '10px 0'}}>First Name</p>
            <TextField
              name="firstName"
              placeholder="Enter the Employee's first name"
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
              placeholder="Enter the Employee's last name"
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
              name="email"
              placeholder="Enter the Employee's email"
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
              name="title"
              onChange={formik.handleChange} 
              value={formik?.values?.title} 
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title} 
              size='small' 
              style={{width: '98%'}} 
              placeholder="Enter the Employee's Title"
            />
          </div>

          <div style={{width: '100%', marginTop: 10}}>
            <p className="source-font" style={{margin: '10px 0'}}>Department</p>
            <TextField
              name="department"
              onChange={formik.handleChange} 
              value={formik?.values?.department} 
              error={formik.touched.department && Boolean(formik.errors.department)}
              helperText={formik.touched.department && formik.errors.department} 
              size='small' 
              style={{width: '98%'}} 
              placeholder="Enter the Employee's Department"
            />
          </div>

          <div style={{width: '100%', marginTop: 10}}>
            <p className="source-font" style={{margin: '10px 0'}}>Phone</p>
            <TextField
              name="phone"
              onChange={formik.handleChange} 
              value={formik?.values?.phone} 
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone} 
              size='small' 
              placeholder="Enter the Employee's Phone Number"
              style={{width: '98%'}} 
            />
          </div>

          <div style={{width: '100%', marginTop: 10}}>
            <p className="source-font" style={{margin: '10px 0'}}>Role</p>
            <Select
              name="role"
              onChange={formik.handleChange} 
              value={formik?.values?.role} 
              error={formik.touched.role && Boolean(formik.errors.role)}
              helperText={formik.touched.role && formik.errors.role} 
              size='small' 
              placeholder="Test"
              style={{width: '98%'}} 
            >
              <MenuItem value='employee'>Employee</MenuItem>
              <MenuItem value='hrManager'>HR Manager</MenuItem>
            </Select>
          </div>

          <div style={{width: '49.5%', marginTop: 10}}>
            <p className="source-font" style={{margin: '10px 0'}}>Password</p>
            <TextField
              type='password'
              placeholder="Enter the Employee's Password"
              name="password"
              onChange={formik.handleChange} 
              value={formik?.values?.password} 
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password} 
              size='small' 
              style={{width: '98%'}} 
            />
          </div>

          <div style={{width: '49.5%', marginTop: 10}}>
            <p className="source-font" style={{margin: '10px 0'}}>Confirm Password</p>
            <TextField
              type='password'
              placeholder="Confirm Employee's Password"
              name="confirmPassword"
              onChange={formik.handleChange} 
              value={formik?.values?.confirmPassword} 
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword} 
              size='small' 
              style={{width: '98%'}} 
            />
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