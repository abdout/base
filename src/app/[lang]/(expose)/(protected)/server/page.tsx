export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { UserInfo } from "@/components/auth/user-info";
import { currentUser } from "@/lib/auth";

const ServerPage = async () => {
  const user = await currentUser();

  return ( 
    <UserInfo
      label=""
      user={user}
    />
   );
}
 
export default ServerPage;