import User from "./user.model.js";

export default interface LoginResponse {
  user: Omit<User, 'password_hash'>,
  token: string
}
