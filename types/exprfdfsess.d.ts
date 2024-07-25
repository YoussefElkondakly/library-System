import { Request } from "express";
declare global  {
  namespace Express {
  interface Request {
    user: User|null;
    category:string;
    skipMiddleWare:boolean
  }
}
interface MailOptions{
  
      email:string;
      subject:string;
      message:string;
    
}

}
