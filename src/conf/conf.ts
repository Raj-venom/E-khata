const conf = {

    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    customerCollectionId: String(import.meta.env.VITE_customer_COLLECTION_ID),
    partyCollectionId: String(import.meta.env.VITE_PARTY_COLLECTION_ID),
    appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
    rteKey: String(import.meta.env.VITE_APPWRITE_RTE_TINYMCE),
}

export default conf