import { Box } from '@mui/material'
import { useSession } from 'next-auth/react'

const Profile = ({session}) => {
  return (
    <Box>
      {session?.user?.name}
    </Box>
  )
}

export default Profile
