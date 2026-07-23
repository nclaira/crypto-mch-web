import { Schema, model, models } from "mongoose";  

const BookStruct = new Schema(    // Model that defines structure of table fields (columns) needed
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String },     
    accessType: { type: String, enum: ["Free", "Paid"], default: "Paid" },   // "Free" or "Paid"
    price: { type: Number, default: 5000 }, // Price in RWF
    description: { type: String },
    type: { type: String, enum: ["ebook", "video"], default: "ebook" }, // Allows uploading videos too!
    previewUrl: { type: String },   // Link to the preview / sample file or video teaser
    pdfUrl: { type: String },       // Link to the full book file or full video
  },
  { timestamps: true }     // Automatically records createdAt and updatedAt dates
);

const Book = models.Book || model("Book", BookStruct);
export default Book;