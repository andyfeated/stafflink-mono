import React, { useEffect, useState } from "react"
import Header from "../components/Header"
import announcementsServices from '../services/announcements'
import attendanceServices from '../services/attendance'
import useUserStore from "../stores/userStore"
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import CheckIcon from "@mui/icons-material/Check"
import CloseIcon from "@mui/icons-material/Close"

export default function Home() {
  const companyId = useUserStore((state) => state.companyId)
  const userId = useUserStore((state) => state.id)
  const userRole = useUserStore((state) => state.role)

  const [announcements, setAnnouncements] = useState([])
  const [employeesAttendance, setEmployeesAttendance] = useState([])
  const [hasTimedIn, setHasTimedIn] = useState(false)
  
  useEffect( () => {
    if(companyId){
      const getAnnouncements = async () => {
        const userJSON = localStorage.getItem('currentEmployee');
        const parsedUser = JSON.parse(userJSON);

        const result = await announcementsServices.getAnnouncements(companyId, parsedUser.token)
        setAnnouncements(result.data)
      }

      getAnnouncements()
    }

    if(companyId && userRole === 'hrManager'){
      const getAttendance = async () => {
        const userJSON = localStorage.getItem('currentEmployee');
        const parsedUser = JSON.parse(userJSON);

        const result = await attendanceServices.attendance(companyId, parsedUser.token)
        setEmployeesAttendance(result.data)
      }

      getAttendance()
    }
  }, [companyId])

  useEffect(() => {
    if(userId && userRole === 'employee'){
      const getHasTimedInFunc = async () => {
        const userJSON = localStorage.getItem('currentEmployee');
        const parsedUser = JSON.parse(userJSON);

        const result = await attendanceServices.getHasTimedIn(userId, parsedUser.id)
        setHasTimedIn(result.data.hasTimedIn)
      }

      getHasTimedInFunc()
    }
  }, [userId])

  const employeeView = () => {
    if(!hasTimedIn){
      return (
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', marginTop: 20}}>
          <p className="source-font" style={{ fontSize: 22}}>You have not timed in yet for today</p>
  
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center'}}>
            <Button
              className="source-font"
              style={{
                width: 150, background: '#0b0045', color: 'white', textTransform:'capitalize'
              }}
              onClick={async () => {
                const userJSON = localStorage.getItem('currentEmployee');
                const parsedUser = JSON.parse(userJSON);

                await attendanceServices.timeIn(userId,companyId,parsedUser.token)

                const result = await attendanceServices.getHasTimedIn(userId, parsedUser.id)
                setHasTimedIn(result.data.hasTimedIn)
              }}
            >
              Time In?
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', marginTop: 20}}>
        <p className="source-font" style={{ fontSize: 22}}>You have already timed in</p>

        <div style={{ width: '100%', display: 'flex', justifyContent: 'center'}}>
          <CheckIcon style={{fontSize: 40}}></CheckIcon>
        </div>
      </div>
    )
  }

  const hrView = () => {
    return (
      <TableContainer style={{marginTop: 10}}>
        <Table>
          <TableHead style={{background: '#0b0045'}}>
            <TableRow>
              <TableCell style={{color:'white'}} className="source-font">Name</TableCell>
              <TableCell style={{color:'white'}}  className="source-font">Department</TableCell>
              <TableCell style={{color:'white'}}  className="source-font">Title</TableCell>
              <TableCell style={{color: 'white'}} className="source-font">Time In Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {employeesAttendance.map(e => {
              return (
                <TableRow key={e.id}>
                  <TableCell component='th' scope="row">{`${e.first_name} ${e.last_name}`}</TableCell>
                  <TableCell component='th' scope="row">{e.department}</TableCell>
                  <TableCell component='th' scope="row">{e.title}</TableCell>
                  <TableCell component='th' scope="row">{e.hasTimedIn ? <CheckIcon style={{marginLeft: 40, color: "#0b0045"}}></CheckIcon> : <CloseIcon style={{marginLeft: 40, color: "#e94100"}}/>}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }
  
  return (
    <div>
      <Header activeTab='dashboard'></Header>

      <div style={{background: "#f5f4f4", height: 760, padding: 25, display: 'flex'}}>
        <div style={{ width: '45%', background: 'white', padding: 20, height: userRole === 'employee' ? 300 : 710 , borderRadius: 10}}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <p className="source-font-bold" style={{ fontWeight: 500, fontSize: 19, margin: 0, color: "#0b0045", marginTop: 5, marginBottom: 10 }}>Attendance</p>
          </div>
          
          {userRole !== 'hrManager' && employeeView()}
          {userRole === 'hrManager' && hrView()}
        </div>
        
        <div style={{ minHeight: 700, background: 'white', width: '50%', padding: 20, borderRadius: 10, marginLeft: 20 }}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <p className="source-font-bold" style={{ fontWeight: 500, fontSize: 19, margin: 0, color: "#0b0045", marginTop: 5, marginBottom: 10 }}>Buletin Board</p>
          </div>

          <div style={{ height: 650, overflowY: 'scroll'}}>
            {announcements?.map(a => {
              return (
                <>
                  <div style={{display:'flex', justifyContent: 'space-between', marginTop: 20}}>
                    <div style={{display:'flex'}}>
                      <p className="source-font" style={{ margin: 0}}>Start Date: {a.start_date}</p>
                      <p className="source-font" style={{ margin: 0, marginLeft: 20}}>End Date: {a.end_date}</p>
                    </div>
                  </div>
                  <div style={{ minHeight: 300, border: 'solid #0b0045 2px', borderRadius: 5, padding: 10, marginBottom: 20, marginTop: 10, height: 200}}>
                    <p className="source-font" style={{ margin: 0}}>{a.text}</p>
                  </div>
                </>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
