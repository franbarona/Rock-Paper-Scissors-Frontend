export interface User {
  id: number;
  username: string;
  email: string;
}

export interface UpdateUserRequest {
  username: string;
  email: string;
}