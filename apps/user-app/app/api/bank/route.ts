import { NextRequest, NextResponse } from "next/server"
import db from "@repo/db/client"
import z from "zod"
export const POST = async(req : NextRequest) => {
    const body = await req.json()
    const Payment = z.object({
        token:z.string() ,
        userId : z.number(),
        amount:z.number()
    })
    const paymentInformation = Payment.parse(body)
    console.log(paymentInformation)
    try {
        await db.$transaction([
            db.balance.updateMany({
               where :{
                   userId : Number(paymentInformation.userId)
               },
               data:{
                   amount:{
                       increment:Number(paymentInformation.amount)
                   }
               }
           }),    
            db.onRampTransaction.update({
               where:{
                   token:paymentInformation.token
               },
               data:{
                   status:"Success"
               }
           })
       ])
       return NextResponse.json({message: "Captured"} , )
    } catch (e) {
        console.log('====================================');
        console.log(e); 
        console.log('====================================');
        NextResponse.json({
            message : "Error on webhook processing"
        } , {status:411})
    }
}