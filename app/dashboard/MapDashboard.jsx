"use client";

import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import "@arcgis/core/assets/esri/themes/light/main.css";
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import Popup from "@arcgis/core/widgets/Popup.js";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer.js";
import Field from "@arcgis/core/layers/support/Field.js";
import LayerStats from "./LayerStats";
import Query from "@arcgis/core/rest/support/Query";
import LabelClass from "@arcgis/core/layers/support/LabelClass.js";

const MapDashboard = () => {
  const mapRef = useRef();
  const [featureCount, setFeatureCount] = useState(0);
  const [offlineFeatureCount, setOfflineFeatureCount] = useState(0);
  const [onlineFeatureCount, setOnlineFeatureCount] = useState(0);

  useEffect(() => {
    const map = new Map({
      basemap: "osm",
    });

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

    const fields = [
      new Field({ name: "name", type: "string" }),
      new Field({ name: "email", type: "string" }),
      new Field({ name: "accuracy", type: "string" }),
      new Field({ name: "latitude", type: "string" }),
      new Field({ name: "longitude", type: "string" }),
      new Field({ name: "altitude", type: "string" }),
      new Field({ name: "heading", type: "string" }),
      new Field({ name: "speed", type: "string" }),
      new Field({ name: "status", type: "string" }),
      new Field({ name: "updatedat", type: "string" }),
    ];

    const labelClass = new LabelClass({
      labelExpressionInfo: { expression: "$feature.name" },
      symbol: {
        type: "text",
        color: "white",
        haloColor: "black",
        haloSize: "1px",
        font: {
          size: 12,
          family: "Josefin Slab",
          weight: "bold"
        }
      }
    })
    const geojsonLayer = new GeoJSONLayer({
      url: `http://localhost:3000/api/userLocation`,
      title: "User Location",
      visible: true,
      fields: fields,
      labelingInfo: labelClass,
      renderer: {
        type: "simple",
        symbol: {
          type: "simple-marker",
          color: [255, 165, 0, 1],
          outline: {
            color: "#FFFFFF",
            width: 1,
          },
          size: "10px",
        },
      },
    });

    view.map.add(geojsonLayer);

    const periodicFunction = async () => {
      try {
        geojsonLayer.refresh();
        
        const query = new Query({
          outFields: ["*"],
          where: "1=1",
        });
        const countFeature = await geojsonLayer.queryFeatureCount(query);
        setFeatureCount(countFeature);

        const queryOffline = new Query({
          outFields: ["*"],
          where: "status = 'offline'",
        });
        const countOfflineFeature = await geojsonLayer.queryFeatureCount(queryOffline);
        setOfflineFeatureCount(countOfflineFeature);

        const queryOnline = new Query({
          outFields: ["*"],
          where: "status = 'tracking'",
        });
        const countOnlineFeature = await geojsonLayer.queryFeatureCount(queryOnline);
        setOnlineFeatureCount(countOnlineFeature);
      } catch (error) {
        console.error("Error updating GeoJSON layer:", error);
      }
    };

    const intervalId = setInterval(periodicFunction, 10000);

    return () => {
      clearInterval(intervalId);
      if (view) {
        view.destroy();
      }
      if (map) {
        map.destroy();
      }
    };
  }, []);

  return (
    <Box sx={{ width: "100%", height: "100%", position: "relative" }} ref={mapRef}>
      <LayerStats featureCount={featureCount} offlineFeatureCount={offlineFeatureCount} onlineFeatureCount={onlineFeatureCount}/>
      <Box sx={{ left: "2%", top: "2%", display: "flex", position: "absolute" }}>
      </Box>
    </Box>
  );
};

export default MapDashboard;
