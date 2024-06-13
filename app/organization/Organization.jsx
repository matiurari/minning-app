"use client";

import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const Organization = ({ session }) => {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session) {
      const getUser = async () => {
        try {
          const response = await fetch("/api/userTable");
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
          const data = await response.json();

          const sortedData = data.sort((a, b) => a.role.localeCompare(b.role));

          setUserList(sortedData);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      getUser();
    }
  }, [session]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      {userList.length === 0 ? (
        <Typography>No users found</Typography>
      ) : (
        userList.map((user) => (
          <Box key={user.id} sx={{ padding: 2, borderBottom: '1px solid #ccc' }}>
            <Typography>{user.name}</Typography>
            <Typography>{user.email}</Typography>
            <Typography>{user.role}</Typography>
          </Box>
        ))
      )}
    </Box>
  );
};

export default Organization;
