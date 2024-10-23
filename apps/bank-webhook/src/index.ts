import express from "express"
import db from "@repo/db/client"
const cors = require('cors');
const app = express();

app.use(cors({
    origin: '*' // Replace with the frontend URL you want to allow
  }));
  app.use(express.json())

  app.get('/' , async(req , res)=>{
    res.send("Hello World!")
  })

app.post("/hdfcwebhook" , async (req , res)=>{
    console.log(req.body)
    const paymentInformation :{
        token:string ,
        userId : number,
        amount:number
    } = {
        token : req.body.token,
        userId : req.body.userId,
        amount:req.body.amount
    }
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
   console.log(req.body)
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


app.listen(8000 , ()=>{
    console.log("Listening on port 8000")
})
