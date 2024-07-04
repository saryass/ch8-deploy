import { db } from '../../../firebase'; 
import { collection, query, where, getDocs, limit, getDoc, doc, orderBy } from 'firebase/firestore'; 

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
    const wp_post_id = parseInt(params.englishID, 10); // Parse the English ID from the URL parameters and convert it to an integer

    try {
        // ********************************************************
        //  1-Fetch the singleNews , the News that was clicked on
        // ********************************************************
        const clickedNewsDoc = await getDocs(
            query(
                collection(db, 'NewsEn'), // Reference the 'NewsEn' collection in Firestore
                where('wp_post_id', '==', wp_post_id), // Create a query to find the document with the matching 'wp_post_id'
                limit(1) // Limit the result to one document
            )
        );

        if (clickedNewsDoc.empty) {
            return {
                status: 404,
                error: { message: 'News not found' } // Return a 404 error if no document is found
            };
        }
        
        const clickedNews = clickedNewsDoc.docs[0].data(); // Get the data of the found document
        clickedNews.id = clickedNewsDoc.docs[0].id; // Include the document ID in the data

         // ****************************************************************************************
        //   2-Fetch related News based on the same category but exclude the clicked news
        // ******************************************************************************************
        const relatedNewsQuery = query(
            collection(db, 'NewsEn'), // Reference the 'NewsEn' collection in Firestore
            where('category', 'array-contains', clickedNews.category[0]), // Create a query to find documents with the same category
            orderBy('published_at', 'desc'), // Order the results by the 'published_at' field in descending order
            limit(6) // Limit the result to six documents to account for exclusion
        );

        const relatedNewsSnapshot = await getDocs(relatedNewsQuery); // Execute the query

        // Process the related news documents
        const relatedNews = await Promise.all(
            relatedNewsSnapshot.docs
                .filter(docSnap => docSnap.id !== clickedNews.id) // Exclude the clicked news from the results
                .slice(0, 5) // Ensure we only take 5 related news documents
                .map(async (docSnap) => {
                    const news = docSnap.data(); // Get the data of each document
                    news.id = docSnap.id; // Include the document ID in the data


                      // ************************************************************************************************
                    //     Fetch author name from reference for each related news article (we do not need it in my case)
                    // **************************************************************************************************
                    // if (news.author) {
                    //     const authorRef = doc(db, news.author.path); // Reference the author's document
                    //     const authorSnap = await getDoc(authorRef); // Get the author's document

                    //     if (authorSnap.exists()) {
                    //         const authorData = authorSnap.data(); // Get the data of the author's document
                    //         news.authorName = authorData.display_name || 'Unknown Author'; // Set the author's name
                    //     } else {
                    //         news.authorName = 'Unknown Author'; // Default to 'Unknown Author' if the document does not exist
                    //     }
                    // } else {
                    //     news.authorName = 'Unknown Author'; // Default to 'Unknown Author' if there is no author field
                    // }

                    console.log('The 5 related news:',news) //log the fetched related news ;)
                    return serializeFirestoreData(news); // Serialize the news data for client use
                })
        );


        // *********************************************************
        // 3-Fetch author name from referencefor the clicked news
        // *********************************************************
        if (clickedNews.author) {
            const authorRef = doc(db, clickedNews.author.path); // Reference the author's document
            const authorSnap = await getDoc(authorRef); // Get the author's document

            if (authorSnap.exists()) {
                const authorData = authorSnap.data(); // Get the data of the author's document
                clickedNews.authorName = authorData.display_name || 'Unknown Author'; // Set the author's name
            } else {
                clickedNews.authorName = 'Unknown Author'; // Default to 'Unknown Author' if the document does not exist
            }
        } else {
            clickedNews.authorName = 'Unknown Author'; // Default to 'Unknown Author' if there is no author field
        }

        const singleNews = serializeFirestoreData(clickedNews); // Serialize the clicked news data for client use

        return {
            singleNews, // Return the clicked news data
            relatedNews, // Return the related news data
        };
    } catch (error) {
        console.error("Firestore Error:", error.message); // Log the Firestore error

        if (error.code === 'failed-precondition') {
            return {
                status: 500,
                error: { message: 'Firestore index needed. Please check your Firestore console for more details.' } // Return a specific error message for failed precondition
            };
        }

        return {
            status: 500,
            error: { message: 'An error occurred while fetching News data' } // Return a general error message
        };
    }
}

// *******************************************************************************************
	// 4-Function to convert Firestore data to plain JavaScript objects safely (Serialization)
// *******************************************************************************************
function serializeFirestoreData(data) {
    const serializedData = {};
    const fieldsToInclude = [
        'title', // The title of the news article
        'published_at', // The published date of the news article
        'category', // The categories of the news article
        'thumbnailURL', // The thumbnail image URL of the news article
        'wp_post_id', // The WordPress post ID of the news article
        'wp_firebase_version', // The WordPress Firebase version of the news article
        'content' // The content of the news article
    ];

    fieldsToInclude.forEach((field) => {
        if (data[field]) {
            if (data[field].toDate) {
                const options = { day: 'numeric', month: 'long', year: 'numeric' };
                serializedData[field] = new Intl.DateTimeFormat('en-US', options).format(data[field].toDate()); // Format Firestore timestamps as human-readable dates
            } else if (typeof data[field] === 'object' && !Array.isArray(data[field])) {
                serializedData[field] = JSON.parse(JSON.stringify(data[field])); // Serialize Firestore objects
            } else {
                serializedData[field] = data[field]; // Directly assign other types of data
            }
        }
    });

    serializedData.authorName = data.authorName || 'Unknown Author'; // Assign the author's name

    return serializedData; // Return the serialized data
}
