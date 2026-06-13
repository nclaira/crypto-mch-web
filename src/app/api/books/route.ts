import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";     
import Book from "@/models/book";
import { writeFile } from "fs/promises";
import { join } from "path";
import jwt from "jsonwebtoken";
import { parse } from "cookie";

const SECRET = process.env.JWT_SECRET || "fallback_secret";



// 1. SECURE GET REQUEST
export async function GET(request: Request) {
    try {
        await connectDB();

        const cookieHeader = request.headers.get("cookie") || "";
        const cookies = parse(cookieHeader);
        const token = cookies.token; 

        let userData: any = null;
        if (token) {
            try {
                userData = jwt.verify(token, SECRET);
            } catch (err) {
                userData = null;
            }
        }

        const books = await Book.find({});

        const processedBooks = books.map((book) => {
            const bookObj = book.toObject();

            // 1-2 Year vintage bonus rule
            const bookAgeInMs = Date.now() - new Date(bookObj.createdAt).getTime();
            const oneYearInMs = 365 * 24 * 60 * 60 * 1000; 
            const isVintageBonus = bookAgeInMs > oneYearInMs;

            if (isVintageBonus) {
                bookObj.accessType = "Free";
            }

            // Enforce preview rule
            if (bookObj.accessType === "Paid") {
                if (!userData || !userData.hasPaidForBook) { 
                    bookObj.pdfUrl = null; // Hide full file link!
                    // bookObj.previewUrl stays visible so they can read the 5 pages!
                    bookObj.message = "Preview available. Purchase required for full download.";
                }
            }

            return bookObj;
        });

        return NextResponse.json(processedBooks, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Could not fetch books securely" }, { status: 500 });
    }
}

// 2. UPGRADED POST REQUEST: Handles uploading TWO files at once!
export async function POST(request: Request) {
    try {
        await connectDB();
        const formData = await request.formData();
        
        const title = formData.get("title") as string;
        const author = formData.get("author") as string;
        const category = formData.get("category") as string;
        const accessType = formData.get("accessType") as string;
        
        // Grab BOTH files from the Postman request
        const fullFile = formData.get("file") as Blob | null;
        const previewFile = formData.get("previewFile") as Blob | null; // ◄─── New Preview File slot!

        if (!title || !author || !fullFile) {
            return NextResponse.json({ error: "Missing required fields (title, author, or file)" }, { status: 400 });
        }

        // Save File 1: The Full Book
        const fullBytes = await fullFile.arrayBuffer();
        const fullBuffer = Buffer.from(fullBytes);
        const uniqueFullUrl = `${Date.now()}-${(fullFile as any).name}`;
        const fullPath = join(process.cwd(), "public", "uploads", uniqueFullUrl);
        await writeFile(fullPath, fullBuffer);

        // Save File 2: The 5-Page Preview (Only if you uploaded one!)
        let savedPreviewUrl = "";
        if (previewFile) {
            const previewBytes = await previewFile.arrayBuffer();
            const previewBuffer = Buffer.from(previewBytes);
            const uniquePreviewUrl = `preview-${Date.now()}-${(previewFile as any).name}`;
            const previewPath = join(process.cwd(), "public", "uploads", uniquePreviewUrl);
            await writeFile(previewPath, previewBuffer);
            savedPreviewUrl = `/uploads/${uniquePreviewUrl}`;
        }

        // Save paths into MongoDB     
        const newBook = await Book.create({
            title,
            author,
            category,
            accessType,
            previewUrl: savedPreviewUrl,
            pdfUrl: `/uploads/${uniqueFullUrl}`
        });

        return NextResponse.json(newBook, { status: 201 });
    } catch (error) {
        console.error("Backend POST error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

