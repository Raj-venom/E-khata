import conf from '../conf/conf';
import { Client, ID, Databases, Query } from "appwrite";

class Inventory {
    client = new Client();
    databases;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);

    }

    async addProduct(data: any) {
        try {
            return await this.databases.createDocument(conf.appwriteDatabaseId, conf.productCollectionId, ID.unique(), data);

        } catch (error) {
            console.log("Appwrite service :: addProduct :: error", error);
        }
    }

    async getAllProducts() {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.productCollectionId,
                [
                    Query.limit(10000),
                    Query.offset(0),
                    // sort by name
                    Query.orderAsc('name')
                ]
            );
        } catch (error) {
            console.log("Appwrite service :: getAllProducts :: error", error);
        }
    }

    async getProductById(id: string) {
        try {
            return await this.databases.getDocument(conf.appwriteDatabaseId, conf.productCollectionId, id);
        } catch (error) {
            console.log("Appwrite service :: getProductById :: error", error);
        }
    }

    async updateProduct(id: string, data: any) {
        try {
            return await this.databases.updateDocument(conf.appwriteDatabaseId, conf.productCollectionId, id, data);
        } catch (error) {
            console.log("Appwrite service :: updateProduct :: error", error);
        }
    }


}

const inventoryApi = new Inventory();

export default inventoryApi;