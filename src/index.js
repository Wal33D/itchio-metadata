"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchItchGameData = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: ".env.local" });
const fetchItchGameData = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* ({ itchApiKey, author, gameTitle, gameUrl, } = {}) {
    const ITCH_API_KEY = itchApiKey || process.env.ITCH_API_KEY;
    let ITCH_DATA_URI = process.env.ITCH_DATA_URI;
    if (gameUrl) {
        ITCH_DATA_URI = `${gameUrl}/data.json`;
    }
    else if (author && gameTitle) {
        ITCH_DATA_URI = `https://${author}.itch.io/${gameTitle}/data.json`;
    }
    else if (ITCH_DATA_URI) {
        ITCH_DATA_URI = `${ITCH_DATA_URI}/data.json`;
    }
    if (!ITCH_DATA_URI) {
        return {
            status: false,
            message: "Required configuration missing: ITCH_DATA_URI is not set in the environment or as a parameter.",
        };
    }
    try {
        if (!ITCH_API_KEY) {
            console.warn("No ITCH_API_KEY available, proceeding without fetching uploads data.");
            const detailsResponse = yield axios_1.default.get(ITCH_DATA_URI);
            const detailsData = detailsResponse.data;
            if (!detailsData || !detailsData.id) {
                throw new Error("Data is missing or the structure is incorrect.");
            }
            const gameMetadata = {
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
                authors: detailsData.authors.map((author) => ({
                    name: author.name,
                    url: author.url,
                })),
            };
            return {
                status: true,
                message: "Game metadata fetched successfully without uploads data.",
                data: gameMetadata,
            };
        }
        const detailsResponse = yield axios_1.default.get(ITCH_DATA_URI);
        const detailsData = detailsResponse.data;
        if (!detailsData || !detailsData.id) {
            throw new Error("Data is missing or the structure is incorrect.");
        }
        const gameId = detailsData.id;
        const URL_UPLOADS = `https://itch.io/api/1/${ITCH_API_KEY}/game/${gameId}/uploads`;
        const uploadsResponse = yield axios_1.default.get(URL_UPLOADS);
        const uploadsData = uploadsResponse.data;
        if (!uploadsData) {
            throw new Error("Data is missing or the structure is incorrect.");
        }
        const sortedUploads = uploadsData.uploads.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        const latestUpload = sortedUploads[0];
        const sizeBytes = latestUpload.size;
        const sizeMB = sizeBytes / (1024 * 1024);
        const gameMetadata = {
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
            authors: detailsData.authors.map((author) => ({
                name: author.name,
                url: author.url,
            })),
        };
        return {
            status: true,
            message: "Game metadata fetched successfully.",
            data: gameMetadata,
        };
    }
    catch (error) {
        return {
            status: false,
            message: `Error fetching game data: ${error.message}`,
        };
    }
});
exports.fetchItchGameData = fetchItchGameData;
//# sourceMappingURL=index.js.map