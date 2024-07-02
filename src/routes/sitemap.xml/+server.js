import { db } from '../../firebase'; // Importing the initialized Firestore database
import { collection, getDocs } from 'firebase/firestore'; // Importing Firestore functions to interact with the database

// This function handles GET requests to the /sitemap.xml endpoint
export async function GET() {
    // Fetch all documents from the 'NewsEn' collection in Firestore
    const querySnapshot = await getDocs(collection(db, 'NewsEn'));
    // Map the fetched documents to their data
    const newsItems = querySnapshot.docs.map(doc => doc.data());

    // Generate <url> elements for each news item
    const urls = newsItems.map(news => `
        <url>
            <loc>https://ch8-deployment-hra4za8dj-saryass-projects.vercel.app/english/${news.wp_post_id}</loc> <!-- The URL of the news article -->
            <lastmod>${news.published_at}</lastmod> <!-- The last modification date of the news article -->
            <changefreq>daily</changefreq> <!-- Indicates the frequency of changes to the news article -->
            <priority>0.8</priority> <!-- The priority of the URL relative to other URLs on the site -->
        </url>
    `).join('');

    // Generate the sitemap XML structure
    const sitemap = `
        <?xml version="1.0" encoding="UTF-8" ?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${urls} <!-- Insert the generated <url> elements here -->
        </urlset>
    `.trim();

    // Return the generated sitemap as the response
    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml' // Set the response content type to XML
        }
    });
}
