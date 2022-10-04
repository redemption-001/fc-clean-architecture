import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import FindProductUSeCase from "./find.product.usecase";

describe("Find product use case tests", ()=>{
    let sequelize :Sequelize;

    beforeEach(async()=>{
        sequelize = new Sequelize({
           dialect: "sqlite" ,
           storage: ":memory:",
           logging: false,
           sync: {force: true}
        });
        await sequelize.addModels([ProductModel])
        await sequelize.sync();
    })

    afterEach(async()=>{
        await sequelize.close();
    })

    it("Should find a product", async()=>{
        const repository = new ProductRepository();
        const usecase = new FindProductUSeCase(repository);

        const product = new Product("123", "Refresh eye drops", 12.2)                
        await repository.create(product);

        const input = {id: product.id};
        
        const output = {
            id: product.id,
            name: product.name,
            price: product.price
        }

        const result = await usecase.execute(input);

        expect(result).toEqual(output);
    })

    it("Should throw an error when product is not found", async()=>{
        const repository = new ProductRepository();
        const usecase = new FindProductUSeCase(repository);

        const input = {id: "a3cfaq1"};
        
        expect(async ()=>{
            return await usecase.execute(input);
        }).rejects.toThrow("Product not found");

    })
})