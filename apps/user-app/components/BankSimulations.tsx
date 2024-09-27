"use client"
import { Button } from "@repo/ui/button";
import axios from "axios";

const BankSimulations = ({
  transactions,
}: {
  transactions: {
    id: number;
    status: "Success" | "Failure" | "Processing";
    provider: string;
    amount: number;
    userId: number;
    token : string
  }[];
}) => {
  return (
    <table className=" w-full max-h-[90vh]">
      <tr>
        <th>UserId</th>
        <th>Provider</th>
        <th>amount</th>
        <th>Action</th>
      </tr>
      {transactions.map((t) => (
        <tr key={t.id} className=" text-center my-10"> 
          <td className=" py-2" >{t.userId}</td>
          <td>{t.provider}</td>
          <td>{t.amount}</td>
          <td>
            <Button
            onClick={async () => {
              await axios.post("http://localhost:8080/hdfcwebhook/" , {
                token : t.token , 
                userId : t.userId , 
                amount : t.amount
              },
              {
                headers: {
                  'Content-Type': 'application/json',  
                },
            }
            )
            }}>
                {t.status}
            </Button>
          </td>
        </tr>
      ))}
    </table>
  );
};

export default BankSimulations;
