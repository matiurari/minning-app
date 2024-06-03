import Navbar from "@/components/Navbar";
import UserInfo from "@/components/UserInfo";
import { Box } from "@mui/material";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import dynamic from 'next/dynamic';

const Map = dynamic(() => import("@/components/MapTracker"), { ssr: false, webpack: false });

const page = async() => {
  const session = await getServerSession(authOptions);
  return (
    <Box sx={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
      <Navbar session={session}/>
      <Map />
    </Box>
  );
};

export default page;
