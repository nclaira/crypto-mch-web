import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/authHelper"; // Double check your folder path if you get an import error!

export async function GET(request: NextRequest) {
    const user = getAuthUser(request);
    console.log("BOUNCER CHECK -> User payload found is:", user); 
    const { searchParams } = new URL(request.url);
    const downloadType = searchParams.get("type"); // Expecting "preview" or "full"

    // 1. Preview Download (Free for Everyone)
    if (downloadType === "preview") {
        return NextResponse.json({ message: "Success! Here is your 5-page sample PDF." });
    }

    // 2. Full Book Download (Paid Users Only)
    if (downloadType === "full") {
        if (!user || user.isPaid === false) {
            return NextResponse.json({ error: "Access Denied. You must purchase the full book!" }, { status: 403 });
        }
        return NextResponse.json({ message: `Success! Enjoy the full book, ${user.username}.` });
    }

    return NextResponse.json({ error: "Invalid request type. Use ?type=preview or ?type=full" }, { status: 400 });
}
