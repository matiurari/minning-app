import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server"

export async function POST(req) {
    try {
        const { name, email, password } = await req.json();
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user data into the database using Prisma Client
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        return NextResponse.json({ message: "User registered successfully.", user: newUser });
    } 
    catch (error) {
        return NextResponse.json({ message: "An error occurred while registering the user."}, { status: 500});
    }
}
