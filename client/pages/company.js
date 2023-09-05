import React, { useEffect, useState } from "react"
import Header from "../components/Header"
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import * as yup from 'yup'
import { Box, Button, MenuItem, Modal, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import useUserStore from "../stores/userStore";
import userServices from '../services/users'

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

export default function Company() {
  const companyId = useUserStore((state) => state.companyId)

  const [openModal, setOpenModal] = useState(false)
  const [employees, setEmployees] = useState([])

  useEffect( () => {
    if(companyId){
      const getEmployees = async () => {
        const userJSON = localStorage.getItem('currentEmployee');
        const parsedUser = JSON.parse(userJSON);

        const employeesData = await userServices.getUsers(companyId, parsedUser.token)
        setEmployees(employeesData.data)
      }

      console.log(companyId)
      getEmployees()
    }
  }, [companyId])
  
  const addEmployeeModal = () => {
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
        setOpenModal(false)
        setEmployees([...employees, result.data])
      }
    })
    
    return (
      <Modal
        open={openModal}
        onClose={() => {
          formik.resetForm()
          setOpenModal(false)
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
  
  return (
    <>
      <Header activeTab='company'></Header>

      <div style={{background: "#f5f4f4", height: 760, padding: 25}}>
          <div style={{ height: '100%', background: 'white', width: '60%', padding: 20, borderRadius: 10}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <p className="source-font-bold" style={{ fontWeight: 500, fontSize: 19, margin: 0, color: "#0b0045", marginTop: 5 }}>Employees</p>

              <Button
                className="source-font"
                style={{
                  background: '#0b0045', color: 'white', textTransform:'capitalize'
                }}
                startIcon={<AddIcon></AddIcon>}
                onClick={() => setOpenModal(true)}
              >
                Add Employee
              </Button>
            </div>

            <TableContainer style={{marginTop: 10}}>
              <Table>
                <TableHead style={{background: '#0b0045'}}>
                  <TableRow>
                    <TableCell style={{color:'white'}} className="source-font">Name</TableCell>
                    <TableCell style={{color:'white'}}  className="source-font">Email</TableCell>
                    <TableCell style={{color:'white'}}  className="source-font">Role</TableCell>
                    <TableCell style={{color:'white'}}  className="source-font">Department</TableCell>
                  </TableRow>
                </TableHead>
                
                <TableBody>
                  {employees.map(e => {
                    return (
                      <TableRow key={e.id} >
                        <TableCell component='th' scope="row">{`${e.first_name} ${e.last_name}`}</TableCell>
                        <TableCell component='th' scope="row">{e.email}</TableCell>
                        <TableCell component='th' scope="row">{e.role === 'hrManager' ? "HR Manger" : "Employee"}</TableCell>
                        <TableCell component='th' scope="row">{e.department}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          {addEmployeeModal()}
      </div>
    </>
  )
}
