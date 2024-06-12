import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import Query from "@arcgis/core/rest/support/Query.js";


const FeatureList = ({ view, geoJSON }) => {
  const [featureList, setFeatureList] = useState();

  useEffect(() => {
    if(view && geoJSON) {
        
    }
  }, [view, geoJSON])

  return (
    <Box sx={{ display: "flex", flexDirection: "column", backgroundColor: "white"}}>
        <List />
    </Box>
  );
};

export default FeatureList;
