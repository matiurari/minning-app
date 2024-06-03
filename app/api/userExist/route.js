import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { email } = await req.json();
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (user) {
            console.log("user: ", user.username);
            return NextResponse.json({ user });
        } else {
            return NextResponse.json({ user: null });
        }
    } catch (error) {
        console.error("Error checking user existence:", error);
        return NextResponse.json({ message: "An error occurred while checking user existence." }, { status: 500 });
    }
}
