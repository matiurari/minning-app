"use client";

import { Box, Typography, Button } from "@mui/material"
import { signOut } from "next-auth/react"
import { useSession } from 'next-auth/react'

const UserInfo = () => {
  const { data: session } = useSession();
  return (
    <Box sx={{display: "flex", flexDirection: "column", padding: 3, boxShadow: 3, borderRadius: 3, rowGap: 1}}>
        <Typography>{`Name : ${session?.user?.name}`}</Typography>
        <Typography>{`Email : ${session?.user?.email}`}</Typography>
        <Button variant="contained" sx={{backgroundColor: "red", ":hover": {backgroundColor: "firebrick"}}} onClick={() => signOut()}>Logout</Button>
    </Box>
  )
}

export default UserInfo