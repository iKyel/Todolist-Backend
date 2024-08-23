import { User } from "../models/user.models";
import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: User;
}
