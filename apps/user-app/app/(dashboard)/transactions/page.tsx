import { Card } from "@repo/ui/card";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";

async function getTransactions() {
  const session = await getServerSession(authOptions);
  const txns = await prisma.p2pTransfer.findMany({
    where: {
      OR: [
        {
          fromUserId: Number(session?.user?.id),
        },
        {
          toUserId: Number(session?.user?.id),
        },
      ],
    },
  });
  let sendCount = 0;
  const transactions = txns.map((t) => {
    if (t.fromUserId === Number(session?.user?.id)) {
      sendCount++;
    }
    return {
      fromUserNumber: t.fromUserNumber,
      toUserNumber: t.toUserNumber,
      amount: t.amount,
      timeStamp: t.timestamp,
    };
  });

  return {
    transactions,
    sendCount,
    currentUserNumber: Number(session?.user?.email),
  };
}

export default async function () {
  const { transactions, sendCount, currentUserNumber } =
    await getTransactions();

  return (
    <div className=" w-screen">
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        P2p Transactions
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        {sendCount === 0 ? (
          <Card title="Send">
            <div className="text-center pb-8 pt-8">No Recent transactions</div>
          </Card>
        ) : (
          <Card title="Send">
            {transactions.map((t) => {
              if (Number(t.fromUserNumber) === currentUserNumber) {
                return (
                  <div className="flex justify-between">
                    <div>
                      <div className="text-sm">{t.toUserNumber}</div>
                      <div className="text-slate-600 text-xs">
                        {t.timeStamp.toDateString()}
                      </div>
                    </div>
                    <div className="flex flex-col justify-center">
                      Rs {t.amount / 100}
                    </div>
                  </div>
                );
              }
              else{
                return null;
              }
            })}
          </Card>
        )}
        {transactions.length - sendCount === 0 ? (
          <Card title="Recieve">
            <div className="text-center pb-8 pt-8">No Recent transactions</div>
          </Card>
        ) : (
          <Card title="Recieve">
            {transactions.map((t) => {
              if (Number(t.toUserNumber) === currentUserNumber) {
                return (
                  <div className="flex justify-between">
                    <div>
                      <div className="text-sm">{t.fromUserNumber}</div>
                      <div className="text-slate-600 text-xs">
                        {t.timeStamp.toDateString()}
                      </div>
                    </div>
                    <div className="flex flex-col justify-center">
                      Rs {t.amount / 100}
                    </div>
                  </div>
                );
              } else {
                return null;
              }
            })}
          </Card>
        )}
      </div>
    </div>
  );
}
