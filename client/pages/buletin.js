import React, { useEffect, useState } from "react"
import Header from "../components/Header"
import { Box, Button, IconButton, Modal } from "@mui/material"
import AddIcon from '@mui/icons-material/Add'
import AddAnnouncementModal from "../components/AddAnnouncementModal"
import useUserStore from "../stores/userStore"
import announcementsServices from '../services/announcements'
import DeleteIcon from '@mui/icons-material/Delete'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  p: 3,
};

export default function Home() {
  const companyId = useUserStore((state) => state.companyId)
  
  const [openAddAnnouncementModal, setOpenAddAnnouncementModal] = useState(false)
  const [openDeleteAnnouncementModal, setOpenDeleteAnnouncementModal] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null)
  const [announcements, setAnnouncements] = useState([])

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
  }, [companyId])
  
  return (
    <>
      <Header activeTab='buletin'></Header>

      <div style={{background: "#f5f4f4", height: 760, padding: 25}}>
        <div style={{ minHeight: 700, background: 'white', width: '100%', padding: 20, borderRadius: 10 }}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <p className="source-font-bold" style={{ fontWeight: 500, fontSize: 19, margin: 0, color: "#0b0045", marginTop: 5 }}>Buletin Board</p>

            <Button
              className="source-font"
              style={{
                background: '#0b0045', color: 'white', textTransform:'capitalize'
              }}
              startIcon={<AddIcon></AddIcon>}
              onClick={() => setOpenAddAnnouncementModal(true)}
            >
              Add Announcement
            </Button>
          </div>

          <div>
            {announcements?.map(a => {
              return (
                <>
                  <div style={{display:'flex', justifyContent: 'space-between', marginTop: 20}}>
                    <div style={{display:'flex'}}>
                      <p className="source-font" style={{ margin: 0}}>Start Date: {a.start_date}</p>
                      <p className="source-font" style={{ margin: 0, marginLeft: 20}}>End Date: {a.end_date}</p>
                    </div>

                    <IconButton onClick={() => {
                      setOpenDeleteAnnouncementModal(true)
                      setSelectedAnnouncement(a)
                    }} aria-label="delete">
                      <DeleteIcon style={{fontSize: 19, color: "#eb4304"}} />
                    </IconButton>
                  </div>
                  <div style={{ width: '100%', border: 'solid #0b0045 2px', borderRadius: 5, padding: 10, marginBottom: 20, marginTop: 10, height: 200}}>
                    <p className="source-font" style={{ margin: 0}}>{a.text}</p>
                  </div>
                </>
              )
            })}
          </div>
        </div>
      </div>

      <AddAnnouncementModal setAnnouncements={setAnnouncements} setAddOpenAnnouncementModal={setOpenAddAnnouncementModal} openAddAnnouncementModal={openAddAnnouncementModal}></AddAnnouncementModal>

      <Modal
        open={openDeleteAnnouncementModal}
        onClose={() => {
          setOpenDeleteAnnouncementModal(false)
          setSelectedAnnouncement(null)
        }}
      >
        <Box sx={style}>
          <div style={{ width: '100%'}}>
            <p className="source-font-bold" style={{ fontSize: 20, margin: 0, marginTop: -5}}>Remove Announcement</p>
          </div>

          <p style={{ marginTop: 20}}>Are you sure you want to remove this Announcement?</p>

          <div style={{ width: '100%', display:'flex', justifyContent: 'end'}}>
            <Button
              className="source-font"
              onClick={async () => {
                const userJSON = localStorage.getItem('currentEmployee');
                const parsedUser = JSON.parse(userJSON);

                await announcementsServices.deleteAnnouncement(selectedAnnouncement.id, parsedUser.token)

                setOpenDeleteAnnouncementModal(false)
                setSelectedAnnouncement(null)

                const result = await announcementsServices.getAnnouncements(companyId, parsedUser.token)
                setAnnouncements(result.data)
              }}
              style={{
                background: '#0b0045', color: 'white', textTransform:'capitalize',width: '20', marginRight: 10
              }}
            >
              Yes
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  )
}
