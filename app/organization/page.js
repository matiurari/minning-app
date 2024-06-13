import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { Box } from '@mui/material';
import Navbar from '@/components/Navbar';
import Organization from './Organization';

 const page = async () => {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    redirect('/');
    return null;
  }

  return (
    <Box sx={{width: "100vw", height: "100vh", padding: 0, margin: 0, backgroundColor: "white", display: "flex", flexDirection: "column"}}>
      <Box sx={{width: "100%", height: "10%"}}>
        <Navbar session={session}/>
      </Box>
      <Box sx={{width: "100%", height: "90%"}}>
        <Organization session={session}/>
      </Box>
    </Box>
  );
}

export default page