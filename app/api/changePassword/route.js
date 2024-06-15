import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
    try {
        const { email, newPassword } = await req.json();

        const session = await getServerSession(authOptions);

        if(session.user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findFirst({
            where: { email: email }
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { email: email },
            data: { password: hashedPassword }
        });

        return NextResponse.json({ message: "Password successfully changed." });
    } 
    catch (error) {
        console.error("Error during password change:", error);
        return NextResponse.json({ message: "An error occurred while changing the password." }, { status: 500 });
    }
}
