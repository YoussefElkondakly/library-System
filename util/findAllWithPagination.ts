import { FindOptions } from "sequelize";
import catchAsync from "./catchAsync";

export const findAllWithPagination = function (
  Model: any,
  options: FindOptions,
  countOption: FindOptions
) {
  return catchAsync(async (req, res, next) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const count: number = await Model.count(countOption);
    const calc = new Paginate(+page, +limit);
    const offset = calc.calculateOffset();
    options.offset = offset;
    options.limit = +limit;
    const model = await Model.findAll(options);
    // console.log(model);
    calc.calculateHasNextPage(count);
    calc.calculateHasPreviousPage();
    const pageinfo = calc.makeResponse();
    return res.status(200).json({
      status: "success",
      data: model,
      pageinfo,
    });
  });
};

class Paginate {
  page: number;
  limit: number;
  hasnextpage!: boolean;
  hasPreviousPage!: boolean;
  count!: number;
  constructor(page: number, limit: number) {
    this.page = page || 1;
    this.limit = limit || 10;
  }
  calculateOffset() {
    return (this.page - 1) * this.limit;
  }
  calculateHasNextPage(totalCount: number) {
    this.count = totalCount;
    //page > 1 ? true : false
    this.hasnextpage = this.page * this.limit >= totalCount ? false : true;
  }
  calculateHasPreviousPage() {
    this.hasPreviousPage = this.page > 1 ? true : false;
  }
  makeResponse() {
    const vals = {
      page: this.page,
      limit: this.limit,
      totalResult: this.count,
      hasNextPage: this.hasnextpage,
      hasPreviousPage: this.hasPreviousPage,
    };
    return vals;
  }
}
