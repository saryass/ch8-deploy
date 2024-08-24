/// <reference types="@sveltejs/kit" />
import { build, files, version } from '$service-worker';

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;

// we need assets, the things that we are caching  ;)
const ASSETS = [
	...build, // the app itself (JS, CSS, etc.)
	...files // everything else in your `static` directory ;)
];
// *********************************************************************************************
//                                    install
// *********************************************************************************************
self.addEventListener('install', (event) => {
	console.log('Service worker installing...');

	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
		console.log('All assets added to cache');
	}

	event.waitUntil(
		addFilesToCache().then(() => {
			console.log('Service worker installed and assets cached');
			return self.skipWaiting(); // This ensures the new service worker takes over immediately
		})
	);
});
// till this point only the things in the "static" directory has been chached. I THINK
// *********************************************************************************************
//                                   activate
// *********************************************************************************************
// the catche store is empty so far ;) so we need the 2 below steps to see everything that has been chached ;)

self.addEventListener('activate', (event) => {
	console.log('Service worker activating...');

	async function deleteOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== CACHE) {
				console.log(`Deleting old cache: ${key}`);
				await caches.delete(key);
			}
		}
	}

	event.waitUntil(
		deleteOldCaches().then(() => {
			console.log('Old caches deleted');
			return self.clients.claim(); // This ensures the new service worker takes control of all clients
		})
	);
});
// *********************************************************************************************
//                                   fetch
// *********************************************************************************************
self.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET') return;

	async function respond() {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);

		// For build assets and static files, always serve from cache if available
		if (ASSETS.includes(url.pathname)) {
			const cachedResponse = await cache.match(url.pathname);
			if (cachedResponse) {
				return cachedResponse;
			}
		}

		// for everything else, try the network first, but
		// fall back to the cache if we're offline
		try {
			const response = await fetch(event.request);

			// if we're offline, fetch can return a value that is not a Response
			// instead of throwing - and we can't pass this non-Response to respondWith
			if (!(response instanceof Response)) {
				throw new Error('invalid response from fetch');
			}

			if (response.status === 200) {
				cache.put(event.request, response.clone());
			}

			return response;
		} catch (err) {
			const cachedResponse = await cache.match(event.request);
			if (cachedResponse) {
				return cachedResponse;
			}
			throw err;
		}
	}

	event.respondWith(respond());
});

// Listen for messages from the main thread
// self.addEventListener('message', (event) => {
// 	if (event.data && event.data.type === 'SKIP_WAITING') {
// 		self.skipWaiting();
// 	}
// });
