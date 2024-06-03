import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route";
import HomeClient from "@/components/HomeClient";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return <HomeClient session={session} />;
}
