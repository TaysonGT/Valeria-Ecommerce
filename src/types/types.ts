export type UserType = {
  id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  created_at: Date;
}

export type PostType = {
  id: string;
  user_id: string;
  content: string;
  created_at: Date;
}

export type FriendRequestType = {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: string;
}

export type LikeType = {
  id: string;
  user_id: string;
  type: string;
  comment_id: string | null;
  post_id: string | null;
}

export type CommentType = {
  id: string;
  user_id: string;
  content: string;
  post_id: string;
  created_at: Date;
}

export type FriendsContextType = {
  myFriends: UserType[];
  friendRequests: FriendRequestType[];
  sentFriendRequests: FriendRequestType[];
  friendRequestUsers: UserType[];
  sendFriendRequest: (id: string) => void;
  acceptFriendRequest: (id: string)=> void;
  declineFriendRequest: (id: string)=> void;
  removeFriendRequest: (id: string) => void;
  removeFriend: (id: string) => void;
  refreshLists: () => void;
  resetLists: () => void;
};

export type AuthContextType = {
  currentUser: UserType | null;
  token: string | null;
  refreshCurrentUser: ()=> void
  refreshToken: ()=> void
  resetAuth: () => void;
  checkAuth: () => void;
};

export type SignupDataType = {
  username: string;
  firstname: string;
  lastname: string;
  password: string;
  validPassword: string;
  email: string;
  gender: string;
}
