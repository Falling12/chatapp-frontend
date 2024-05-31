interface Message {
    id: string;
    text: string;
    createdAt: string;
    updatedAt: string;
    user: User;
}

interface User {
    id: string;
    name: string;
    email: string;
    imageUrl: string;
    friendsCount: number;
}