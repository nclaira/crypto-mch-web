import { Schema, model, models } from "mongoose";  

const BookStruct = new Schema(    //model that defines structure of table .fields(columns) needed
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String },     
    accessType: { type: String },   // "Free" or "Paid"
    previewUrl: { type: String },   // ◄─── ADD THIS: Link to the 5-page sample file!
    pdfUrl: { type: String },       // Link to the full book file
  },
  { timestamps: true }     //record time of submission of ur request
);



const Book = models.Book || model("Book", BookStruct);
export default Book;


//remember how we declare class with capital letter

// when function is inside a class we call them methods  