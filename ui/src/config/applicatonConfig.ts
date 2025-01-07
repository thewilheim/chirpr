export interface IChirp {
        "id": number,
        "content": string,
        "media_url": string,
        "user_id": number,
        "user": IUser
        "parent_id": number,
        "rechirps": IRechirp[],
        "numberOfLikes": number,
        "numberOfRechirps":number,
        "createdAt": string,
        "isFollowingUser": boolean,
        "hasLikedChirp": boolean
}


export interface IChirpSend {
        "content": string,
        "media_url": string,
        "user_id": number,
        "parent_id": number,
}


export interface IUser {
        "id": number,
        "username": string,
        "first_name": string,
        "last_name": string,
        "email": string,
        "profile_picture_url": string,
        "bio": string,
        "numberOfFollowers": number,
        "numberOfFollowing": number,
        "createdAt": string
}

export interface IRechirp {
    chirp_id: number,
    user_id: number,
    user: IUser,
    chirp: IChirp,
    createdAt: string,
}

export interface IMessage { 
  id: number;
  message_from: number;
  message_to: number;
  content: string;
  created_at: string;
  conversation_id: number;
}

export interface IConversation {
  id: number;
  other_user: {
    id: number;
    username: string;
    profile_picture_url: string;
  };
} 