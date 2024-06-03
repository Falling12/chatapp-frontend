import { getServerSession } from "next-auth";
import { authOptions } from "../utils/auth";

export default async function getPossibleFriends() {
  const session = await getServerSession(authOptions);

  const res = await fetch('http://192.168.1.231:8000/api/user/possible-friends', {
    headers: {
        'authorization': session?.user.token as string,
        'Content-Type': 'application/json'
    },
    cache: 'no-cache',
  })

  // handle unauthorized
  if (res.status === 401) {
    return []
  }

  const { possibleFriends } = await res.json()

  return possibleFriends
}