import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req) {
  if (req.method === "POST") {
    try {
        const { email } = await req.json();

        const session = await getServerSession(authOptions);

        if (session.user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findFirst({
            where: { email: email },
        });

        if(!user) {
            return NextResponse.json({ message: "User not found"}, {status: 404});
        }

        //Delete User
        await prisma.user.delete({
            where: { email: email}
        });

        //Delete User Location
        await prisma.user_location.delete({
            where: {email: email}
        });

        return NextResponse.json({ message: "User and User Location deleted."}, {status: 200});
    } catch (error) {
        console.error("Error", error);
        return NextResponse.json({ message: "An error occurred while delete the user." }, { status: 500 });
    }
  }
}
