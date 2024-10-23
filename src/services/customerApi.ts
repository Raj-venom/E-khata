import conf from '../conf/conf';
import { Client, ID, Databases, Query } from "appwrite";



class Customer {
    client = new Client();
    databases;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
    }

    async getAllCustomers(showRemainingAmountOnly: boolean, searchTerm: string, paidAmountUserOnly: boolean) {
        try {
            const queries = []

            if (showRemainingAmountOnly) {
                queries.push(Query.greaterThan('remaining_amount', 0))
            }

            if (searchTerm) {
                queries.push(Query.or([
                    Query.contains('name', searchTerm),
                    Query.contains('phone', searchTerm),
                ]))
            }

            if (paidAmountUserOnly) {
                queries.push(Query.lessThanEqual('remaining_amount', 0))
            }

            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.customerCollectionId,
                [
                    Query.limit(10000),
                    Query.offset(0),
                    Query.orderAsc('remaining_amount'),

                    ...queries
                ]

            );
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