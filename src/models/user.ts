import mongoose from "mongoose";

// This is the Schema. It defines the strict structure of a single User document.
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,   // The user CANNOT leave this blank
        unique: true,     // No two users can have the exact same username
        trim: true        // Automatically removes accidental spaces before/after the name
    },
    email: {
        type: String,
        required: true,   // The user CANNOT leave this blank
        unique: true,     // Prevents duplicate accounts with the same email
        lowercase: true,  // Automatically forces "CLAIRE@email.com" to "claire@email.com"
        trim: true
    },
    password: {
        type: String,
        required: true    // The user CANNOT leave this blank
    },
    role: {
        type: String,
        default: "user"   // Every new sign-up is a regular "user". You can manually change yourself to "admin" later in MongoDB Compass!
    },

    // THIS IS OUR NEW ACCESS CONTROL SWITCH
    isPaid: {
        type: Boolean,
        default: false // Everyone starts as a free user until they buy a subscription
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically logs the exact date and time they registered
    }
});

// Why do we do this line? Next.js re-runs code a lot. 
// This checks: "Does a User blueprint already exist?" If yes, use it. If no, create it.
export const User = mongoose.models.User || mongoose.model("User", UserSchema);


