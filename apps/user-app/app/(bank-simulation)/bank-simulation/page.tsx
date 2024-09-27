import { Card } from "@repo/ui/card";
import prisma from "@repo/db/client";
import BankSimulations from "../../../components/BankSimulations";

interface Trans {
  id: number;
  status: "Success" | "Failure" | "Processing";
  token: string;
  provider: string;
  amount: number;
  startTime: Date;
  userId: number;
}

async function getOnRampTransactions() {
  const txns = await prisma.onRampTransaction.findMany();
  return txns.map((t: Trans) => ({
    id: t.id,
    userId: t.userId,
    time: t.startTime,
    amount: t.amount,
    status: t.status,
    provider: t.provider,
    token : t.token
  }));
}

export default async function () {
  const transactions = await getOnRampTransactions();

  return (
    <div className="w-full">
      <Card title="Bank Simulation">
        <BankSimulations transactions={transactions} />
      </Card>
    </div>
  );
}
