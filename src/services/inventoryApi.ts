import conf from '../conf/conf';
import { Client, ID, Databases } from "appwrite";

class Inventory  {
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
            return await this.databases.listDocuments(conf.appwriteDatabaseId, conf.productCollectionId);
        } catch (error) {
            console.log("Appwrite service :: getAllProducts :: error", error);
        }
    }


}

const inventoryApi = new Inventory();

export default inventoryApi;