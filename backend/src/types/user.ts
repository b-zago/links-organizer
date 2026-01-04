export type UserLoginData = {
  username: string;
  password: string;
};

export type UserRegisterData = UserLoginData & {
  email: string;
};

// export type UserAuthData = {
//   id: number;
//   username: string;
//   email: string;
// };
