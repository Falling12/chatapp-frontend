import { Suspense } from "react";
import getPossibleFriends from "./libs/getPossibleFriends";
import User from "./components/User";

export default async function Home() {
  const possibleFriends = await getPossibleFriends();

  return (
    <div className="flex flex-col gap-3 w-full p-2 border h-[calc(100vh-100px)] border-gray-700 rounded-xl mx-4 my-7">
      <h1 className="text-2xl text-center">Possible Friends</h1>
      <Suspense fallback={<div>Loading...</div>}>
          {possibleFriends.map((friend: User) => (
            <User friend={friend} key={friend.id}/>
          ))}
      </Suspense>
    </div>
  )
}
