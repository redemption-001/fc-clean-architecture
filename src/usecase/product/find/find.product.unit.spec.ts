import Product from "../../../domain/product/entity/product";
import FindProductUSeCase from "./find.product.usecase";

describe("Find product use case tests", ()=>{
    const product = new Product("123", "Product 1", 5.02)
    const MockRepository = () =>{
        return {
            find: jest.fn().mockReturnValue(Promise.resolve(product)),
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        }
    }

    it("Should find a product", async()=>{
        const repository = MockRepository();
        const usecase = new FindProductUSeCase(repository);   
        
        const input = {id: "123"};
        
        const output = {
            id: "123",
            name: "Product 1",
            price: 5.02
        }        
        
        const result = await usecase.execute(input);

        expect(result).toEqual(output);
    })

    it("Should not find a product", async()=>{
        const repository = MockRepository();
        repository.find.mockImplementation(()=>{
            throw new Error("Product not found");
        });
        const usecase = new FindProductUSeCase(repository);   
        
        const input = {id: "123"};
        
        const output = {
            id: "123",
            name: "Product 1",
            price: 5.02
        }        
        
        expect(async ()=>{
            return await usecase.execute(input);

        }).rejects.toThrow("Product not found");

    })
})