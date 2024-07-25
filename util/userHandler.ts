import User from "../model/userModel";
import crypto from "crypto";
import { compare } from "bcrypt";
export default class UserHandler {
  user!: User;

  checkChangedPassword(jwtIat: number, passwordChangedAt: Date | null) {
    console.log(passwordChangedAt);
    if (passwordChangedAt) {
      const passwordChangedAtTimeStamp: number = new Date(
        passwordChangedAt
      ).getTime();
      const changedPasswordTime: number = passwordChangedAtTimeStamp / 1000;
      console.log(jwtIat, changedPasswordTime, jwtIat < changedPasswordTime);
      return jwtIat < changedPasswordTime;
    }
    return false;
  }

  createToken(type: string) {
    if (type === "reset") {
      const resetToken = crypto.randomBytes(32).toString("hex");
      this.user.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
      this.user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

      return resetToken;
    }
    if (type === "verify") {
      const verifyToken = crypto.randomBytes(32).toString("hex");
      this.user.verifyUserToken = crypto
        .createHash("sha256")
        .update(verifyToken)
        .digest("hex");

      return verifyToken;
    }
  }
  async checkPassword(givenPass: string, documentPass: string) {
    console.log(givenPass, documentPass);
    const isMatch = await compare(givenPass, documentPass);
    console.log(isMatch);
    return isMatch;
  }

  async save() {
    await this.user.save();
  }
}
