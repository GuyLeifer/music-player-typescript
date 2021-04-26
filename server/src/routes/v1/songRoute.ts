import { Router, Response, Request } from 'express';
import { Song } from '../../types/types';
const { Datastore } = require('@google-cloud/datastore');
const router = Router();

const datastore = new Datastore();

router.get('/', async (req: Request, res: Response) => {
    try {
        const [allSongs]: Song[] = await getSongs();
        res.send(allSongs)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

router.get('/:songId', async (req: Request, res: Response) => {
    const { songId } = req.params
    try {
        const song = await getSong(Number(songId));
        res.send(song)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

router.patch('/:songId', async (req: Request, res: Response) => {
    const { songId } = req.params;
    const { like } = req.body;
    try {
        const songKey = datastore.key(['Song', Number(songId)])
        const [song] = await datastore.get(songKey);
        if (like === 'like') {
            song.likes ? song.likes = song.likes + 1 : song.likes = 1
        } else if (like === 'unlike') {
            song.likes ? song.likes = song.likes - 1 : song.likes = 0
        } else {
            song.playCount ? song.playCount = song.playCount + 1 : song.playCount = 1
        }
        const entity = {
            key: songKey,
            data: song,
        };
        await datastore.update(entity);
        res.send(entity)
    } catch (err) {
        res.status(500).send(err.message)
    }
})


const getSongs = () => {
    const query = datastore.createQuery('Song')
    return datastore.runQuery(query);
};

const getSong = async (id: number) => {
    const query = datastore.createQuery('Song').filter('id', '=', Number(id))
    const [song] = await datastore.runQuery(query);

    if (song) {
        const artistQuery = datastore.createQuery('Artist').filter('id', '=', Number(song[0].artistId))
        const [artist] = await datastore.runQuery(artistQuery);

        const albumQuery = datastore.createQuery('Album').filter('id', '=', Number(song[0].albumId))
        const [album] = await datastore.runQuery(albumQuery);

        return { song: song[0], artist: artist[0], album: album[0] }
    }

};



module.exports = router;