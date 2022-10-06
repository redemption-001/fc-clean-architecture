import request from "supertest";
import { app, sequelize } from "../express"

describe("E2E test for product", ()=>{
    beforeEach(async()=>{
        await sequelize.sync({force: true});
    })

    afterAll(async ()=>{
        await sequelize.close();
    })

    it("Should create a product", async ()=>{
        const response = await request(app)
            .post("/product")
            .send({
                name: "product 1",
                price: 51.2
            });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("product 1");
        expect(response.body.price).toBe(51.2);
    })

    
    it("Should not create a product", async ()=>{
        const response = await request(app)
            .post("/product")
            .send({
                name: "product 1",
            });

        expect(response.status).toBe(500);
    })

    it("Should list products", async ()=>{
        const response1 = await request(app)
            .post("/product")
            .send({
                name: "product 1",
                price: 151.25
            });

        expect(response1.status).toBe(200);

        const response2 = await request(app)
            .post("/product")
            .send({
                name: "product 2",
                price: 24.48
            });
        
        expect(response2.status).toBe(200);

        const listResponse = await request(app).get("/product");
        expect(listResponse.status).toBe(200);
        expect(listResponse.body.products.length).toBe(2);

        expect(listResponse.body.products).toContainEqual({
            id: expect.any(String),
            name: "product 1",
            price: 151.25
        });

        expect(listResponse.body.products).toContainEqual({
            id: expect.any(String),
            name: "product 2",
            price: 24.48
        });
    })

})