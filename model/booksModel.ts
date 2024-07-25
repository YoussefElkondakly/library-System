import {
  Model,
  Table,
  ForeignKey,
  Column,
  BelongsTo,
  Default,
  DataType,
  AllowNull,
} from "sequelize-typescript";
import User from "./userModel";
import Categories from "./categoriesModel";
@Table
export default class Books extends Model {
  @Column
  name!: string;
  @Default(1)
  @Column
  quantity!: number;
  @Column
  author!: string;
  @Column({
    type: DataType.DATE,
  })
  releaseDate!: Date;
  @Column
  copyrightStatus!: string;
  @Column
  language!: string;
  @Column
  credits!: string;
  @Column
  isDigital!: boolean;
  @AllowNull(true)
  @Column({
    type: DataType.STRING,
  })
  bookUrl!: string | null;
  @Column
  price!: number;
  @Column
  state!: string;
  @Column({
    type: DataType.DATE,
  })
  returnDate!: Date | null;

  @ForeignKey(() => User)
  @Column
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @ForeignKey(() => Categories)
  @Column
  categoryId!: number;
  @BelongsTo(() => Categories)
  category!: Categories;
}
