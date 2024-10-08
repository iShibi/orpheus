import { getAccessToken } from '@/util/utils';
import type { ArtistObject, GetSearchResponse } from 'spotify-api-types';

/**
 * GET `/api/artists`
 */
export interface ApiArtistsResponse {
	artists: Array<ArtistObject>;
}

export async function GET(request: Request) {
	const query = new URL(request.url).searchParams.get('query');
	const url = encodeURI(`https://api.spotify.com/v1/search?q=${query}&type=artist&limit=10`);
	const accessToken = await getAccessToken();
	const res = await fetch(url, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	const data: GetSearchResponse = await res.json();
	const resBody: ApiArtistsResponse = { artists: data.artists.items };
	return Response.json(resBody);
}
