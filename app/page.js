import Image from "next/image";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";


export default async function Home() {


  const cookieStore = cookies();
  const supabase = createServerComponentClient({cookies: () => cookieStore});
  const {data: {user} } = await supabase.auth.getUser()
  console.log({user})

  if(!user)
  {
    return(
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Link href={'/login'}>Click here to login</Link>
    </main>
    )
  }


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Link href={'/login'}><button className={buttonVariants({ variant: "default" })}>Click here to login</button></Link>
        <h2>Team Task</h2>
    </main>
  );
}
