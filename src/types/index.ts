export interface User {
  id: string;
  email: string;
  isVerified: boolean;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
