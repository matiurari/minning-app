import Navbar from "@/components/Navbar";
import { Box } from "@mui/material";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import dynamic from 'next/dynamic';
import { redirect } from "next/navigation";

const Map = dynamic(() => import("./MapDashboard"), { ssr: false, webpack: false });

const page = async() => {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    redirect('/');
    return null;
  }

  return (
    <Box sx={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column" }}>
      {session && (
        <>
          <Box sx={{width: "100%", height: "10%"}}>
            <Navbar session={session}/>
          </Box>
          <Box sx={{width: "100%", height: "90%"}}>
            <Map />
          </Box>
        </>
      )}
    </Box>
  );
};

export default page;
