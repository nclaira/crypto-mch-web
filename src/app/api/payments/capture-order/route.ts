import { NextResponse } from "next/server";
import { Client, Environment, OrdersController } from "@paypal/paypal-server-sdk";
// import User from "@/models/User"; // Import your MongoDB user model setup here


const paypalClient = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID || "",
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET || "",
  },
  environment: Environment.Sandbox
  
  ,
});



const ordersController = new OrdersController(paypalClient);


export async function POST(request: Request) {
  try {
    const { orderID, userId } = await request.json();


    const response = await ordersController.ordersCapture({ id: orderID });


    if (response.result.status === "COMPLETED") {
      // AUTOMATION STAGE: Connect your MongoDB user status alteration here
      // await dbConnect();
      // await User.findByIdAndUpdate(userId, { isPaid: true });


      return NextResponse.json({ success: true, message: "Account upgraded seamlessly!" });
    }


    return NextResponse.json({ success: false, message: "Payment incomplete." }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

