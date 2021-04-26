import { Router, Response, Request } from 'express';
import { Artist, FullArtist } from '../../types/types';
const { Datastore } = require('@google-cloud/datastore');
const router = Router();

const datastore = new Datastore();

router.get('/', async (req: Request, res: Response) => {
    try {
        const [allArtists]: Artist[] = await getArtists();
        res.send(allArtists)
    } catch (err) {
        res.status(500).send(err.message)
    }
})
router.get('/:artistId', async (req: Request, res: Response) => {
    const { artistId } = req.params
    try {
        const artist: FullArtist = await getArtist(Number(artistId));
        res.send(artist)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

router.patch('/:artistId', async (req: Request, res: Response) => {
    const { artistId } = req.params;
    const { like } = req.body;
    try {
        const artistKey = datastore.key(['Artist', Number(artistId)])
        const [artist] = await datastore.get(artistKey);
        if (like === 'like') {
            artist.likes ? artist.likes = artist.likes + 1 : artist.likes = 1
        } else if (like === 'unlike') {
            artist.likes ? artist.likes = artist.likes - 1 : artist.likes = 0
        }
        const entity = {
            key: artistKey,
            data: artist,
        };
        await datastore.update(entity);
        res.send(entity)
    } catch (err) {
        res.status(500).send(err.message)
    }
})


const getArtists = () => {
    const query = datastore.createQuery('Artist')
    return datastore.runQuery(query);
};

const getArtist = async (id: number) => {
    const query = datastore.createQuery('Artist').filter('id', '=', Number(id))
    const [artist] = await datastore.runQuery(query);

    const songQuery = datastore.createQuery('Song').filter('artistId', '=', Number(id))
    const [songs] = await datastore.runQuery(songQuery);

    const albumQuery = datastore.createQuery('Album').filter('artistId', '=', Number(id))
    const [albums] = await datastore.runQuery(albumQuery);

    return { artist: artist[0], songs, albums }
};



module.exports = router;