import express, {Request, Response} from "express";
import CreateProductUseCase from "../../../usecase/product/create/create.product.usecase";
import ListProductUseCase from "../../../usecase/product/list/list.product.usecase";
import ProductRepository from "../../product/repository/sequelize/product.repository";
import { eventDispatcher } from "../express";

export const productRoute = express.Router();

productRoute.post("/", async (req: Request, res: Response)=>{
    try{
        const usecase = new CreateProductUseCase(new ProductRepository(), eventDispatcher);        
        const inputDto = {
            name: req.body.name,
            price: req.body.price
        }
    
        const output = await usecase.execute(inputDto);
        res.send(output);
    }catch(err){
        res.sendStatus(500);
    }
});

productRoute.get("/", async (_req: Request, res: Response)=>{
    try{
        const usecase = new ListProductUseCase(new ProductRepository());
        const output = await usecase.execute({});
        res.send(output);
    }catch(err){
        res.sendStatus(500)
    }
})