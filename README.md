# 🕹️ itchio-metadata

A Node.js package to grab and parse metadata for games on Itch.io, giving you all the details about the latest game versions.

## 📦 Installation

To get the package, just run:

```bash
npm install itchio-metadata
```

## 🚀 Usage

First, set up your environment variables in a `.env.local` file:
You can set the ENV variables in your `.env.local` file as shown below or pass them directly to the `fetchItchGameData` function.

```plaintext
ITCH_API_KEY=
```

### Example Usage

Here’s a quick example of how to use `fetchItchGameData`:

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

If `ITCH_API_KEY` is set in the `.env.local` file, you can use the function like this:

```javascript
const latestVersionInfoResult = await fetchItchGameData({
  author: "baraklava",
  gameTitle: "manic-miners",
});
```

You can also use the `gameUrl` parameter directly:

```javascript
const latestVersionInfoResult = await fetchItchGameData({
  gameUrl: "https://baraklava.itch.io/manic-miners",
});
```

### Environment Variables

- `ITCH_API_KEY`: Your Itch.io API key (optional but recommended for fetching upload data).

## 📘 API

### fetchItchGameData

Fetches metadata for a game hosted on Itch.io.

#### Parameters

- `FetchGameDataParams`: An object with the following optional properties:
  - `itchApiKey` (string): Your Itch.io API key.
  - `author` (string): The author of the game.
  - `gameTitle` (string): The title of the game.
  - `gameUrl` (string): The full URL of the game's Itch.io page.

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
  gameUrl?: string;
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

This project is licensed under the MIT License

## ✨ Author

Waleed Judah

## 📌 Links

- [npm package](https://www.npmjs.com/package/itchio-metadata)
- [GitHub repository](https://github.com/Wal33D/itchio-metadata)
