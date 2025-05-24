import { UUID } from "crypto";

export default interface User {
  id: UUID,
  username: string,
  password_hash: string,
  created_at: string,
  updated_at: string
};
