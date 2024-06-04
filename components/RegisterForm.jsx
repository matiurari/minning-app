"use client"

import { Box, TextField, Typography, Button } from "@mui/material"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!name || !email || !password) {
      setError("All fields are necessary!")
      return;
    }

    try {
      const resUserExist = await fetch("api/userExist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email }),
      })

      const { user } = await resUserExist.json();

      if (user) {
        setError("User already exist.");
        return;
      }

      const res = await fetch('api/register', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name, email, password
        })
      })

      if (res.ok) {
        const form = e.target;
        form.reset();
        router.push("/")
      } else {
        const data = await res.json();
        setError(data.message || "User registration failed.");
      }
    } catch (error) {
      console.error("Error during registration: ", error);
    }
  }

  return (
    <Box sx={{width: "100vw", height: "100vh", backgroundColor: "white", padding: 0, margin: 0, display: "flex", alignItems: "center", justifyContent: "center"}}>
      <Box sx={{width: "300px", height: "400px", boxShadow: 4, borderRadius: "10px",display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-evenly"}}>
        <Typography variant="h6">Register</Typography>
        <Box sx={{display: "flex", flexDirection: "column", rowGap: 2}}>
          <form style={{display: "flex", flexDirection: "column", rowGap: 3}} onSubmit={handleSubmit}>
            <TextField variant="standard" label="Full Name" placeholder="Full Name" type="text" onChange={(e) => setName(e.target.value)}/>
            <TextField variant="standard" label="Email" placeholder="Email" type="email" onChange={(e) => setEmail(e.target.value)}/>
            <TextField variant="standard" label="Password" placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)}/>
            <Button variant="contained" sx={{backgroundColor: "greenyellow", color: "grey"}} type="submit">Register</Button>
            <Link href={"/"}>
                <Typography>Already have an account? <span>Login</span></Typography>
            </Link>
          </form>
        </Box>
        { error && (
            <Box sx={{paddingLeft: "10px", paddingRight: "10px"}}>
              <Typography sx={{backgroundColor: "red", borderRadius: "3px", padding: "2px", fontSize: "12pt"}}>{error}</Typography>
            </Box>
          )}
      </Box>
    </Box>
  )
}

export default RegisterForm