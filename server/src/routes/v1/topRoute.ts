import { Router, Response, Request } from 'express';
import { Song, Artist, Album, Playlist } from '../../types/types';
const { Datastore } = require('@google-cloud/datastore');
const router = Router();

const datastore = new Datastore();

router.get('/', async (req: Request, res: Response) => {
    try {
        const [topLikesSongs]: Song[] = await topLikes('Song');
        const [topPlayedSongs]: Song[] = await topPlayed('Song');
        const [topNewSongs]: Song[] = await topNews('Song');
        const songs = [topLikesSongs, topPlayedSongs, topNewSongs]

        const [topLikesArtists]: Artist[] = await topLikes('Artist');
        const topPlayedArtists: Artist[] = await topPlayed('Artist');
        const [topNewArtists]: Artist[] = await topNews('Artist');
        const artists = [topLikesArtists, topPlayedArtists, topNewArtists]

        const [topLikesAlbums]: Album[] = await topLikes('Album');
        const topPlayedAlbums: Album[] = await topPlayed('Album');
        const [topNewAlbums]: Album[] = await topNews('Album');
        const albums = [topLikesAlbums, topPlayedAlbums, topNewAlbums]

        const [topLikesPlaylists]: Playlist[] = await topLikes('Playlist');
        const topPlayedPlaylists: Playlist[] = await topPlayed('Playlist');
        const [topNewPlaylists]: Playlist[] = await topNews('Playlist');
        const playlists = [topLikesPlaylists, topPlayedPlaylists, topNewPlaylists]

        res.send([songs, artists, albums, playlists])
    } catch (err) {
        console.log(err)
        res.status(200).send(err.message);
    }
})
router.get('/play', async (req: Request, res: Response) => {
    try {
        const [song] = await topPlayed('Song')
        const artist = await topPlayed('Artist')
        const album = await topPlayed('Album')
        const playlist = await topPlayed('Playlist')
        res.send([song, artist, album, playlist])
    } catch (err) {
        res.send(err.message)
    }
})

const topLikes = (key: string) => {
    const query = datastore
        .createQuery(key)
        .order('likes', { descending: true })
        .limit(20);
    return datastore.runQuery(query);
}

const topPlayed = async (key: string) => {
    if (key === 'Song') {
        const query = datastore
            .createQuery(key)
            .order('playCount', { descending: true })
            .limit(20);

        return datastore.runQuery(query);
    } else if (key === 'Playlist') {
        const query = datastore.createQuery(key);
        const [data] = await datastore.runQuery(query);
        const summed = await Promise.all(data.map(async (playlist: Playlist) => {
            let sum = 0;
            await Promise.all(playlist.songs.map(async (obj: number) => {
                const songQuery = datastore.createQuery('Song').filter('id', '=', Number(obj))
                const [song] = await datastore.runQuery(songQuery)
                if (song[0].hasOwnProperty('playCount') && song[0].playCount) {
                    sum = sum + song[0].playCount;
                }
            }))
            return { playlistId: playlist.id, sum }
        }))
        const sorted = summed.sort(compare).slice(0, 21)
        const topPlayedArtists = await Promise.all(sorted.map(async (obj: any) => {
            const topPlayedQuery = datastore.createQuery('Playlist').filter('id', '=', Number(obj.playlistId))
            const [playlist] = await datastore.runQuery(topPlayedQuery)
            return playlist[0];
        }))
        return topPlayedArtists

    } else {
        const query = datastore.createQuery('Song').filter('playCount', '>', 0)
        const [data] = await datastore.runQuery(query);
        let summed;
        let arrSummed: any[] = [];
        if (key === 'Artist') {
            summed = data.sort((song: Song) => song.artistId).forEach((song: Song) => {
                if (arrSummed.find(obj => obj.artistId === song.artistId)) {
                    arrSummed.find(obj => obj.artistId === song.artistId).sum += song.playCount
                } else {
                    arrSummed.push({ artistId: song.artistId, sum: song.playCount })
                }
            })
            const sorted = arrSummed.sort(compare).slice(0, 21)
            const topPlayedArtists = await Promise.all(sorted.map(async (obj) => {
                const topPlayedQuery = datastore.createQuery('Artist').filter('id', '=', Number(obj.artistId))
                const [artist] = await datastore.runQuery(topPlayedQuery)
                return artist[0];
            }))
            return topPlayedArtists
        }
        else if (key === 'Album') {
            summed = data.sort((song: Song) => song.albumId).forEach((song: Song) => {
                if (arrSummed.find(obj => obj.albumId === song.albumId)) {
                    arrSummed.find(obj => obj.albumId === song.albumId).sum += song.playCount
                } else {
                    arrSummed.push({ albumId: song.albumId, sum: song.playCount })
                }
            })
            const sorted = arrSummed.sort(compare).slice(0, 21)
            const topPlayedAlbums = await Promise.all(sorted.map(async (obj) => {
                const topPlayedQuery = datastore.createQuery('Album').filter('id', '=', Number(obj.albumId))
                const [album] = await datastore.runQuery(topPlayedQuery)
                return album[0];
            }))
            return topPlayedAlbums
        }
    }
}

const topNews = (key: string) => {
    const query = datastore
        .createQuery(key)
        .order('createdAt', { descending: true })
        .limit(20);

    return datastore.runQuery(query);
}

function compare(a: any, b: any) {
    if (b.sum < a.sum) {
        return -1;
    }
    if (b.sum > a.sum) {
        return 1;
    }
    return 0;
}

const artistQuery = (id: number) => {
    const query = datastore
        .createQuery('Artist')
        .filter('id', '=', id);

    return datastore.runQuery(query);
}
const albumQuery = (id: number) => {
    const query = datastore
        .createQuery('Album')
        .filter('id', '=', id);

    return datastore.runQuery(query);
}

module.exports = router;