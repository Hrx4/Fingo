"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { TextInput } from "@repo/ui/textinput";
import { useEffect, useState } from "react";
import { p2pTransfer } from "../app/lib/actions/p2pTransfer";
import {ethers} from "ethers"


export function SendCard() {
    const [number, setNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [usdcAmount, setUsdcAmount] = useState(0);
      const [usdcRate, setUsdcRate] = useState(0);
      const [loading, setLoading] = useState(false);
    
      useEffect(() => {
        const exchange = async()=>{
            await fetch('https://v6.exchangerate-api.com/v6/de16865788ee77d5cb5382d6/latest/USD').then(res=>res.json()).catch(console.error).then(data=>{
                const INR = data.conversion_rates.INR;
                console.log(INR)
                setUsdcRate(INR);
            })
            const test = await ethers.getDefaultProvider("mainnet").getBalance("0x4b776698b43b3C77e50599B1644E8eCaBd0f11e9");
            console.log(test)
        }
        exchange()
      }, [])
      useEffect(() => {
       setUsdcAmount(Number(amount) / usdcRate)
      }, [amount])

    return <div className="h-[90vh]">
        <Center>
            <Card title="Send">
                <div className="min-w-72 pt-2">
                    <TextInput placeholder={"Number"} label="Number" value={number} onChange={(value) => {
                        setNumber(value)
                    }} />
                    <TextInput placeholder={"Amount"} label="Amount" value={amount} onChange={(value) => {
                        setAmount(value)
                    }} />

                    <div className="pt-2">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                {"Usdc"}
              </label>
              <input
                onChange={(e) => "jk"}
                value={usdcAmount}
                disabled
                type="text"
                id="first_name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder={"Usdc"}
              />
            </div>
                    <div className={`pt-4 flex ${loading ? "disabled opacity-50":""} justify-center`}>
                        <Button onClick={async () => {
                            setLoading(true)
                            await p2pTransfer(number, Number(amount) * 100)
                            setAmount("")
                            setNumber("")
                            setLoading(false)
                        }}>Send</Button>
                    </div>
                </div>
            </Card>
        </Center>
    </div>
}