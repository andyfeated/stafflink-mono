import React, { useState } from "react";
import { Avatar, Menu, MenuItem } from "@mui/material";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import useUserStore from "../stores/userStore";
import moment from 'moment'
import { useRouter } from 'next/router'
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import TaskIcon from '@mui/icons-material/Task';
import BusinessIcon from '@mui/icons-material/Business';


export default function Header({ activeTab }){
  const setUser = useUserStore((state) => state.setUser)
  const userName = useUserStore((state) => state.name)
  const userRole = useUserStore((state) => state.role)

  const [anchorEl, setAnchorEl] = useState(null);
  
  const open = Boolean(anchorEl);
  const router = useRouter()

  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setUser({ name: '', email: '', id: null, role: ''});
    localStorage.removeItem('currentEmployee');
    router.push('/login')
  };

  const handleClickPage = (page) => {
    router.push(`/${page}`)
  }
  
  return (
    <>
      <div style={{background: '#0b0045', height: 75, display:'flex', padding: '10px 20px', justifyContent: 'space-between'}}>
        <div style={{display:'flex'}}>
          <span style={{fontSize: 25, marginTop: 13, marginRight: 5, color: "#e94100", fontWeight: 500}}>Ω</span>
          <p className='slogan' style={{ color: '#e94100', fontSize: 17}}> STAFF<span style={{color:"white"}}>link</span></p>
        </div>

        <div style={{display: 'flex'}}>
          <div style={{display:'flex'}}>
            <CalendarMonthIcon style={{color: 'white', marginTop: 15, marginRight: 8}}></CalendarMonthIcon>
            <p className="source-font" style={{ color: 'white', fontSize: 14, marginRight: 30, marginTop: 18}}>{moment(new Date).format('ddd, DD MMM YYYY')}</p>
          </div>
          
          <div>
            <p className="source-font" style={{ color: 'white', fontSize: 15, margin: '10px 20px 0 0'}}>{userName}</p>
            <p className="source-font" style={{color: 'white', margin:0, fontSize: 13, opacity: 0.7}}>{userRole === 'hrManager' ? "HR Manager" : "Employee"}</p>
          </div>

          <div onClick={handleClickMenu} style={{ cursor: 'pointer', display: 'flex'}}>
            <Avatar sx={{bgcolor: '#e94100'}} style={{marginTop: 10, width: 35, height: 35, fontSize: 15}}>{userName[0]}</Avatar>
            <ArrowDropDownIcon style={{color: 'white', marginTop: 15, marginLeft: 5}}></ArrowDropDownIcon>
          </div>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </div>

      

      <div style={{ background: '#0b0045', height: 80, margin: 0, padding: '0 15px', display: 'flex', gap: 10}}>
        <div onClick={() => handleClickPage('')}  style={{ width: 120, padding: 10, cursor: 'pointer', background: activeTab === 'dashboard' ? "#e94100" : '', borderRadius: '10px 10px 0 0' }}>
          <DashboardIcon style={{color: 'white', fontSize: 25,}}></DashboardIcon>
          <p className="source-font" style={{ color: 'white', margin: 0}}>Dashboard</p>
        </div>
        <div onClick={() => handleClickPage('profile')}  style={{ width: 120, padding: 10, cursor: 'pointer', background: activeTab === 'profile' ? "#e94100" : '', borderRadius: '10px 10px 0 0'  }}>
          <PersonIcon style={{color: 'white', fontSize: 25}}></PersonIcon>
          <p className="source-font" style={{ color: 'white', margin: 0}}>Profile</p>
        </div>
       {userRole === 'hrManager' && (
        <>
          <div onClick={() => handleClickPage('company')} style={{ width: 120, padding: 10, cursor: 'pointer', background: activeTab === 'company' ? "#e94100" : '', borderRadius: '10px 10px 0 0'  }}>
            <BusinessIcon style={{color: 'white', fontSize: 25}}></BusinessIcon>
            <p className="source-font" style={{ color: 'white', margin: 0}}>Company</p>
          </div>
          <div onClick={() => handleClickPage('buletin')}  style={{ width: 120, padding: 10, cursor: 'pointer', background: activeTab === 'buletin' ? "#e94100" : '', borderRadius: '10px 10px 0 0'  }}>
            <AnnouncementIcon style={{color: 'white', fontSize: 25}}></AnnouncementIcon>
            <p className="source-font" style={{ color: 'white', margin: 0}}>Buletin</p>
          </div>
          <div onClick={() => handleClickPage('documents')} style={{ width: 120, padding: 10, cursor: 'pointer', background: activeTab === 'documents' ? "#e94100" : '', borderRadius: '10px 10px 0 0'  }}>
            <TaskIcon style={{color: 'white', fontSize: 25}}></TaskIcon>
            <p className="source-font" style={{ color: 'white', margin: 0}}>Documents</p>
          </div>
        </>
       )}
      </div>
    </>
  )
}