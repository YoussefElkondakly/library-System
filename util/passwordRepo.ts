import { compare } from 'bcrypt';
import { hash } from 'bcrypt';
export default class Password {
  private password!: string;
  set(pass: string) {
    this.password = pass;
  }
  async hashPassword() {
    return await hash(this.password, 12);
  }
  async comparePassword(inputPass: string, savedPass: string) {
    return await compare(inputPass, savedPass);
  }
}