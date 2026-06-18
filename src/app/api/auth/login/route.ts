import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";  
import { User } from "@/models/user"; // Uses our User structure blueprint
import bcrypt from "bcryptjs";        // Tool to check the scrambled password
import jwt from "jsonwebtoken";       // Tool to create the digital hand-stamp pass


// A temporary secret key to lock your tokens offline
const SECRET_KEY = "my_super_secret_offline_key";

export async function POST(request: Request) {
    try {
        // 1. Connect to your local database
        await connectDB();

        // 2. Read the email and password typed in Postman
        const body = await request.json();
        const { email, password } = body;

        // 3. Stop if they left email or password blank
        if (!email || !password) {
            return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
        }

        // 4. Search your local database to find this email
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User not found!" }, { status: 400 });
        }

        // 5. Compare the typed password with the scrambled one in MongoDB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Wrong password!" }, { status: 400 });
        }

        // 6. Generate JWT Token
        const token = jwt.sign(
            { 
                userId: user._id, 
                username: user.username, 
                role: user.role,
                isPaid: user.isPaid  //you can change isPaid: to false or true to test in the postman
            },
            SECRET_KEY,
            { expiresIn: "1d" }   //Generate the digital pass (JWT Token) that expires in 1 day
        );

     

        // 8. Prepare a success message
        const response = NextResponse.json({ 
            message: "Login successful!",
            user: { username: user.username, 
                    role: user.role,
                    isPaid: user.isPaid   // to test u change to false or true
                  }

        });
        git add src/app/books src/app/categories src/app/trending
git commit -m "feat: complete categories marketplace and paywall routing structures"
git push origin main

        

        // 9. Drop the pass into the user's browser storage (Cookie)
        response.cookies.set("token", token, {
            httpOnly: true, // Super secure: hacker scripts cannot read this cookie
            path: "/",     // Valid for your whole website application
            maxAge: 60 * 60 * 24 // Cookie automatically disappears in 24 hours
        });

        return response;

    } catch (error) {
        return NextResponse.json({ error: "Login server crashed" }, { status: 500 });
    }
}

