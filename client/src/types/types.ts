
export interface productType {
  _id: string;
  title: string;
  description: string;
  basePrice: number;
  discountPrice?: number;
  currency: string;
  variants: variantType[];
  categories: categoryRefType[];
  collections: collectionRefType[];
  imgs: imageType[];
}

export interface variantType {
  _id: string;
  sizeCode: string;
  inventory: {
    stock: number;
    barcode: string;
    reserved: number;
    warehouseLocation?: string;
  }
  priceAdjustment?: number;
}

export interface categoryRefType {
  categoryId: string;
  name: string;
}

export interface collectionRefType {
  collectionId: string;
  title: string;
}

export interface imageType {
  url: string;
  altText: string;
  isPrimary?: boolean;
}

export type FriendsContextType = {
  // myFriends: UserType[];
  // friendRequests: FriendRequestType[];
  // sentFriendRequests: FriendRequestType[];
  // friendRequestUsers: UserType[];
  sendFriendRequest: (id: string) => void;
  acceptFriendRequest: (id: string)=> void;
  declineFriendRequest: (id: string)=> void;
  removeFriendRequest: (id: string) => void;
  removeFriend: (id: string) => void;
  refreshLists: () => void;
  resetLists: () => void;
};

export type AuthContextType = {
  // currentUser: UserType | null;
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
