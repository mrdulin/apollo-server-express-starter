interface IUser {
  id: string;
  name: string;
}

interface IUserModel extends IUser {
  friends: string[];
}

export { IUser, IUserModel };
