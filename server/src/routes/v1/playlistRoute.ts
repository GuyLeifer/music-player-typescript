import { Router, Response, Request } from 'express';
import { Playlist, Song } from '../../types/types';
const { Datastore } = require('@google-cloud/datastore');

const router = Router();
const datastore = new Datastore();

router.get('/', async (req: Request, res: Response) => {
    try {
        const [allPlaylists] = await getPlaylists();
        res.send(allPlaylists)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

router.get('/by-user/:userId&:songId', async (req: Request, res: Response) => {
    const { userId, songId } = req.params
    try {
        const query = datastore.createQuery('Playlist').filter('userId', '=', Number(userId))
        const [playlists]: any[] = await datastore.runQuery(query);
        const filteredPlaylists = playlists.filter((playlist: Playlist) => !playlist.songs.find((song) => Number(song) === Number(songId)))
        res.send(filteredPlaylists);
    } catch (err) {
        res.status(500).send(err.message)
    }
})

router.get('/:playlistId', async (req: Request, res: Response) => {
    const { playlistId } = req.params
    try {
        const playlist = await getPlaylist(Number(playlistId));
        res.send(playlist)
    } catch (err) {
        res.status(500).send(err.message)
    }
})
router.post('/', async (req: Request, res: Response) => {
    const { userId, name, coverImg } = req.body;
    try {
        const id = await getLastId();
        const data = { id: id + 1, userId: userId, name: name, coverImg: coverImg, createdAt: new Date(), updatedAt: new Date(), songs: [], likes: 0 }
        await insertData(data, 'Playlist')
        res.send(data)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

router.patch('/:playlistId', async (req: Request, res: Response) => {
    const { playlistId } = req.params;
    const { like, songId } = req.body;
    try {
        const playlistKey = datastore.key(['Playlist', Number(playlistId)])
        const [playlist] = await datastore.get(playlistKey);
        if (like === 'like') {
            playlist.likes ? playlist.likes = playlist.likes + 1 : playlist.likes = 1
        } else if (like === 'unlike') {
            playlist.likes ? playlist.likes = playlist.likes - 1 : playlist.likes = 0
        } else if (songId) {
            playlist.songs.push(Number(songId))
        }
        const entity = {
            key: playlistKey,
            data: playlist,
        };
        await datastore.update(entity);
        res.send(entity)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

router.delete('/:playlistId', async (req: Request, res: Response) => {
    const { playlistId } = req.params;
    try {
        const query = datastore.createQuery('Playlist').filter('id', '=', Number(playlistId))
        const playlist = await datastore.runQuery(query);
        res.send(playlist)
    } catch (err) {
        res.status(500).send(err.message)
    }
})


const insertData = async (data: any, key: string) => {
    return datastore.insert({
        key: datastore.key(key),
        data: data,
    });
};

const getLastId = async () => {
    const query = datastore.createQuery('Playlist').order('id', { descending: true }).limit(1)
    const [playlist] = await datastore.runQuery(query);
    return Number(playlist[0].id)
}

const getPlaylists = () => {
    const query = datastore.createQuery('Playlist')
    return datastore.runQuery(query);
};

const getPlaylist = async (id: number) => {
    const query = datastore.createQuery('Playlist').filter('id', '=', Number(id))
    const [playlist] = await datastore.runQuery(query);

    const songs = await getSongs(playlist[0].songs);

    return { playlist: playlist[0], songs }
};

const getSongs = async (arr: any) => {
    const songs = await Promise.all(arr.map(async (id: number) => {
        const query = datastore.createQuery('Song').filter('id', '=', Number(id))
        const [song] = await datastore.runQuery(query)
        return song[0];
    }))
    return songs
}



module.exports = router;