import CreateProductUseCase from "./create.product.usecase";

describe("Create Product Use case unit tests", ()=>{
    
    const MockRepository = () =>{
       return {
            find: jest.fn(),
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn()
       }
    }

    const MockDispatcher = () =>{
        return {
            notify: jest.fn().mockImplementation(()=>{console.log(`Sending email to .....`);}),
            register: jest.fn(),
            unregister: jest.fn(),
            unregisterAll: jest.fn()
        }
    }

    const repository = MockRepository();
    const dispatcher = MockDispatcher();

    it("Should create a product", async ()=>{
        const productCreateUseCase = new CreateProductUseCase(repository, dispatcher);
        const input = {
            name: "Product 1",
            price: 2.56
        }

        const output = await productCreateUseCase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            name: "Product 1",
            price: 2.56
        })

    })

    it("Should throw an error when name is missing", async ()=>{
        const productCreateUseCase = new CreateProductUseCase(repository, dispatcher);
        const input = {
            name: "",
            price: 2.56
        }

        await expect(()=>{
            return productCreateUseCase.execute(input);
        }).rejects.toThrow("Name is required")
    })

    it("Should throw an error when price is less than zero", async ()=>{
        const productCreateUseCase = new CreateProductUseCase(repository, dispatcher);
        const input = {
            name: "Product 1",
            price: -1.56
        }

        await expect(()=>{
            return productCreateUseCase.execute(input);
        }).rejects.toThrow("Price must be greater than zero")
    })

})