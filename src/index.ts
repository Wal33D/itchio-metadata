import * as dotenv from 'dotenv';
import { fetchItchGameData } from './fetchItchGameData';
export { fetchItchGameData } from './fetchItchGameData';
export { FetchGameDataParams, GameMetadata } from './types';

dotenv.config({ path: '.env.local' });

async function exampleUsage() {
	try {
		const latestVersionInfoResult = await fetchItchGameData({
			author: 'baraklava',
			gameTitle: 'manic-miners',
			itchApiKey: process.env.ITCH_API_KEY,
		});
		console.log(latestVersionInfoResult);
		console.log(`[INFO] Successfully fetched game metadata from Itch.io`);
	} catch (error) {
		console.error(`[ERROR] An error occurred while fetching game metadata:`, error);
	}
}

exampleUsage().catch(err => console.error(`[ERROR] Failed to execute example usage:`, err));