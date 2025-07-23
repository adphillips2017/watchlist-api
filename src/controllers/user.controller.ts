import { IncomingMessage, ServerResponse } from "http";
import { ApiError } from '../errors/api.error.js';
import UserService from "../services/user.service.js";



export default class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Handles user registration requests.
   * Expects username and password in req.body, which is set by bodyParser.middlware
   * @param req The IncomingMessage object.
   * @param res The ServerResponse object.
   */
  async registerUser(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      const { username, password } = req.body;
      const newUser = await this.userService.registerUser(username, password);

      res.statusCode = 201;
      res.end(JSON.stringify({
        message: 'User registered successfully.',
        user: newUser
      }));

    } catch (error) {
      if (error instanceof ApiError) {
        res.statusCode = error.error.statusCode;
        res.end(JSON.stringify({ message: error.error.message }));
      } else {
        console.error('Unhandled error in registerUser controller:', error);
        res.statusCode = 500;
        res.end(JSON.stringify({ message: 'Unexpected error registering new user.' }));
      }
    }
  }

  /**
   * Handles user login requests.
   * Expects username and password in req.body, which is set by bodyParser.middlware
   * @param req The IncomingMessage object.
   * @param res The ServerResponse object.
   */
  async loginUser(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      const { username, password } = req.body;
      const { token, user } = await this.userService.loginUser(username, password);

      res.statusCode = 200;
      res.end(JSON.stringify({
        message: 'Login successful.',
        user,
        token
      }));

    } catch (error) {
      if (error instanceof ApiError) {
        res.statusCode = error.error.statusCode;
        res.end(JSON.stringify({ message: error.error.message }));
      } else {
        console.error('Unhandled error in loginUser controller:', error);
        res.statusCode = 500;
        res.end(JSON.stringify({ message: 'Unexpected error logging in.' }));
      }
    }
  }
}
