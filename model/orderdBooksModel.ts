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
export default class OrderdBooks extends Model {
  @Column
  bookingType!: string;
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
}