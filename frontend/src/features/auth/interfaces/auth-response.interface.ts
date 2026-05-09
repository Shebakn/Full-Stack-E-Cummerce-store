import type { User } from "@/common/interfaces/user.interface";

export interface AuthResponse {
  user: User;
  token: string;
}