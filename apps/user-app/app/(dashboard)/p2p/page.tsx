import { getServerSession } from "next-auth";
import { SendCard } from "../../../components/SendCard";
import { redirect } from "next/navigation";
import { authOptions } from "../../lib/auth";

export default async function() {

    const session = await getServerSession(authOptions);
  if(!session?.user) {
    return redirect('/api/auth/signin')
  }

    return <div className="w-full">
        <SendCard />
    </div>
}