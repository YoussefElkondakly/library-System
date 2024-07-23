import {
  Column,
  Table,
  Model,
  HasMany,
} from "sequelize-typescript";
import Books from "./booksModel";
@Table
export default class Categories extends Model {
  @Column
  name!:string

  @HasMany(() => Books)
  books!: Books[];
}