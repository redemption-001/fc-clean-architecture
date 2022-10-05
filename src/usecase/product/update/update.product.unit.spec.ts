import Product from "../../../domain/product/entity/product"
import UpdateProductUseCase from "./update.product.usecase"

describe("Update product use case unit tests", ()=>{
    const product = new Product("123", "Product 1", 10.5)
    const MockRepository = () =>{
        return {
            find: jest.fn().mockReturnValue(product),
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn()
        }
    }

    it("Should update product's name", async()=>{
        const productRepository = MockRepository();
        const productUpdateUseCase = new UpdateProductUseCase(productRepository);
        const input = {
            id: product.id,
            name: "new Product",
            price: product.price
        }
        const output = await productUpdateUseCase.execute(input);
        expect(output).toEqual(input);
    })

    it("Should update product's price", async()=>{
        const productRepository = MockRepository();
        const productUpdateUseCase = new UpdateProductUseCase(productRepository);
        const input = {
            id: product.id,
            name: product.name,
            price: 1.99
        }
        const output = await productUpdateUseCase.execute(input);
        expect(output).toEqual(input);
    })

    it("Should throw an error when product's name is missing", async()=>{
        const productRepository = MockRepository();
        const productUpdateUseCase = new UpdateProductUseCase(productRepository);
        const input = {
            id: product.id,
            name: "",
            price: product.price
        }
        expect(async ()=>{
            return await productUpdateUseCase.execute(input);
        }).rejects.toThrow("Name is required")
    })

    it("Should throw an error when product's price is less than zero", async()=>{
        const productRepository = MockRepository();
        const productUpdateUseCase = new UpdateProductUseCase(productRepository);
        const input = {
            id: product.id,
            name: "new product",
            price: -15
        }

        expect(async ()=>{
            return await productUpdateUseCase.execute(input);
        }).rejects.toThrow("Price must be greater than zero")
    })
})