import { Sequelize } from "sequelize-typescript"
import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import UpdateProductUseCase from "./update.product.usecase";

describe("Update product usecase integration tests",()=>{
    let sequelize: Sequelize;
    beforeEach(async()=>{
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: {force: true},
        })

        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
    })

    afterEach(async ()=>{
        await sequelize.close();
    })

    it("Should update a product", async ()=>{
        const productRepository = new ProductRepository();
        const productUpdateUseCase = new UpdateProductUseCase(productRepository);
        let product = new Product("123", "product 1", 15.40);
        await productRepository.create(product);        

        const input = {
            id: product.id,
            name: "super product",
            price: 20.45
        }
        
        const output =  await productUpdateUseCase.execute(input);

        expect(output).toEqual(input);
    })

})