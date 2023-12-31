import React, { useEffect, useState } from "react"
import Header from "../components/Header"
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, IconButton, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import useUserStore from "../stores/userStore";
import userServices from '../services/users'
import companyServices from '../services/companies'
import UpdateEmployeeModal from "../components/UpdateEmployeeModal";
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';
import AddEmployeeModal from "../components/AddEmployeeModal";
import * as yup from 'yup'
import { useFormik } from "formik";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  p: 3,
};

const validationSchema = yup.object({
  name: yup
    .string('Enter Company Name')
    .required('Company Name is required'),
  websiteUrl: yup
    .string('Enter Company Website URL')
    .required('Website URL is required'),
});

export default function Company() {
  const companyId = useUserStore((state) => state.companyId)
  const userId = useUserStore((state) => state.id)

  const [openAddEmployeeModal, setOpenAddEmployeeModal] = useState(false)
  const [openUpdateEmployeeModal, setOpenUpdateEmployeeModal] = useState(false)
  const [openDeleteEmployeeModal, setOpenDeleteEmployeeModal] = useState(false)
  const [employees, setEmployees] = useState([])

  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [editCompany, setEditCompany] = useState(false)

  const formik = useFormik({
    initialValues: {
      name: '',
      websiteUrl: ''
    },
    validationSchema: validationSchema,
    onSubmit: async ({ id, ...rest}) => {
      const userJSON = localStorage.getItem('currentEmployee');
      const parsedUser = JSON.parse(userJSON);

      await companyServices.updateCompany(companyId, parsedUser.token, rest)
      setEditCompany(false)
    },
  })

  useEffect( () => {
    if(companyId){
      const getEmployeesAndCompany = async () => {
        const userJSON = localStorage.getItem('currentEmployee');
        const parsedUser = JSON.parse(userJSON);

        const employeesData = await userServices.getUsers(companyId, parsedUser.token)
        const companyData = await companyServices.getCompany(companyId, parsedUser.token)
        
        setEmployees(employeesData.data)
        formik.setValues(companyData.data)
      }

      getEmployeesAndCompany()
    }
  }, [companyId])

  useEffect(() => {
    console.log(selectedEmployee)
  }, [selectedEmployee])

  const handleClickUpdateEmployee = (emp) => {
    setSelectedEmployee(emp)
    setOpenUpdateEmployeeModal(true)
  }

  const handleClickDeleteEmployee = (emp) => {
    setSelectedEmployee(emp)
    setOpenDeleteEmployeeModal(true)
  }

  const handleCloseDeleteEmployee = () => {
    setSelectedEmployee(null)
    setOpenDeleteEmployeeModal(false)
  }

  const handleSubmitDeleteEmployee = async () => {
    const userJSON = localStorage.getItem('currentEmployee');
    const parsedUser = JSON.parse(userJSON);

    const result = await userServices.deleteUser(selectedEmployee.id, parsedUser.token)
    if(result.status === 200) {
      const newEmployees = employees.filter(e => e.id !== selectedEmployee.id)
      setEmployees(newEmployees)
      setSelectedEmployee(null)
      setOpenDeleteEmployeeModal(false)
    }
  }
  
  return (
    <>
      <Header activeTab='company'></Header>

      <div style={{background: "#f5f4f4", height: 760, padding: 25, display:'flex'}}>
          <div style={{ height: '100%', background: 'white', width: '60%', padding: 20, borderRadius: 10}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <p className="source-font-bold" style={{ fontWeight: 500, fontSize: 19, margin: 0, color: "#0b0045", marginTop: 5 }}>Employees</p>

              <Button
                className="source-font"
                style={{
                  background: '#0b0045', color: 'white', textTransform:'capitalize'
                }}
                startIcon={<AddIcon></AddIcon>}
                onClick={() => setOpenAddEmployeeModal(true)}
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
                    <TableCell style={{color:'white'}}  className="source-font">Title</TableCell>
                    <TableCell style={{color:'white'}}  className="source-font">Actions</TableCell>
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
                        <TableCell component='th' scope="row">{e.title}</TableCell>
                        <TableCell component='th' scope="row">
                          <div>
                            <IconButton aria-label="delete" onClick={() => handleClickUpdateEmployee(e)}>
                              <EditIcon style={{fontSize: 19, color: "#0b0045"}} />
                            </IconButton>
                            {e.id !== userId && (
                              <IconButton onClick={() => handleClickDeleteEmployee(e)} aria-label="delete">
                                <DeleteIcon style={{fontSize: 19, color: "#eb4304"}} />
                              </IconButton>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          <AddEmployeeModal 
            employees={employees} 
            setEmployees={setEmployees} 
            openAddEmployeeModal={openAddEmployeeModal} 
            setOpenAddEmployeeModal={setOpenAddEmployeeModal} 
          />
          <UpdateEmployeeModal 
            selectedEmployee={selectedEmployee} 
            setSelectedEmployee={setSelectedEmployee}
            openUpdateEmployeeModal={openUpdateEmployeeModal} 
            setOpenUpdateEmployeeModal={setOpenUpdateEmployeeModal}
            employees={employees}
            setEmployees={setEmployees}
          />

          <Modal
            open={openDeleteEmployeeModal}
            onClose={handleCloseDeleteEmployee}
          >
            <Box sx={style}>
              <div style={{ width: '100%'}}>
                <p className="source-font-bold" style={{ fontSize: 20, margin: 0, marginTop: -5}}>Remove Employee</p>
              </div>

              <p style={{ marginTop: 20}}>Are you sure you want to remove this employee?</p>

              <div style={{ width: '100%', display:'flex', justifyContent: 'end'}}>
                <Button
                  onClick={handleSubmitDeleteEmployee}
                  className="source-font"
                  style={{
                    background: '#0b0045', color: 'white', textTransform:'capitalize',width: '20', marginRight: 10
                  }}
                >
                  Yes
                </Button>
              </div>
            </Box>
          </Modal>

          <div style={{ height: '50%', background: 'white', width: '40%', padding: 20, borderRadius: 10, marginLeft: 20}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <p className="source-font-bold" style={{ fontWeight: 500, fontSize: 19, margin: 0, color: "#0b0045", marginTop: 5 }}>Company Details</p>
            </div>


            <form onSubmit={formik.handleSubmit} style={{display:'flex', flexWrap:'wrap'}}>
              <div style={{width: '100%', marginTop: 10}}>
                <p className="source-font" style={{margin: '10px 0'}}>Company Name</p>
                <TextField
                  disabled={!editCompany}
                  name="name"
                  onChange={formik.handleChange} 
                  value={formik?.values?.name} 
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name} 
                  size='small' 
                  style={{width: '98%'}} 
                />
              </div>

              <div style={{width: '100%', marginTop: 10}}>
                <p className="source-font" style={{margin: '10px 0'}}>Website URL</p>
                <TextField 
                  disabled={!editCompany}
                  name="websiteUrl"
                  onChange={formik.handleChange} 
                  value={formik?.values?.websiteUrl} 
                  error={formik.touched.websiteUrl && Boolean(formik.errors.websiteUrl)}
                  helperText={formik.touched.websiteUrl && formik.errors.websiteUrl} 
                  size='small' 
                  style={{width: '98%'}} 
                />
              </div>

              <div style={{display: 'flex', justifyContent: 'end', width: '100%', marginTop: 40}}>
                {!editCompany && (
                  <Button
                    className="source-font"
                    style={{
                      background: '#0b0045', color: 'white', textTransform:'capitalize'
                    }}
                    startIcon={<EditIcon></EditIcon>}
                    onClick={() => setEditCompany(true)}
                  >
                    Edit Company
                  </Button>
                )}

                {editCompany && (
                  <div style={{display: 'flex'}}>
                    <Button 
                      className="source-font"
                      startIcon={<CancelIcon></CancelIcon>}
                      style={{
                        background: '#e94100', color: 'white', textTransform:'capitalize', marginRight: 10
                      }}
                      onClick={() => setEditCompany(false)}
                    >
                      Cancel
                    </Button>

                    <Button 
                      type="submit"
                      className="source-font"
                      startIcon={<CheckIcon></CheckIcon>}
                      style={{
                        background: '#0b0045', color: 'white', textTransform:'capitalize'
                      }}
                    >
                      Save
                    </Button>
                  </div>
                )}
              </div>
            </form>
          </div>
      </div>
    </>
  )
}
