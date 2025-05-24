import { IncomingMessage, ServerResponse } from "http";
import UserService from "../services/user.service.js";

export default class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async registerUser(req: IncomingMessage, res: ServerResponse): Promise<void> {
  }
}