import Product from "../../../domain/product/entity/product";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import { InputCreateProductDto, OutputCreateProductDto } from "./create.product.dto";
import {v4 as uuid} from "uuid"
import EventDispatcherInterface from "../../../domain/@shared/event/event-dispatcher.interface";
import ProductCreatedEvent from "../../../domain/product/event/product-created.event";

export default class CreateProductUseCase {
    private productRepository: ProductRepositoryInterface
    private eventDispatcher: EventDispatcherInterface

    constructor(repository: ProductRepositoryInterface, 
            eventDispacther: EventDispatcherInterface){
        this.productRepository = repository;
        this.eventDispatcher = eventDispacther;
    }

    async execute(input: InputCreateProductDto): Promise<OutputCreateProductDto>{
        const product = new Product(uuid(), input.name, input.price);
        await this.productRepository.create(product);

        const productCreatedEvent = new ProductCreatedEvent({
            name: input.name,
            description: `Product ${input.name} created`,
            price: input.price,
        });

        this.eventDispatcher.notify(productCreatedEvent);

        return {
            id: product.id,
            name: product.name,
            price: product.price
        };
    }

}