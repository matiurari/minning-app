"use client";

import { Box, Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import Popup from "@arcgis/core/widgets/Popup.js";
import Graphic from "@arcgis/core/Graphic.js";
import Point from "@arcgis/core/geometry/Point.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import "@arcgis/core/assets/esri/themes/light/main.css";
import { useSession } from "next-auth/react";

const MapComponent = () => {
  const { data: session } = useSession();
  const mapRef = useRef();
  const [view, setView] = useState();
  const [map, setMap] = useState();
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState();
  const [accuracy, setAccuracy] = useState();
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [altitude, setAltitude] = useState();
  const [heading, setHeading] = useState();
  const [speed, setSpeed] = useState();

  useEffect(() => {
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
    setView(view);
  }, []);

  const startTracking = () => {
    if (!isTracking) {
      setIsTracking(true);
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { accuracy, latitude, longitude, altitude, heading, speed } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
          setAccuracy(accuracy);
          setAltitude(altitude);
          setHeading(heading);
          setSpeed(speed);
          
          const name = session.user.name;
          const email = session.user.email;
          const status = "tracking";
          const time = Date.now();

          fetch("/api/userLocation", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, accuracy, latitude, longitude, altitude, heading, speed, status, time })
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to send location data to server');
            }
          })
          .catch(error => {
            alert('Failed to send location data to server');
          });

          const userLocationLabel = new Graphic({
            geometry: new Point({
              latitude: latitude,
              longitude: longitude
            }),
            symbol: {
              type: "text",
              color: "white",
              haloColor: "black",
              haloSize: "1px",
              text: name,
              xoffset: 0,
              yoffset: -20,
              font: {
                size: 12,
                family: "Josefin Slab",
                weight: "bold"
              }
            },
            attributes: {
              User: name,
              Accuracy: accuracy,
              Latitude: latitude,
              Longitude: longitude,
              Altitude: altitude,
              Heading: heading,
              Speed: speed
            }
          });

          const userLocationMarker = new Graphic({
            geometry: new Point({
              latitude: latitude,
              longitude: longitude
            }),
            symbol: {
              type: "simple-marker",
              style: "circle",
              color: "lightblue",
              size: "12px"
            },
            attributes: {
              User: name,
              Accuracy: accuracy,
              Latitude: latitude,
              Longitude: longitude,
              Altitude: altitude,
              Heading: heading,
              Speed: speed
            },
          });
  
          const graphicUserLocation = new GraphicsLayer({
            graphics: [userLocationMarker, userLocationLabel],
          });
  
          map.removeAll();
          map.add(graphicUserLocation);
          view.goTo({
            center: [longitude, latitude],
            zoom: 18
          });
        },
        error => {
          console.error('Error getting user location:', error);
          alert('Failed to get user location');
        }
      );
      alert("Start Tracking : " + session.user.name);
      setWatchId(watchId);
    }
  };
  

  const stopTracking = () => {
    if(isTracking) {
      setIsTracking(false);
      navigator.geolocation.clearWatch(watchId);
      map.removeAll();

      const name = session.user.name;
      const email = session.user.email;
      const status = "offline"
      const time = Date.now();

      fetch("/api/userLocation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, accuracy, latitude, longitude, altitude, heading, speed, status, time })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to send location data to server');
        }
      })
      .catch(error => {
        alert('Failed to send location data to server');
      });

      alert("Stop Tracking : " + session.user.name);
    }
  }

  return (
    <Box sx={{ width: "100%", height: "100%"}} ref={mapRef}>
      <Box sx={{ display: "flex", flexDirection: "row", position: "absolute", left: "50%", bottom: "2%", width: "250px", height: "75px", justifyContent: "space-around", alignItems: "center", transform: "translate(-50%)" }}>
        <Button sx={{ width: "100px", height: "50px", backgroundColor: "yellowgreen", ":hover": { backgroundColor: "yellowgreen" }, fontWeight: "bold", color: "white" }} onClick={startTracking} disabled={isTracking}>
          Start
        </Button>
        <Button sx={{ width: "100px", height: "50px", backgroundColor: "#FF474C", ":hover": { backgroundColor: "#FF474C" }, fontWeight: "bold", color: "white"}} onClick={stopTracking} disabled={!isTracking}>
          Stop
        </Button>
      </Box>
    </Box>
  );
};

export default MapComponent;