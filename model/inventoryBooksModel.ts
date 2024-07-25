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
  Default,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import User from "./userModel";
import { allow } from "joi";
@Table
export default class InventoryBooks extends Model {
  @Column
  name!: string;
  @Column
  author!: string;
  @Column
  isDigital!: boolean;

  @Column({
    type: DataType.STRING,
  })
  bookUrl!: string | null;
  @Column
  category!: string;

  @ForeignKey(() => User)
  @Column
  userId!: number;

  @BelongsTo(() => User)
  user!: User;
}
