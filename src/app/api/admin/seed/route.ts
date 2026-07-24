import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user";

// ---------------------------------------------------------------
// POST /api/admin/seed
//
// Creates the admin user in the live MongoDB database.
// Call this ONCE after deploying to Vercel.
//
// How to call it:
//   curl -X POST https://your-domain.vercel.app/api/admin/seed \
//     -H "Content-Type: application/json" \
//     -d '{"secret":"YOUR_ADMIN_SEED_SECRET"}'
//
// To change admin credentials in the future:
//   1. Update ADMIN_EMAIL and ADMIN_PASSWORD in Vercel env vars
//   2. Delete the old admin user from MongoDB Atlas manually
//   3. Call this endpoint again with your ADMIN_SEED_SECRET
// ---------------------------------------------------------------

export async function POST(request: Request) {
  try {
    const { secret } = await request.json();

    // 1. Guard — reject anyone who doesn't know the seed secret
    if (!secret || secret !== process.env.ADMIN_SEED_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const username = process.env.ADMIN_USERNAME || "admin";

    if (!email || !password) {
      return NextResponse.json(
        { error: "ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables" },
        { status: 500 }
      );
    }

    await connectDB();

    // 2. Check if admin already exists — never create duplicates
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { message: "Admin user already exists. No changes made.", email },
        { status: 200 }
      );
    }

    // 3. Hash the password before saving — never store plain text
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Create the admin user
    await User.create({
      username,
      email,
      password: hashedPassword,
      role: "admin",
      isPaid: true,
    });

    return NextResponse.json(
      { success: true, message: `Admin user created successfully with email: ${email}` },
      { status: 201 }
    );

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
