import axios, { type AxiosResponse } from 'axios';
export const getPlaylistIdFromUrl = (url: string): string | null => {
    try {
        const urlObj = new URL(url);
        return urlObj.searchParams.get("list");
    } catch (error) {
        console.error("Invalid URL passed to parser", error);
        return null;
    }
};
// Define an interface matching the expected YouTube API response structure
interface YouTubePlaylistResponse {
    items?: Array<{
        contentDetails?: {
            videoId?: string;
        };
    }>;
    nextPageToken?: string;
}
export const fetchAllSongsFromPlaylist = async (playlistId: string, apiKey: string): Promise<string[]> => {
    // Guard clause against dynamic mix/radio paths
    if (playlistId.startsWith("RD")) {
        throw new Error("YouTube Mix (RD) lists are dynamic and cannot be fetched. Please use a standard playlist (PL) instead.");
    }

    const url = `https://www.googleapis.com/youtube/v3/playlistItems`;
    const trackUrls: string[] = [];
    let nextPageToken: string | undefined = undefined;

    do {
        // We let the errors bubble up naturally so the toast handler can catch them
        const response: AxiosResponse<YouTubePlaylistResponse> = await axios.get(url, {
            params: {
                part: 'contentDetails',
                playlistId: playlistId,
                maxResults: 50,
                pageToken: nextPageToken,
                key: apiKey,
            },
        });

        const items = response.data.items || [];

        for (const item of items) {
            const videoId = item.contentDetails?.videoId;
            if (videoId) {
                trackUrls.push(`https://www.youtube.com/watch?v=${videoId}`);
            }
        }

        nextPageToken = response.data.nextPageToken

    } while (nextPageToken)

    return trackUrls;
};

export const filterDuplicateSongs = (existingSongs: any[], incomingUrls: string[]): string[] => {
    // 1. Create a Set containing all unique URLs currently in your database for O(1) lookup speeds
    const existingUrlsSet = new Set(existingSongs.map(song => song.url));

    // 2. Filter the incoming playlist down to only items NOT found in the Set
    return incomingUrls.filter(url => !existingUrlsSet.has(url));
};