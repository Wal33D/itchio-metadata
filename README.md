# 🕹️ itchio-metadata

A Node.js package to fetch and parse metadata for games hosted on Itch.io, providing detailed information about the latest game versions.

## 📦 Installation

To install the package, run:

```bash
npm install itchio-metadata
```

## 🚀 Usage

First, set up your environment variables in a `.env.local` file:
You can set the ENV variables in your `.env.local` file as follows
or you can pass them in directly to the `fetchItchGameData` function.
ITCH_DATA_URI is specific to the ENV file, if not supplied it will
be programtically built based upon the author and gameTitle params.

```plaintext
ITCH_API_KEY=
ITCH_DATA_URI=https://your-itch-author.itch.io/your-game
```

### Example Usage

Here's an example of how to use the `fetchItchGameData` function:

```javascript
import * as dotenv from "dotenv";
import { fetchItchGameData } from "itchio-metadata";
dotenv.config({ path: ".env.local" });

async function exampleUsage() {
  try {
    const latestVersionInfoResult = await fetchItchGameData({
      author: "baraklava",
      gameTitle: "manic-miners",
      itchApiKey: process.env.ITCH_API_KEY,
    });
    console.log(latestVersionInfoResult);
    console.log(`[INFO] Successfully fetched game metadata from Itch.io`);
  } catch (error) {
    console.error(
      `[ERROR] An error occurred while fetching game metadata:`,
      error
    );
  }
}

exampleUsage().catch((err) =>
  console.error(`[ERROR] Failed to execute example usage:`, err)
);
```

### Environment Variables

- `ITCH_API_KEY`: Your Itch.io API key (optional, but recommended for fetching upload data).
- `ITCH_DATA_URI`: The base URL of your game's Itch.io page (e.g., `https://baraklava.itch.io/manic-miners`).

## 📘 API

### fetchItchGameData

Fetches metadata for a game hosted on Itch.io.

#### Parameters

- `FetchGameDataParams`: An object with the following optional properties:
  - `itchApiKey` (string): Your Itch.io API key.
  - `author` (string): The author of the game.
  - `gameTitle` (string): The title of the game.

#### Returns

- `Promise<GameMetadata>`: A promise that resolves to the game metadata.

### Interfaces

#### GameMetadata

```typescript
export interface GameMetadata {
  gameId: number;
  title: string;
  description: string;
  coverImage: string;
  gamePage: string;
  comments: string;
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
```

#### FetchGameDataParams

```typescript
export interface FetchGameDataParams {
  itchApiKey?: string;
  author?: string;
  gameTitle?: string;
}
```

## 🛠️ Development

### Building the Package

To build the package, run:

```bash
npm run build
```

### Running the Example

To run the example usage, first ensure you have set up your `.env.local` file with the necessary environment variables, then run:

```bash
npm start
```

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ✨ Author

Waleed Judah
