import { Suspense } from "react";
import Friends from "@/app/components/Friends";
import SocketRoom from "./components/SocketRoom";

export default function Home() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Friends />
      </Suspense>

      <SocketRoom />
    </div>
  )
}
