import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../lib/auth";
import { UsdcSendCard } from "../../../components/UsdcSendCard";

export default async function () {

    const session = await getServerSession(authOptions);
      if(!session?.user) {
        return redirect('/api/auth/signin')
      }
    return <div>
                <UsdcSendCard />
        
    </div>
}