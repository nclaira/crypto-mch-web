import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "my_super_secret_offline_key";

interface TokenPayload {
    userId: string;
    username: string;
    role: string;
    isPaid: boolean;
}



//   Helper to verify the user's token cookie and extract access control credentials.
//   Returns the decoded user payload if valid, or null if guest/invalid.
 
export function getAuthUser(request: NextRequest): TokenPayload | null {
    try {
        // 1. Grab the "token" cookie pass from the client request
        const tokenCookie = request.cookies.get("token");
        
        if (!tokenCookie || !tokenCookie.value) {
            return null; // No token means they are a Guest!
        }

        // 2. Peel open and verify the digital hand-stamp
        const decoded = jwt.verify(tokenCookie.value, JWT_SECRET) as TokenPayload;
        
        return decoded;
    } catch (error) {
        // If the token was tampered with or expired, treat them as a guest
        return null;
    }
}