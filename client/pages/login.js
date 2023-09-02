import React, { useEffect, useState } from "react"
import RegisterForm from "../components/RegisterForm"
import LoginForm from '../components/LoginForm'
import { Alert, Snackbar } from "@mui/material"

export default function Login(){
  const [activeTab, setActiveTab] = useState('login')
  const [openSuccess, setOpenSuccess] = useState(false)

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSuccess(false);
  };


  return (
    <div style={{height: 920, display:'flex'}}>
      <div style={{width:'70%', backgroundImage: 'url("bg.jpg")', backgroundSize: 1620  }}>

        <p className="slogan" style={{color: '#e94100', marginLeft: 90, marginTop: 400, fontSize: 50, width: 1000}}>
          Connecting Your Workforce <span style={{color:'white'}}>Seamlessly</span>
        </p>
        
      </div>

      {activeTab === 'login' && (
        <LoginForm setActiveTab={setActiveTab}></LoginForm>
      )}
      
      {activeTab === 'register' && (
        <RegisterForm setActiveTab={setActiveTab} setOpenSuccess={setOpenSuccess}></RegisterForm>
      )}
      
      <Snackbar
        open={openSuccess}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Account was successfully created
        </Alert>
      </Snackbar>
    </div>
  )
}