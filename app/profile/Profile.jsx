"use client";

import { AccountCircle } from '@mui/icons-material'
import { Box, Button, Divider, Modal, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react';

const modalStyle = {
  width: "600px",
  height: "300px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  left: "50vw",
  top: "30vh",
  backgroundColor: "white",
  transform: "translate(-50%, -50%)",
  borderRadius: "7px",
};

const Profile = ({session}) => {
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [bothPasswordsEntered, setBothPasswordsEntered] = useState(false);

  useEffect(() => {
    if(newPassword && confirmNewPassword){
      setPasswordMatch(newPassword === confirmNewPassword);
    }
    setBothPasswordsEntered(newPassword !== '' && confirmNewPassword !== '');
  }, [newPassword, confirmNewPassword]);

  const openModal = (user) => {
    setPasswordOpen(true);
  }

  const closeModal = () => {
    setPasswordOpen(false);
    setPasswordMatch(false);
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handleNewPassword = (e) => {
    e.preventDefault();
    setNewPassword(e.target.value);
  }

  const handleConfirmNewPassword = (e) => {
    e.preventDefault();
    setConfirmNewPassword(e.target.value);
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/changePassword", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user.email,
          newPassword: newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to change password');
      }

      closeModal();
    } catch (error) {
      setError(error.message);
    }
  };
  
  return (
    <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "350px", height: "500px", boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", borderRadius: "7px"}}>
      <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "40%", width: "100%"}}>
        <AccountCircle sx={{width: "150px", height: "150px", color: "lightblue"}}/>
      </Box>
      <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "center", width: "100%", height: "10%"}}>
        <Button variant='contained' onClick={openModal}>Set Password</Button>
        <Button variant='contained' disabled>Set Picture</Button>
      </Box>
      <Box sx={{display: "flex", flexDirection: "row", height: "30%", width: "100%", justifyContent: "space-around"}}>
        <Box sx={{display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", width: "20%"}}>
          <Typography>Name</Typography>
          <Divider />
          <Typography>Email</Typography>
          <Divider />
          <Typography>Role</Typography>
          <Divider />
        </Box>
        <Box sx={{display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", width: "60%"}}>
          <Typography>: {session?.user?.name}</Typography>
          <Divider />
          <Typography>: {session?.user?.email}</Typography>
          <Divider />
          <Typography>: {session?.user?.role}</Typography>
          <Divider />
        </Box>
      </Box>
      <Modal open={passwordOpen} onClose={closeModal}>
        <Box sx={modalStyle}>
          <Box sx={{ width: "100%", height: "20%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Typography sx={{ fontSize: "20pt", fontFamily: '"Times New Roman", Times, serif' }}>
              Set New Password for {session?.user.name}
            </Typography>
          </Box>
          <Box sx={{ width: "100%", height: "80%", display: "flex", flexDirection: "column", rowGap: "3px", justifyContent: "center", alignItems: "center" }}>
            <Box>
              <Typography sx={{ fontSize: "14pt", fontFamily: '"Times New Roman", Times, serif' }}>
                New Password
              </Typography>
              <TextField 
                type="password" 
                sx={{ width: "300px" }} 
                onChange={handleNewPassword} 
                value={newPassword} 
              />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "14pt", fontFamily: '"Times New Roman", Times, serif' }}>
                Confirm New Password
              </Typography>
              <TextField 
                type="password" 
                sx={{ width: "300px" }} 
                onChange={handleConfirmNewPassword} 
                value={confirmNewPassword} 
                error={!passwordMatch && newPassword && confirmNewPassword} 
                helperText={(!passwordMatch && newPassword && confirmNewPassword) ? "Password does not match" : ""} 
              />
            </Box>
            <Box>
              <Button variant="contained" disabled={!bothPasswordsEntered || !passwordMatch} onClick={handleSubmit}>
                Submit
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}

export default Profile


