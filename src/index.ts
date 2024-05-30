import axios from "axios";
import * as dotenv from "dotenv";
import { FetchGameDataParams, GameMetadata } from "./types";
export { FetchGameDataParams, GameMetadata } from "./types";
dotenv.config({ path: ".env.local" });

export const fetchItchGameData = async ({
  itchApiKey,
  author,
  gameTitle,
  gameUrl,
}: FetchGameDataParams = {}): Promise<{
  status: boolean;
  message: string;
  data?: GameMetadata;
}> => {
  const ITCH_API_KEY = itchApiKey || process.env.ITCH_API_KEY;
  let ITCH_DATA_URI = process.env.ITCH_DATA_URI;

  if (gameUrl) {
    ITCH_DATA_URI = `${gameUrl}/data.json`;
  } else if (author && gameTitle) {
    ITCH_DATA_URI = `https://${author}.itch.io/${gameTitle}/data.json`;
  } else if (ITCH_DATA_URI) {
    ITCH_DATA_URI = `${ITCH_DATA_URI}/data.json`;
  }

  if (!ITCH_DATA_URI) {
    return {
      status: false,
      message:
        "Required configuration missing: ITCH_DATA_URI is not set in the environment or as a parameter.",
    };
  }

  try {
    if (!ITCH_API_KEY) {
      console.warn(
        "No ITCH_API_KEY available, proceeding without fetching uploads data."
      );
      const detailsResponse = await axios.get(ITCH_DATA_URI);
      const detailsData = detailsResponse.data;

      if (!detailsData || !detailsData.id) {
        throw new Error("Data is missing or the structure is incorrect.");
      }

      const gameMetadata: GameMetadata = {
        gameId: detailsData.id,
        title: detailsData.title,
        description: detailsData.description || "No description provided.",
        coverImage: detailsData.cover_image,
        gamePage: detailsData.links.self,
        comments: detailsData.links.comments,
        metaDataUrl: ITCH_DATA_URI,
        latestVersion: {
          displayName: "",
          versionId: 0,
          releaseDate: new Date(),
          sizeBytes: 0,
          sizeMB: 0,
          downloadUrl: "",
          md5Hash: "",
          platforms: {
            windows: false,
            mac: false,
            linux: false,
            android: false,
          },
          preorder: false,
          position: 0,
          filename: "",
          demo: false,
          createdAt: new Date(),
          storage: "",
          type: "",
        },
        authors: detailsData.authors.map(
          (author: { name: string; url: string }) => ({
            name: author.name,
            url: author.url,
          })
        ),
      };

      return {
        status: true,
        message: "Game metadata fetched successfully without uploads data.",
        data: gameMetadata,
      };
    }

    const detailsResponse = await axios.get(ITCH_DATA_URI);
    const detailsData = detailsResponse.data;

    if (!detailsData || !detailsData.id) {
      throw new Error("Data is missing or the structure is incorrect.");
    }

    const gameId = detailsData.id;
    const URL_UPLOADS = `https://itch.io/api/1/${ITCH_API_KEY}/game/${gameId}/uploads`;

    const uploadsResponse = await axios.get(URL_UPLOADS);
    const uploadsData = uploadsResponse.data;

    if (!uploadsData) {
      throw new Error("Data is missing or the structure is incorrect.");
    }

    const sortedUploads = uploadsData.uploads.sort(
      (a: any, b: any) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
    const latestUpload = sortedUploads[0];

    const sizeBytes = latestUpload.size;
    const sizeMB = sizeBytes / (1024 * 1024);

    const gameMetadata: GameMetadata = {
      gameId: detailsData.id,
      title: detailsData.title,
      description: detailsData.description || "No description provided.",
      coverImage: detailsData.cover_image,
      gamePage: detailsData.links.self,
      comments: detailsData.links.comments,
      metaDataUrl: ITCH_DATA_URI,
      latestVersion: {
        displayName: latestUpload.display_name,
        filename: latestUpload.filename,
        versionId: latestUpload.id,
        sizeBytes,
        sizeMB: parseFloat(sizeMB.toFixed(2)),
        md5Hash: latestUpload.md5_hash,
        preorder: latestUpload.preorder,
        position: latestUpload.position,
        demo: latestUpload.demo,
        storage: latestUpload.storage,
        type: latestUpload.type,
        createdAt: new Date(latestUpload.created_at),
        releaseDate: new Date(latestUpload.updated_at),
        platforms: {
          windows: latestUpload.p_windows,
          mac: latestUpload.p_osx,
          linux: latestUpload.p_linux,
          android: latestUpload.p_android,
        },
        downloadUrl: `https://itch.io/api/1/${ITCH_API_KEY}/game/${detailsData.id}/${latestUpload.filename}`,
      },
      authors: detailsData.authors.map(
        (author: { name: string; url: string }) => ({
          name: author.name,
          url: author.url,
        })
      ),
    };

    return {
      status: true,
      message: "Game metadata fetched successfully.",
      data: gameMetadata,
    };
  } catch (error: any) {
    return {
      status: false,
      message: `Error fetching game data: ${error.message}`,
    };
  }
};
