import User from "../model/userModel";
import AppError from "../util/appError";
import catchAsync from "../util/catchAsync";

export const fetchEmail=catchAsync(async (req, res, next) => {
  if (!req.body.password)
    return next(new AppError("Please Provide the password filed", 404));
  const user = await User.findAll({
    where: {
      email: req.body.email,
    },
});
if (!user) return next(new AppError("Incorrect Email or password", 404));

console.log(user.length > 1,!req.body.middleName,!req.body.birthDate)
if (user.length > 1&&!req.body.middleName&&!req.body.birthDate)return res.status(409).json({
    status: "error",
    message: "Please provide your middleName and Your BirthDate",
});

if(user.length===1){
    req.skipMiddleWare=true
    req.user=user
return next();
}
next()
})
export const fetchUserWithProvidedPersonalData = catchAsync(async (req, res, next) => {
    if(req.skipMiddleWare)return next()
  if (!req.body.password)
    return next(new AppError("Please Provide the password filed with other Data", 404));
  const user = await User.findAll({
    where: {
      email: req.body.email,
      birthDate: req.body.birthDate,
    }
  });
  if (!user) return next(new AppError("Incorrect Email or password", 404));
  let filterByMiddleName:User[];
  if (user.length > 1){
     const middleName:string= req.body.middleName
     console.log(middleName)
   filterByMiddleName = user.filter((el) => {
     const val = el.fullName.split(" ").slice(1).join(" ");
     console.log(val.toLocaleLowerCase() === middleName.toLocaleLowerCase());
    return val.toLocaleLowerCase() === middleName.toLocaleLowerCase();

   }) ;

  }
  if (filterByMiddleName!.length=== 1)  {
    req.user=filterByMiddleName!
    req.skipMiddleWare=true
    return next();
}
const userNames=filterByMiddleName!.map(user=>user.userName)
  if (user.length > 1 && !req.body.userName && filterByMiddleName!.length > 1)return res.status(409).json({
    status: "error",
    message: "Please choose one of these  usernames",
    userNames: userNames!,
  });
  next();
});
export const fetchUserWithProvidedUserName=catchAsync(async (req,res,next)=>{
        if (req.skipMiddleWare) return next();
     if (!req.body.password)
       return next(new AppError("Please Provide the password field", 404));
    const user = await User.findAll({
      where: {
        userName: req.body.userName,
      },
    });
    if (!user) return next(new AppError("Incorrect UserName or password", 404));
    req.user=user
    next()
})


