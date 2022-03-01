import { Product, ProductModel } from "../models/products";
import client from "../database";


const productModel = new ProductModel();

describe('Test for product model', () => {
    it('should have an index product method', () => {
        expect(productModel.index).toBeDefined();
    });

    it('should have an show product method', () => {
        expect(productModel.show).toBeDefined();
    });

    it('should have an create product method', () => {
        expect(productModel.create).toBeDefined();
    });

    it('should have an delete product method', () => {
        expect(productModel.delete).toBeDefined();
    });

    const product = {
        name: "book",
        price: 30
    } as Product

    beforeAll(async () => {
        const createdProduct = await productModel.create(product)
        product.id = createdProduct.id
    });

    afterAll(async () => {
        const conn = await client.connect();
        const sql = 'ALTER SEQUENCE products_id_seq RESTART WITH 1; DELETE FROM products;'
        await conn.query(sql);
        conn.release();
    });

    it("should create new product", async () => {
        const newProduct = await productModel.create({
            name: 'testBook',
            price: 40
        } as Product);
        expect(newProduct.id).toEqual(newProduct.id);
        expect(newProduct.name).toEqual('testBook');
        expect(newProduct.price).toEqual(40);
    });
    
    it("should return all products", async () => {
        const products = await productModel.index()
        expect(products?.length).toBe(2);
    });
    
    it("should return product", async () => {
        const newProduct = await productModel.show(product.id as string)
        expect(newProduct?.id).toEqual(product.id);
        expect(newProduct.name).toEqual(product.name);
        expect(newProduct.price).toEqual(product.price);
    });
    
    it("should delete product", async () => {
        let deletedProduct = await productModel.delete(product.id as string);
        expect(deletedProduct.id).toBe(product.id);
    });
})