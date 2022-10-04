import { Sequelize } from "sequelize-typescript"
import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ListProductUseCase from "./list.product.usecase";

describe("List products use case integration tests", ()=>{
    let sequelize: Sequelize;
    beforeEach(async()=>{
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: {force: true}
        })

        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
    })

    afterEach(async()=>{
        await sequelize.close();
    })

    it("Should list all products", async ()=>{
        const product = new Product("123", "Product 1", 2.54);
        const product2 = new Product("124", "Product 2", 4.63);
        const productRepository = new ProductRepository();
        await productRepository.create(product);
        await productRepository.create(product2);

        const usecase = new ListProductUseCase(productRepository);
        const output = await usecase.execute({})        

        expect(output.products).toHaveLength(2);

        expect(output.products).toContainEqual({
            id: product.id,
            name: product.name,
            price: product.price,
        });

        expect(output.products).toContainEqual({
            id: product2.id,
            name: product2.name,
            price: product2.price,
        });
    })

    it("Should not list any products", async ()=>{
        const productRepository = new ProductRepository();
        const usecase = new ListProductUseCase(productRepository);
        const output = await usecase.execute({})        

        expect(output.products).toHaveLength(0);
    })
})