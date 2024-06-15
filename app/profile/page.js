import { Box } from '@mui/material'
import Profile from './Profile'
import Navbar from '@/components/Navbar'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'

const page = async () => {
    const session = await getServerSession(authOptions);

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100vw", height: "100vh", backgroundColor: "white" }}>
            <Box sx={{position: "absolute", left: "0px", top: "0px", width: "100%", height: "10%"}}>
                <Navbar session={session} />
            </Box>
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "90%"}}>
                <Profile session={session} />
            </Box>
        </Box>
    )
}

export default page
