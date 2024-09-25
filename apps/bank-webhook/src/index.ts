import express from "express"
import db from "@repo/db/client"
const app = express();

app.post("/hdfcwebhook" , async (req , res)=>{
    const paymentInformation = {
        token : req.body.token,
        userId : req.body.user_identifier,
        amount:req.body.amount
    }

    try {
        await db.$transaction([
            db.balance.update({
               where :{
                   userId : paymentInformation.userId
               },
               data:{
                   amount:{
                       increment:paymentInformation.amount
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
   
       res.json({
           message: "Captured"
       })
    } catch (e) {
        console.log('====================================');
        console.log(e);
        console.log('====================================');
        res.status(411).json({
            message : "Error on webhook processing"
        })
    }
})


app.listen(8080)