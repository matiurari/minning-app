"use client"

import { Box, Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import "@arcgis/core/assets/esri/themes/light/main.css";
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import Popup from "@arcgis/core/widgets/Popup.js";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer.js";
import Query from "@arcgis/core/rest/support/Query.js";

const MapDashboard = () => {
  const mapRef = useRef();
  const [view, setView] = useState();
  const [map, setMap] = useState();

  useEffect(() => {
    const initializeMap = async () => {
      const map = new Map({
        basemap: "osm"
      });
      setMap(map);
      const view = new MapView({
        map: map,
        zoom: 15,
        center: [106.82713782722509, -6.175680294520082],
        container: mapRef.current,
        ui: {
          components: []
        },
        popup: new Popup({
          defaultPopupTemplateEnabled: true,
          dockEnabled: false,
          dockOptions: {
            buttonEnabled: false,
            breakpoint: false
          },
          visibleElements: {
            closeButton: true
          }
        })
      });
      const geoJSONLayer = new GeoJSONLayer({
        url: "http://localhost:3000/api/userLocation",
        refreshInterval: 0.1
      });
      map.add(geoJSONLayer);
      const query = new Query({
        outFields: ["*"],
        where: "1=1"
      });
      const countFeature = await geoJSONLayer.queryFeatureCount(query);
      console.log(countFeature);
    };
  
    initializeMap();
  }, []);
  

  return (
    <Box sx={{ width: "100%", height: "90%", position: "relative" }} ref={mapRef}>
      <Box sx={{right: "2%", top: "2%", position: "absolute", width: "400px", height: "300px", backgroundColor: "white", borderRadius: 2}}>

      </Box>
    </Box>
  )
}

export default MapDashboard