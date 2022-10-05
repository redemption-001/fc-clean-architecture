import { Sequelize } from "sequelize-typescript";
import EventDispatcher from "../../../domain/@shared/event/event-dispatcher";
import SendEmailWhenProductIsCreatedHandler from "../../../domain/product/event/handler/send-email-when-product-is-created.handler";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "./create.product.usecase";

describe("Create Product Use Case Integration tests", ()=>{
    let sequelize: Sequelize;

    beforeEach(async()=>{
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: {force: true}
        });

        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
    })

    afterEach(async()=>{
        await sequelize.close();
    })

    it("Should create a Product and trigger an event", async ()=>{
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");    
        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        
        const productRepository = new ProductRepository();
        const productCreateUseCase = new CreateProductUseCase(productRepository, eventDispatcher);

        const input = {
            name: "Product 1",
            price: 10.45
        }
        
        const output = await productCreateUseCase.execute(input);

        expect(spyEventHandler).toHaveBeenCalled();

        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price
        })

    })

    it("Should not create a Product and not trigger an event", async ()=>{
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");    
        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        
        const productRepository = new ProductRepository();
        const productCreateUseCase = new CreateProductUseCase(productRepository, eventDispatcher);

        const input = {
            name: "",
            price: 10.45
        }
        
        expect(async ()=>{
            return await productCreateUseCase.execute(input);
        }).rejects.toThrow("Name is required")

        expect(spyEventHandler).toHaveBeenCalledTimes(0);
    })
})