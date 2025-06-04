import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";
import {ethers} from "ethers";

export const authOptions = {
    providers: [
      CredentialsProvider({
          name: 'Credentials',
          credentials: {
            phone: { label: "Phone number", type: "text", placeholder: "1231231231", required: true },
            password: { label: "Password", type: "password", required: true }
          },
          async authorize(credentials: any) {
            // Do zod validation, OTP validation here
            const hashedPassword = await bcrypt.hash(credentials.password, 10);
            const wallet =  ethers.Wallet.createRandom()
            const existingUser = await db.user.findFirst({
                where: {
                    number: credentials.phone
                }
            });

            if (existingUser) {
                console.log(existingUser.number)
                const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
                if (passwordValidation) {
                    // localStorage.setItem("walletAddress", JSON.stringify(existingUser?.walletAddress))

                    return {
                        id: existingUser.id.toString(),
                        name: existingUser.name,
                        email: existingUser.number,
                        walletAddress : existingUser.walletAddress
                    }
                }
                return null;
            }

            try {
               const result =  await db.$transaction(async(tx)=>{
                   const user = await tx.user.create({
                        data: {
                            number: credentials.phone,
                            password: hashedPassword,
                            walletAddress: wallet.address,
                            privateKey: wallet.privateKey,
                        }
                    });
                    await tx.balance.create({
                        data:{
                            userId:Number(user.id),
                            amount:0,
                            locked:0,
                        }
                    })
                    // localStorage.setItem("walletAddress", JSON.stringify(wallet?.address))
                    return {
                        id: user.id.toString(),
                        name: user.name,
                        email: user.number,
                        walletAddress : wallet.address
                    }
                })
                return result
            
                
            } catch(e) {
                console.error(e);
            }

            return null
          },
        })
    ],
    secret: process.env.JWT_SECRET || "secret",
    callbacks: {
        async session({ token, session }: any) {
            session.user.id = token.sub
            return session
        }
    }
  }
  