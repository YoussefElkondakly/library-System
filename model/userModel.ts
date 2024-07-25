import {Length,AllowNull,Column,BeforeUpdate,BeforeCreate,Table,Model,DataType,HasMany, Unique, Default, HasOne} from 'sequelize-typescript'
import { hash } from 'bcrypt';
import Books from './booksModel';
import OrderedBooks from './orderedBooksModel';
import InventoryBooks from './inventoryBooksModel';

 @Table
 export default class User extends Model {
   @Unique
   @AllowNull(false)
   @Column
   userName!: string;
   @AllowNull(false)
   @Column({
    type: DataType.DATE,
   })
   birthDate!:Date;
   @AllowNull(false)
   @Column
   fullName!: string;
   @AllowNull(false)
   @Column
   phone!: string;

   @AllowNull(false)
   @Column
   email!: string;

   @AllowNull(false)
   @Column({
     allowNull: false,
     defaultValue: "PATRON",
   })
   role!: string;
   @AllowNull(false)
   @Column
   password!: string;
   @Default(false)
   @Column
   verified!: boolean;

   //  @Default(false)
   //  @AllowNull(false)
   //  @Column
   //  status!: boolean;
   @AllowNull(true)
   @Column({
     type: DataType.DATE,
   })
   passwordChangedAt!: Date | null;
   @Column({
     type: DataType.STRING,
   })
   passwordResetToken!: string | null;
   @Column({
     type: DataType.DATE,
   })
   passwordResetExpires!: Date | null;
   @Column({
     type: DataType.STRING,
   })
   verifyUserToken!: string | null;

   @BeforeUpdate
   @BeforeCreate
   static async hashingPassword(user: User) {
     user.password = await hash(user.password, 12);
   }
   @HasMany(() => Books)
   books!: Books[];

   @HasMany(() => InventoryBooks)
   inventoryBooks!: InventoryBooks[];

   @HasOne(() => OrderedBooks)
   orderedBooks!: OrderedBooks[];
 }
