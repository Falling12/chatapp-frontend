import { getServerSession } from "next-auth";
import { authOptions } from "../utils/auth";

export default async function getUserFriends() {
  const session = await getServerSession(authOptions);

  const res = await fetch('http://localhost:8000/api/user/friends', {
    headers: {
        'authorization': session?.user.token as string,
        'Content-Type': 'application/json'
    }
  })

  // handle unauthorized
  if (res.status === 401) {
    return {
      friends: []
    }
  }

  const { friends } = await res.json()

  return friends
}