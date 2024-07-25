import {
  Length,
  AllowNull,
  Column,
  BeforeUpdate,
  BeforeCreate,
  Table,
  Model,
  DataType,
  HasMany,
  Unique,
  Default,ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import User from "./userModel";
import Books from "./booksModel";
@Table
export default class OrderedBooks extends Model {
  @AllowNull(false)
  @Column
  bookingType!: string;
  @AllowNull(false)
  @Column({
    type: DataType.DATE,
  })
  returnDate!: Date;
  @Default(false)
  @Column
  state!: boolean;
  @ForeignKey(() => User)
  @Column
  userId!: number;

  @BelongsTo(() => User)
  user!: User;
  @ForeignKey(() => Books)
  @Column
  bookId!: number;

  @BelongsTo(() => Books)
  book!: Books;

  @BeforeCreate
  static async checkIfTheUserOrderdAbook(obj: OrderedBooks) {
    const book = await this.findAll({where:{userId:obj.userId}})
    if(book[0]){
      throw new Error("You have already ordered a book")
      }
      
  }
}