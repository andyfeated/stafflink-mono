import React from "react";
import { Button, TextField} from '@mui/material'
import * as yup from 'yup'
import { useFormik } from "formik";
import userServices from '../services/users';


const validationSchema = yup.object({
  companyName: yup
    .string('Enter your Company Name')
    .required('Company Name is required'),
  websiteUrl: yup
    .string('Enter your Website URL')
    .required('Website URL is required'),
  firstName: yup
    .string('Enter your First Name')
    .required('First Name is required'),
  lastName: yup
    .string('Enter your Last Name')
    .required('Last Name is required'),
  companyEmail: yup
    .string('Enter your Company email')
    .email('Enter a valid email')
    .required('Email is required'),
  phone: yup
    .string('Enter your Phone number')
    .required('Phone number is required'),
  password: yup
    .string('Enter your password')
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
});


export default function RegisterForm({ setActiveTab, setOpenSuccess }){
  
  const handleSubmitRegister = async (values) => {
    try {
      const result = await userServices.signUp(values)
      
      if (result.data.newEmployee) {
        setOpenSuccess(true)
        setActiveTab('login')
      }
    }catch(e){
      console.log(e)
    }
  }
    
  const formik = useFormik({
    initialValues: {
      companyName: '',
      websiteUrl: '',
      firstName: '',
      lastName: '',
      companyEmail: '',
      phone: '',
      confirmPassword: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => handleSubmitRegister(values),
  })
  
  return (
    <div style={{width:'30%', display: 'flex', justifyContent: 'center'}}>
      <div style={{ width: '85%', height: '60%', marginTop: 200}}>
        <p style={{ fontWeight: 700, fontSize: 25}}>Register</p>

        <form onSubmit={formik.handleSubmit} noValidate style={{display: 'flex', flexWrap:'wrap', marginTop:10}}>
          <TextField 
            name="companyName"
            onChange={formik.handleChange} 
            value={formik?.values?.companyName} 
            error={formik.touched.companyName && Boolean(formik.errors.companyName)}
            helperText={formik.touched.companyName && formik.errors.companyName}
            size='small' 
            style={{width: '90%'}} 
            label="Company Name"
          />
          <TextField 
            name="websiteUrl"
            onChange={formik.handleChange} 
            value={formik?.values?.websiteUrl} 
            error={formik.touched.websiteUrl && Boolean(formik.errors.websiteUrl)}
            helperText={formik.touched.websiteUrl && formik.errors.websiteUrl}
            size='small' 
            style={{width: '90%', marginTop: 15}} 
            label="Website URL"
          />

          <TextField 
            name="firstName"
            onChange={formik.handleChange} 
            value={formik?.values?.firstName} 
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName} 
            size='small' 
            style={{width: '43.5%', marginTop: 20}} 
            label="First Name"
          />
          <TextField
            name="lastName"
            onChange={formik.handleChange} 
            value={formik?.values?.lastName} 
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}   
            size='small' 
            style={{width: '43.5%', marginTop: 20, marginLeft: 10}} 
            label="Last Name"
          />
          <TextField 
            name="phone"
            onChange={formik.handleChange} 
            value={formik?.values?.phone} 
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}     
            size='small' 
            style={{width: '90%', marginTop: 15}} 
            label="Phone Number"
          />
          <TextField 
            name="companyEmail"
            onChange={formik.handleChange} 
            value={formik?.values?.companyEmail} 
            error={formik.touched.companyEmail && Boolean(formik.errors.companyEmail)}
            helperText={formik.touched.companyEmail && formik.errors.companyEmail}     
            size='small' 
            style={{width: '90%', marginTop: 15}} 
            label="Work Email"
          />
          <TextField 
            name="password" 
            onChange={formik.handleChange} 
            value={formik?.values?.password} 
            type="password" 
            size='small' 
            style={{width: '90%', marginTop: 15}} 
            label="Password"
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          ></TextField>
          <TextField 
            name="confirmPassword" 
            onChange={formik.handleChange} 
            value={formik?.values?.confirmPassword} 
            type="password" 
            size='small' 
            style={{width: '90%', marginTop: 15}} 
            label="Confirm Password"
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
          ></TextField>

          <Button type="submit" style={{
             background: '#0b0045', color: 'white', textTransform:'capitalize', marginTop: 25, width: '90%', borderRadius: 10
          }}>Submit</Button>

          <p style={{color:"#0b0045"}}>Already have an account? <span onClick={() => setActiveTab('login')} style={{color: "#eb4304", cursor:'pointer'}}>
            Log in
          </span></p>

        </form>
      </div>
    </div>
  )
}