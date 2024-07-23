import app from "./app";
import { config } from "dotenv";
import Books from "./model/booksModel";
import Categories from "./model/categoriesModel";
import InventoryBooks from "./model/inventoryBooksModel";
import OrderdBooks from "./model/orderdBooksModel";
import User from "./model/userModel";
import { Sequelize } from "sequelize-typescript";
// import { User } from "./model/usermodel";
// import { Ads } from "./model/adsmodel";
// import { RequestAd } from "./model/requestModel";

config();

// console.log(__dirname + "/model/adsmodel.js");
const pgP = process.env.PG_PASSWORD || "";
const postgres =
  typeof process.env.DB_POSTGRES === "string"
    ? process.env.DB_POSTGRES.replace("<PASSWORD>", pgP)
    : "";
const port = process.env.PORT || 3000;
const sequelize = new Sequelize(postgres,{
  logging:false
});
sequelize.addModels([User,Books, Categories, OrderdBooks,InventoryBooks]);
sequelize
  .sync(
  // {force:true}
  )
  .then(() => {
    console.log("PostGres DB connection successful\n");
    app.listen(port, () => {
      console.log("Server is running on port " + port);
    });
  })
  .catch((err) => console.log(err));

export { sequelize };
