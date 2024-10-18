import conf from '../conf/conf';
import { Client, ID, Databases } from "appwrite";



class Customer {
    client = new Client();
    databases;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
    }

    async getAllCustomers() {
        try {
            return await this.databases.listDocuments(conf.appwriteDatabaseId, conf.customerCollectionId);
        } catch (error) {
            console.log("Appwrite serive :: getPosts :: error", error);
            
        }
    }

    async getCustomerById(id: string) {
        try {
            return await this.databases.getDocument(conf.appwriteDatabaseId, conf.customerCollectionId, id);
        } catch (error) {
            console.log("Appwrite serive :: getPosts :: error", error);
            
        }
    }

    async createCustomer(data: any) {
        try {
            return await this.databases.createDocument(conf.appwriteDatabaseId, conf.customerCollectionId, ID.unique(), data);
        } catch (error) {
            console.log("Appwrite serive :: createPost :: error", error);
            
        }
    }

    async updateCustomer(id: string, data: any) {
        try {
            return await this.databases.updateDocument(conf.appwriteDatabaseId, conf.customerCollectionId, id, data);
        } catch (error) {
            console.log("Appwrite serive :: updatePost :: error", error);
            
        }
    }

}

const customerApi = new Customer();

export default customerApi