"use client";

import { Box, TextField, Typography, Button, IconButton } from "@mui/material"
import Link from "next/link"
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Cancel, Close, CloseOutlined, HighlightOff } from "@mui/icons-material";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false
      });

      if(res.error) {
        setError("Invalid Credentials")
        return;
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Box sx={{width: "100vw", height: "100vh", backgroundColor: "white", padding: 0, margin: 0, display: "flex", alignItems: "center", justifyContent: "center"}}>
      <Box sx={{width: "300px", height: "400px", boxShadow: 4, borderRadius: "10px",display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-evenly"}}>
        <Typography variant="h6">Enter the details</Typography>
        <form style={{display: "flex", flexDirection: "column", rowGap: 5}} onSubmit={handleSubmit}>
          <TextField variant="standard" label="Email" placeholder="Email" type="text" onChange={(e) => setEmail(e.target.value)}/>
          <TextField variant="standard" label="Password" placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)}/>
          <Button variant="contained" sx={{backgroundColor: "greenyellow", color: "grey"}} type="submit">Login</Button>
          { error && (
            <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "red", borderRadius: "3px", padding: "2px", fontSize: "12pt"}}>
              <Typography>{error}</Typography>
              <IconButton sx={{width: "20px", height: "20px", color: "white"}} onClick={() => setError("")}>
                <HighlightOff/>
              </IconButton>
            </Box>
          )}
          <Link href={"/register"}>
            <Typography>Dont have an account? <span>Register</span></Typography>
          </Link>
        </form>
      </Box>
    </Box>
  )
}

export default LoginForm