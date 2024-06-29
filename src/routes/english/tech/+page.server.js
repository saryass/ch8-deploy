// Import the Firestore database instance
import { db } from '../../../firebase';
// Import Firestore functions to interact with the database
import { collection, query, where, limit, getDocs } from 'firebase/firestore';


	// *******************************************************************************************
       // Function to convert Firestore data to plain JavaScript objects safely (Serialization)
    // *******************************************************************************************
function serializeFirestoreData(data) {
	const serializedData = {}; // Initialize an empty object to hold serialized data
	const fieldsToInclude = ['title', 'published_at', 'category', 'thumbnailURL', 'wp_post_id', 'wp_firebase_version']; // List of fields to include in the serialization

	// Loop through each field and serialize it
	fieldsToInclude.forEach((field) => {
		if (data[field]) {    //This line checks if the current field exists in the data object.

			if (data[field].toDate) {   //This line checks if the current field is a Timestamp (by checking if it has a toDate method).
				const options = { day: 'numeric', month: 'long', year: 'numeric' }; //If true(if the current fild is a Rimestamp), it defines date formatting options (options) to format the date in a human-readable way.
				serializedData[field] = new Intl.DateTimeFormat('en-US', options).format(data[field].toDate()); //Then uses Intl.DateTimeFormat to format the Timestamp into a readable date string and assigns it to the serializedData object.
			
			} else if (typeof data[field] === 'object' && !Array.isArray(data[field])) {  //This line checks if the field is an object but not an array.
				serializedData[field] = JSON.parse(JSON.stringify(data[field])); //If true (if the field is an obj), it serializes the object to a JSON string and then parses it back to a JavaScript object using JSON.parse(JSON.stringify(data[field])). This deep-copies the object to ensure no references to the original Firestore document.
			} else {
				serializedData[field] = data[field]; //If the field is neither a Timestamp nor an object, it directly assigns the field's value to the serializedData object.
			}
		}
	});

	return serializedData; // This line returns the serializedData object, which now contains all the fields from data in a serialized format.
}

// ***************************************************************************
// Load function to fetch data for the Science & Tech page
// ***************************************************************************
export async function load() {
	try {
		// Define a Firestore query to fetch documents from 'NewsEn' collection where 'category' contains 'Science & Tech', limiting the results to 50
		const q = query(
			collection(db, 'NewsEn'),
			where('category', 'array-contains', 'Science & Tech'),
			limit(2)
		);
		
		const querySnapshot = await getDocs(q);  // Execute the query and get the snapshot of results
		const zanyar = querySnapshot.docs.map((doc) => serializeFirestoreData(doc.data())); // Map through each document in the snapshot and serialize the data

		// Return the serialized data to be used in the Svelte component
		console.log(zanyar)
		return {  
			zanyar
		};

	} catch (error) {
		console.error('Error fetching data:', error);
		return {
			zanyar: [],
			error: 'Failed to load data'
		};
	}
}


// <!-- General Tasks -->
// <!--
// 1. Imports the Firestore database instance and necessary Firestore functions.
// 2. Defines a function `serializeFirestoreData` to safely convert Firestore data to plain JavaScript objects.
// 3. Defines an asynchronous `load` function to fetch data for the Science & Tech page.
// 4. Constructs a Firestore query to fetch documents from the 'NewsEn' collection with 'Science & Tech' category, limiting to 50 documents.
// 5. Executes the query and processes the results.
// 6. Serializes the fetched data to ensure it's safe to use in the Svelte component.
// 7. Returns the serialized data for use in the corresponding Svelte component.
// -->