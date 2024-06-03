import prisma from "@/lib/db";
import { NextResponse } from "next/server"

export async function POST(req) {
  if (req.method === 'POST') {
    try {
      const data = await req.json(); 

      const userCheck = await prisma.$executeRaw`SELECT email FROM user_location WHERE email = ${data.email}`

      if(userCheck === 1) {
        await prisma.$executeRaw`
          UPDATE user_location
            SET
            name = ${data.name},
            latitude = ${data.latitude},
            longitude = ${data.longitude},
            accuracy = ${data.accuracy},
            location = ST_SetSRID(ST_MakePoint(${data.longitude}, ${data.latitude}), 4326),
            status = ${data.status},
            updatedat = to_timestamp(${data.time} / 1000.0)
          WHERE email = ${data.email}
      `} else {
        await prisma.$executeRaw`
          INSERT INTO user_location 
          (name, email, latitude, longitude, accuracy, location, status, updatedat) 
          VALUES 
          (${data.name}, ${data.email}, ${data.latitude}, ${data.longitude}, ${data.accuracy}, ST_SetSRID(ST_MakePoint(${data.longitude}, ${data.latitude}), 4326), ${data.status}, to_timestamp(${data.time} / 1000.0))
        `
      }
      return NextResponse.json({ message: 'Data received successfully' }, { status: 200 })
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return NextResponse.json({ message: 'Failed to parse JSON data' }, { status: 500 })
    }
  } else {
    return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 })
  }
}

export async function GET(req) {
  if (req.method === 'GET') {
    try {
        const data = await prisma.$queryRaw`
            SELECT 
                name,
                email,
                ST_AsGeoJSON(location) AS geometry,
                accuracy,
                latitude,
                longitude,
                altitude,
                heading,
                speed,
                status,
                updatedat
            FROM user_location
        `;

        // Convert data to GeoJSON format
        const geoJSONData = {
            type: 'FeatureCollection',
            features: data.map(item => ({
              type: 'Feature',
              geometry: JSON.parse(item.geometry),
              properties: {
                name: item.name,
                email: item.email,
                accuracy: item.accuracy,
                latitude: item.latitude,
                longitude: item.longitude,
                altitude: item.altitude,
                heading: item.heading,
                speed: item.speed,
                status: item.status,
                updatedat: item.updatedat
              }
            }))
        };

        return NextResponse.json(geoJSONData);
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.error();
    }
  }
}
