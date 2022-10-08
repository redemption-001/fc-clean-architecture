import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import EventDispatcher from "../../domain/@shared/event/event-dispatcher";
import EventDispatcherInterface from "../../domain/@shared/event/event-dispatcher.interface";
import SendEmailWhenProductIsCreatedHandler from "../../domain/product/event/handler/send-email-when-product-is-created.handler";
import CustomerModel from "../customer/repository/sequelize/customer.model";
import ProductModel from "../product/repository/sequelize/product.model";
import { customerRoute } from "./routes/customer.route";
import { productRoute } from "./routes/product.route";

export const app: Express = express();
app.disable("x-powered-by");
app.use(express.json());
app.use("/customer", customerRoute);
app.use("/product", productRoute);

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
  sequelize.addModels([CustomerModel, ProductModel]);
  await sequelize.sync();
}
setupDb();

export let eventDispatcher: EventDispatcherInterface = new EventDispatcher();

function registerAllEvents(){
  const eventHandler = new SendEmailWhenProductIsCreatedHandler();
  eventDispatcher.register("ProductCreatedEvent", eventHandler);
}

registerAllEvents();