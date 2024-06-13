import RegisterForm from "./RegisterForm"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "../api/auth/[...nextauth]/route"


const page = async () => {
  const session = await getServerSession(authOptions);
  
  if(session) redirect("/dashboard");

  return (
    <RegisterForm/>
  )
}

export default page