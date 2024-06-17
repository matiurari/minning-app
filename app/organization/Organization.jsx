"use client";

import { Password, PersonRemove } from "@mui/icons-material";
import { Alert, Box, Button, CircularProgress, IconButton, Modal, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";

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

const Organization = ({ session }) => {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [currentUser, setCurrentUser] = useState();
  const [bothPasswordsEntered, setBothPasswordsEntered] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (session) {
      fetchUserList();
    }
  }, [session]);

  const fetchUserList = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/userTable");
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();

      const sortedData = data.sort((a, b) => a.role.localeCompare(b.role));

      setUserList(sortedData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(newPassword && confirmNewPassword){
      setPasswordMatch(newPassword === confirmNewPassword);
    }
    setBothPasswordsEntered(newPassword !== '' && confirmNewPassword !== '');
  }, [newPassword, confirmNewPassword]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: "100%", width: "100%" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" variant="h6">
        An error occurred while fetching user data: {error}
      </Typography>
    );
  }

  const openModal = (user) => {
    setPasswordOpen(true);
    setCurrentUser(user);
  }

  const closeModal = () => {
    setPasswordOpen(false);
    setPasswordMatch(false);
    setNewPassword("");
    setConfirmNewPassword("");
    setCurrentUser(null);
  };

  const handleNewPassword = (e) => {
    e.preventDefault();
    setNewPassword(e.target.value);
  }

  const handleConfirmNewPassword = (e) => {
    e.preventDefault();
    setConfirmNewPassword(e.target.value);
  }

  const handleSetPassword = async () => {
    try {
      const response = await fetch("/api/changePassword", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: currentUser.email,
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

  const handleDeleteUser = async (email) => {
    try {
      const response = await fetch("/api/userRemove", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: email})
      });
      if(!response.ok){
        throw new Error("Failed to delete user");
      }
      setNotification({ open: true, message: "User deleted successfully.", severity: "success"});
      fetchUserList();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCloseNotification = () => {
    setNotification({...notification, open: false})
  }

  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <Box sx={{width: "70%", display: "flex", justifyContent: "center", alignItems: "center"}}>
        <TableContainer component={Paper} sx={{ maxWidth: "700px", backgroundColor: "#c6e5ef", borderRadius: "7px"}}>
          <Table aria-label="simple table">
            <TableHead sx={{backgroundColor: "#97d8ed"}}>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="left">Email</TableCell>
                <TableCell align="left">Role</TableCell>
                <TableCell align="left">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userList.map((user) => (
                <TableRow
                  key={user.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {user.name}
                  </TableCell>
                  <TableCell align="left">{user.email}</TableCell>
                  <TableCell align="left">{user.role}</TableCell>
                  <TableCell align="left">
                    {user.role === "surveyor" && (
                      <>
                        <Tooltip title="Set Password" placement="top">
                          <IconButton onClick={() => openModal(user)}>
                            <Password />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Remove Account" placement="top">
                          <IconButton onClick={() => handleDeleteUser(user.email)}>
                            <PersonRemove />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Modal open={passwordOpen} onClose={closeModal}>
        <Box sx={modalStyle}>
          <Box sx={{ width: "100%", height: "20%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Typography sx={{ fontSize: "20pt", fontFamily: '"Times New Roman", Times, serif' }}>
              Set New Password for {currentUser?.name}
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
              <Button variant="contained" disabled={!bothPasswordsEntered || !passwordMatch} onClick={handleSetPassword}>
                Submit
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
      <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification}>
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Organization;
