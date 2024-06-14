"use client";

import { Password, Remove, Restore } from "@mui/icons-material";
import { Box, CircularProgress, IconButton, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const Organization = ({ session }) => {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [passwordOpen, setPasswordOpen] = useState(false);

  useEffect(() => {
    if (session) {
      const getUser = async () => {
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
      getUser();
    }
  }, [session]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  const closeModal = () => {
    setPasswordOpen(false);
  }

  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <Box sx={{width: "50%"}}>
        <TableContainer component={Paper} sx={{backgroundColor: "#c6e5ef", borderRadius: "7px"}}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
                          <IconButton onClick={() => setPasswordOpen(true)}>
                            <Password />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Remove Account" placement="top">
                          <IconButton>
                            <Restore />
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
        <Box sx={{width: "00px", height: "200px", backgroundColor: "white", position: "absolute", left: "50vw", top: "30vh", transform: "translate(-50%, -50%)"}}>
          INI MODAL
        </Box>
      </Modal>
    </Box>
  );
};

export default Organization;
