import Navbar from "@/components/Navbar";
import UserInfo from "@/components/UserInfo";
import { Box } from "@mui/material";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import dynamic from 'next/dynamic';

const Map = dynamic(() => import("./MapDashboard"), { ssr: false, webpack: false });

const page = async() => {
  const session = await getServerSession(authOptions);
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
