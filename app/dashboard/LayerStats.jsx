import Query from '@arcgis/core/rest/support/Query';
import { Box, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

const LayerStats = ({featureCount, offlineFeatureCount, onlineFeatureCount}) => {
    return (
        <Box sx={{right: "2%", top: "2%", position: "absolute", backgroundColor: "white", borderRadius: "5px", display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: "column", padding: "7px"}}>
            <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "220px",  backgroundColor: "#FCE5E5", borderRadius: "5px 5px 0px 0px"}}>
                <Typography sx={{ fontSize: "32pt" }}>{featureCount}</Typography>
                <Typography sx={{ fontSize: "18pt" }}>User Located</Typography>
            </Box>
            <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "220px", backgroundColor: "#AFE1AF"}}>
                <Typography sx={{ fontSize: "32pt" }}>{onlineFeatureCount}</Typography>
                <Typography sx={{ fontSize: "18pt" }}>Online User</Typography>
            </Box>
            <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "220px", backgroundColor: "#FF7474", borderRadius: "0px 0px 5px 5px"}}>
                <Typography sx={{ fontSize: "32pt" }}>{offlineFeatureCount}</Typography>
                <Typography sx={{ fontSize: "18pt" }}>Offline User</Typography>
            </Box>
        </Box>
    )
}

export default LayerStats