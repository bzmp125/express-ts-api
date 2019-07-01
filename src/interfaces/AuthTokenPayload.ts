export enum UserType {
  "user" = "user",
  "anonymous" = "anonymous"
}

export interface AuthTokenPayload {
  iss: string;
  user: {
    id: string;
    hash?: string;
    email?: string;
    type: UserType;
  };
  iat: number;
  aud: UserType;
}
