import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user";
import { sendWelcomeEmail } from "@/lib/email/welcome";
import bcrypt from "bcryptjs";


// This function catches the "Register" button data sent from Postman or your website
export async function POST(request: Request) {
    try {
        // 1. Open the connection to your local database
        await connectDB();

        // 2. Read the text fields the user typed in
        const body = await request.json();
        const { username, email, password } = body;

        // 3. Stop if any box was left empty
        if (!username || !email || !password) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // 4. Stop if someone already registered using this email
        const userExists = await User.findOne({ email });
        if (userExists) {
            return NextResponse.json({ error: "Email already taken" }, { status: 400 });
        }

        // 5. Scramble the password into gibberish so it is secure offline
        const salt = await bcrypt.genSalt(10);
        const scrambledPassword = await bcrypt.hash(password, salt);

        // 6. Create the new user account using your User Structure blueprint
        const newAccount = new User({
            username: username,
            email: email,
            password: scrambledPassword // Save the scrambled version!
        });

        // 7. Save it to your computer's local MongoDB database
        await newAccount.save();

        // 8. Send welcome email (non-blocking — registration still succeeds if this fails)
        const origin =
          request.headers.get("origin") ||
          request.headers.get("x-forwarded-host") ||
          process.env.NEXT_PUBLIC_APP_URL ||
          "https://crypto-mch-web.vercel.app";
        const baseUrl = origin.startsWith("http") ? origin : `https://${origin}`;

        await sendWelcomeEmail({
          to: email,
          username,
          loginUrl: `${baseUrl.replace(/\/$/, "")}/login`,
        });

        // 9. Send back a clean success message
        return NextResponse.json({ message: "Account created successfully!" }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ error: "Server crashed" }, { status: 500 });
    }
}