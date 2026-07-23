

import { NextResponse } from "next/server";
import { Client, Environment, OrdersController } from "@paypal/paypal-server-sdk";


const paypalClient = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID || "",
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET || "",
  },
  environment: Environment.Sandbox,
});


const ordersController = new OrdersController(paypalClient);


export async function POST(request: Request) {
  try {
    const { price } = await request.json();


    const response = await ordersController.ordersCreate({
      body: {
        intent: "CAPTURE",
        purchaseUnits: [{
          amount: { currencyCode: "USD", value: price.toString() }
        }]
      }
    });


    return NextResponse.json({ id: response.result.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
