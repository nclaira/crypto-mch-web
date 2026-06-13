import mongoose, { Schema, model, models } from "mongoose";

const BookSchema = new Schema(    //model that defines structure of table
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String },     
    accessType: { type: String },   // "Free" or "Paid"
    previewUrl: { type: String },   // ◄─── ADD THIS: Link to the 5-page sample file!
    pdfUrl: { type: String },       // Link to the full book file
  },
  { timestamps: true } 
);



const Book = models.Book || model("Book", BookSchema);
export default Book;