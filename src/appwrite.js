import { Client, ID, Query, Databases } from 'appwrite';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;  
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;  
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;  

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') 
    .setProject(PROJECT_ID);

const databases = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
    try {
        if (!searchTerm || !movie) {
            console.warn('Missing searchTerm or movie data');
            return;
        }

        console.log('Attempting to update search count for:', searchTerm);

        const result = await databases.listDocuments(DATABASE_ID, TABLE_ID, [
            Query.equal('searchTerm', searchTerm),
        ]);

        if (result.documents.length > 0) {
            const doc = result.documents[0];
            await databases.updateDocument(DATABASE_ID, TABLE_ID, doc.$id, {
                count: doc.count + 1,
            });
            console.log('Updated existing document');
        }
        else {
            await databases.createDocument(DATABASE_ID, TABLE_ID, ID.unique(), {
                searchTerm: searchTerm,
                movie_id: movie.id,
                count: 1,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            });
            console.log('Created new document');
        }
    }
    catch (error) {
        console.error('Appwrite Error:', error);
    }
}
export const getTrendingMovies = async () => {
    try {
        const result = await databases.listDocuments(DATABASE_ID, TABLE_ID, [
            Query.limit(5),
            Query.orderDesc("count")
        ]);
        return result.documents || [];
    }
    catch (error) {
        console.error('Error fetching trending movies:', error);
        return [];
    }
}