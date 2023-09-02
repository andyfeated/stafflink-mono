import React from "react";
import { Button, TextField} from '@mui/material'
import * as yup from 'yup'
import { useFormik } from 'formik'
import loginServices from '../services/login'
import useUserStore from "../stores/userStore";
import router from 'next/router'

const validationSchema = yup.object({
  email: yup
    .string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string('Enter your password')
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
});


export default function LoginForm({ setActiveTab, setOpenError }){
  const setUser = useUserStore((state) => state.setUser)
  
  const handleSubmitLogin = async (values) => {
    try {
      const result = await loginServices.login(values)
      
      if(result.data){
        setUser({ name: result.data.name, email: result.data.email })
        localStorage.setItem('currentEmployee', JSON.stringify(result.data))
        router.push('/')
      }
    }catch(e){
      setOpenError(true)
      console.log(e)
    }
  }
  
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => handleSubmitLogin(values)
  })
  
  return (
    <div style={{width:'30%', display: 'flex', justifyContent: 'center'}}>
      <div style={{ width: '85%', height: '60%', marginTop: 200}}>
        <p style={{ fontWeight: 700, fontSize: 25}}>Login</p>

        <form onSubmit={formik.handleSubmit} style={{display: 'flex', flexWrap:'wrap', marginTop: 10}}>
          <TextField 
            name="email"
            onChange={formik.handleChange} 
            value={formik?.values?.email} 
            size='small' 
            style={{width: '90%'}} 
            label="Email"
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          ></TextField>

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

          <Button type="submit" style={{
             background: '#0b0045', color: 'white', textTransform:'capitalize', marginTop: 25, width: '90%', borderRadius: 10
          }}>Submit</Button>

          <p style={{color:"#0b0045"}}>Don't have an account yet? <span onClick={() => setActiveTab('register')} style={{color: "#eb4304", cursor:'pointer'}}>
            Sign up
          </span></p>

        </form>
      </div>
    </div>
  )
}