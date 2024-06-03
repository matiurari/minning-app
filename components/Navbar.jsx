"use client"

import { AccountCircle } from '@mui/icons-material'
import { Box, Button, Menu, MenuItem, Typography } from '@mui/material'
import { signOut } from 'next-auth/react';
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
    <Box sx={{ width: "100%", height: "10%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "skyblue" }}>
        <Box sx={{ width: "15%", paddingLeft: "50px" }}>
          <Typography sx={{fontSize: "24pt", fontFamily: '"Times New Roman", Times, serif', color: "black", cursor: "pointer",  textTransform: "uppercase", ":hover" : {color: "gray", textShadow: "1px 1px 0px #efa8a8"}}}>Geo-Minning</Typography>
        </Box>
        <Box sx={{ width: "30%", paddingRight: "50px", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", fontSize: "18pt" }}>
          {session && ( 
            <>
              {session.user.role === "admin" && <Typography sx={{fontSize: "18pt", fontFamily: '"Times New Roman", Times, serif', color: "black", cursor: "pointer",  ":hover" : {color: "gray", textShadow: "1px 1px 0px #efa8a8"}}} onClick={() => router.replace("/dashboard")}>Dashboard</Typography>}
              <Typography sx={{fontSize: "18pt", fontFamily: '"Times New Roman", Times, serif', color: "black", cursor: "pointer",  ":hover" : {color: "gray", textShadow: "1px 1px 0px #efa8a8"}}} onClick={() => router.replace("/tracker")}>Tracker</Typography>
            </>
          )}
          {session ? (
            <Box sx={{width: "180px", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", columnGap: "10px"}}>
                <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", columnGap: "10px", cursor: "pointer"}} onClick={handleClick}>
                  <AccountCircle sx={{width: "40px", height: "40px"}}/>
                  <Typography>Hello, {session.user.name}</Typography>
                </Box>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
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
            <Button sx={{ backgroundColor: "green", fontFamily: '"Times New Roman", Times, serif', color: "white" }} onClick={() => router.push("/login")}>
              Login
            </Button>
          )}
        </Box>
      </Box>
  )
}

export default Navbar