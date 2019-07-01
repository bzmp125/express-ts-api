export interface UserAuth {
  iss: string;
  user: {
    id: string;
    email: string;
  };
}
