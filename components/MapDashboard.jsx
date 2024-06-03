"use client";

import { Box, Button, Typography } from "@mui/material";
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
  const [geoJSON, setGeoJSON] = useState();
  const [featureCount, setFeatureCount] = useState(0);
  const [offlineFeatureCount, setOfflineFeatureCount] = useState(0);
  const [onlineFeatureCount, setOnlineFeatureCount] = useState(0);

  useEffect(() => {
    const initializeMap = async () => {
      const map = new Map({
        basemap: "osm",
      });
      setMap(map);
      const view = new MapView({
        map: map,
        zoom: 15,
        center: [106.82713782722509, -6.175680294520082],
        container: mapRef.current,
        ui: {
          components: [],
        },
        popup: new Popup({
          defaultPopupTemplateEnabled: true,
          dockEnabled: false,
          dockOptions: {
            buttonEnabled: false,
            breakpoint: false,
          },
          visibleElements: {
            closeButton: true,
          },
        }),
      });
      setView(view);
      const geoJSONLayer = new GeoJSONLayer({
        url: "http://localhost:3000/api/userLocation",
        refreshInterval: 0.1,
      });
      setGeoJSON(geoJSONLayer);
      map.add(geoJSONLayer);

      const updateFeatureCounts = async () => {
        const query = new Query({
          outFields: ["*"],
          where: "1=1",
        });
        const countFeature = await geoJSONLayer.queryFeatureCount(query);
        setFeatureCount(countFeature);

        const queryOffline = new Query({
          outFields: ["*"],
          where: "status = 'offline'",
        });
        const countOfflineFeature = await geoJSONLayer.queryFeatureCount(queryOffline);
        setOfflineFeatureCount(countOfflineFeature);

        const queryOnline = new Query({
          outFields: ["*"],
          where: "status = 'tracking'",
        });
        const countOnlineFeature = await geoJSONLayer.queryFeatureCount(queryOnline);
        setOnlineFeatureCount(countOnlineFeature);
      };

      // Initial query
      updateFeatureCounts();

      // Set interval to update counts every 10 seconds (or desired interval)
      const intervalId = setInterval(updateFeatureCounts, 10000);

      // Clear interval on component unmount
      return () => clearInterval(intervalId);
    };

    initializeMap();
    return () => {
      if (geoJSON) {
        geoJSON.destroy();
        setGeoJSON(null);
      }
      if (view) {
        view.destroy();
        setView(null);
      }
      if (map) {
        map.removeAll();
        setMap(null);
      }
    };
  }, []);

  return (
    <Box
      sx={{ width: "100%", height: "90%", position: "relative" }}
      ref={mapRef}
    >
      <Box
        sx={{
          right: "2%",
          top: "2%",
          position: "absolute",
          width: "600px",
          height: "300px",
          backgroundColor: "white",
          borderRadius: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          padding: 2
        }}
      >
        <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
          <Typography sx={{ fontSize: "40pt" }}>{featureCount}</Typography>
          <Typography sx={{fontSize: "24pt"}}>User Located</Typography>
        </Box>
        <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
          <Typography sx={{ fontSize: "40pt" }}>{offlineFeatureCount}</Typography>
          <Typography sx={{fontSize: "24pt"}}>Offline User</Typography>
        </Box>
        <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
          <Typography sx={{ fontSize: "40pt" }}>{onlineFeatureCount}</Typography>
          <Typography sx={{fontSize: "24pt"}}>Online User</Typography>
        </Box>
        
      </Box>
    </Box>
  );
};

export default MapDashboard;
