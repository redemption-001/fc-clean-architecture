import Product from "../../../domain/product/entity/product";
import ListProductUseCase from "./list.product.usecase";

describe("List products use case unit tests",()=>{
    const product = new Product("112", "Product 1", 5.48);
    const product2 = new Product("124", "Product 2", 8.99);
    const products = [product, product2];

    let MockRepository = () =>{
        return {
            find: jest.fn(),
            findAll: jest.fn().mockReturnValue(products),
            create: jest.fn(),
            update: jest.fn()
        }
    };

    it("Should list all products", async ()=>{
        const repository = MockRepository();
        const usecase = new ListProductUseCase(repository);
        const output = await usecase.execute({});
        expect(output.products).toHaveLength(2);

        expect(output.products[0].id).toBe(product.id);
        expect(output.products[0].name).toBe(product.name);
        expect(output.products[0].price).toBe(product.price);
        expect(output.products[1].id).toBe(product2.id);
        expect(output.products[1].name).toBe(product2.name);
        expect(output.products[1].price).toBe(product2.price);
    })

    it("Should not list any products", async ()=>{
        const repository = MockRepository();
        repository.findAll.mockReturnValue([]);

        const usecase = new ListProductUseCase(repository);
        const output = await usecase.execute({});
        expect(output.products).toHaveLength(0);
    })    
})