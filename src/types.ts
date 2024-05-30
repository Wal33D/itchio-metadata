export interface GameMetadata {
	gameId: number;
	title: string;
	description: string;
	coverImage: string;
	gamePage: string;
	comments: string;
    metaDataUrl: string;
	latestVersion: {
		displayName: string;
		versionId: number;
		releaseDate: Date;
		sizeBytes: number;
		sizeMB: number;
		downloadUrl: string;
		md5Hash: string;
		platforms: {
			windows: boolean;
			mac: boolean;
			linux: boolean;
			android: boolean;
		};
		preorder: boolean;
		position: number;
		filename: string;
		demo: boolean;
		createdAt: Date;
		storage: string;
		type: string;
	};
	authors: Array<{ name: string; url: string }>;
}

export interface FetchGameDataParams {
    itchApiKey?: string;
    author?: string;
    gameTitle?: string;
    gameUrl?: string;
  }
  