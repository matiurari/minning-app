"use client"

import { AccountCircle } from '@mui/icons-material'
import { Box, Button, Menu, MenuItem, Typography } from '@mui/material'
import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Navbar = ({ session }) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "skyblue" }}>
        <Box sx={{ width: "20%", paddingLeft: "50px" }}>
          <Typography sx={{fontSize: "30pt", fontFamily: "Arial, Helvetica, sans-serif", color: "black", cursor: "pointer",  textTransform: "uppercase", ":hover" : {color: "gray", textShadow: "1px 1px 0px #efa8a8"}}} onClick={() => router.push("/")}>
            Geo-Minning
          </Typography>
        </Box>
        <Box sx={{ width: "40%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", fontSize: "18pt" }}>
          <Box sx={{width: "60%", display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "center"}}>
            {session && (
              <>
                <Box>
                  <Typography sx={{fontSize: "20pt", fontFamily: '"Times New Roman", Times, serif', color: "black", cursor: "pointer",  ":hover" : {color: "gray", textShadow: "1px 1px 0px #efa8a8"}}} onClick={() => router.push("/tracker")}>
                    Tracker
                  </Typography>
                </Box>
                {session.user.role === "admin" && (
                  <>
                    <Box>
                      <Typography sx={{fontSize: "20pt", fontFamily: '"Times New Roman", Times, serif', color: "black", cursor: "pointer",  ":hover" : {color: "gray", textShadow: "1px 1px 0px #efa8a8"}}} onClick={() => router.push("/dashboard")}>
                        Dashboard
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{fontSize: "20pt", fontFamily: '"Times New Roman", Times, serif', color: "black", cursor: "pointer",  ":hover" : {color: "gray", textShadow: "1px 1px 0px #efa8a8"}}} onClick={() => router.push("/organization")}>
                        Organization
                      </Typography>
                    </Box>
                  </>
                )}
              </>
            )}
          </Box>
          <Box sx={{width: "40%", display: "flex", flexDirection: "row", justifyContent: "center"}}>
            {session ? (
              <Box sx={{width: "180px", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", columnGap: "10px"}}>
                  <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", columnGap: "10px", cursor: "pointer"}} onClick={handleClick}>
                    <AccountCircle sx={{width: "40px", height: "40px"}}/>
                    <Typography>Hello, {session.user.name}</Typography>
                  </Box>
                  <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleClose}>My account</MenuItem>
                    <MenuItem onClick={() => signOut()}>Logout</MenuItem>
                  </Menu>
              </Box>
            ) : (
              <Button sx={{ backgroundColor: "green", fontFamily: '"Times New Roman", Times, serif', color: "white" }} onClick={() => signIn()}>
                Login
              </Button>
            )}
          </Box>
        </Box>
    </Box>
  )
}

export default Navbar