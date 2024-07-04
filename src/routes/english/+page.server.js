import { db } from '../../firebase'; 
import { collection, query, where, limit, getDocs } from 'firebase/firestore';

// Function to convert Firestore data to plain JavaScript objects safely (Serialization)
function serializeFirestoreData(data) {
	const serializedData = {}; // Initialize an empty object to hold serialized data
	const fieldsToInclude = ['title', 'published_at', 'category', 'thumbnailURL', 'wp_post_id', 'wp_firebase_version']; // List of fields to include in the serialization

	fieldsToInclude.forEach((field) => { // Loop through each field
		if (data[field]) { // Check if the field exists in the data object
			if (data[field].toDate) { // Check if the field is a Firestore Timestamp
				const options = { day: 'numeric', month: 'long', year: 'numeric' }; // Date formatting options
				serializedData[field] = new Intl.DateTimeFormat('en-US', options).format(data[field].toDate()); // Format Timestamp to a readable date
			} else if (typeof data[field] === 'object' && !Array.isArray(data[field])) { // Check if the field is an object but not an array
				serializedData[field] = JSON.parse(JSON.stringify(data[field])); // Deep copy the object to ensure no references to the original Firestore document
			} else {
				serializedData[field] = data[field]; // Directly assign other types of data
			}
		}
	});

	return serializedData; // Return the serialized data
}

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	try {
		const categories = ['Politics', 'Business', 'Health', 'Sports']; // Define the categories to fetch
		const fetchCategoryNews = async (category) => { // Function to fetch news data for each specific category in parallel
			const q = query(
				collection(db, 'NewsEn'), // Reference the 'NewsEn' collection in Firestore
				where('category', 'array-contains', category), // Query to find documents with the specified category
				limit(5) // Limit the result to five documents
			);
			const querySnapshot = await getDocs(q); // Execute the query and get the snapshot of results
			return querySnapshot.docs.map((doc) => serializeFirestoreData(doc.data())); // Map through each document and serialize the data
		};

		// Fetch news data for all categories in parallel 
		const [politicsNews, businessNews, healthNews, sportsNews] = await Promise.all(
			categories.map(fetchCategoryNews)
		);

		// Return the combined data along with SEO-specific data
		return {
			politicsNews,
			businessNews,
			healthNews,
			sportsNews
		};
	} catch (error) { // Catch any errors during data fetching
		console.error('Error fetching data:', error); // Log the error
		return {
			politicsNews: [],
			businessNews: [],
			healthNews: [],
			sportsNews: [],
			error: 'Failed to load data', // Return an error message
		};
	}
}


// How Parallel Fetching works:
//     1- getData Function: Each getData function fetches data for a specific category.
//     2- Promise.all: The Promise.all function runs all getData functions at the same time. It waits for all of them to finish before moving on.
//     3- Return Data: Once all data is fetched, it’s returned and can be used in your app.


// Benefits of Parallel Fetching:
//    - Faster Loading: Since all data loads at the same time, the overall wait time is shorter.
//    - Better User Experience: Users don’t have to wait long to see the content.

// By fetching data in parallel, your app becomes quicker and provides a smoother experience for users.

