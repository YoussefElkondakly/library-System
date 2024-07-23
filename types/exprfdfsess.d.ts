import { Request } from "express";
import { User } from "model/usermodel";

declare global  {
  namespace Express {
  interface Request {
    user: User|null;
    category:string;
  }
}
interface MailOptions{
  
      email:string;
      subject:string;
      message:string;
    
}
}
