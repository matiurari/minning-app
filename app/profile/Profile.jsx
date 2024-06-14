import { Box } from '@mui/material'

const Profile = ({session}) => {
  
  return (
    <Box>
      {session?.user?.name}
    </Box>
  )
}

export default Profile
