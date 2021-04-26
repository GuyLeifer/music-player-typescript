import { Router, Response, Request } from 'express';
import { Album, FullAlbum } from '../../types/types';
const { Datastore } = require('@google-cloud/datastore');
const router = Router();

const datastore = new Datastore();

router.get('/', async (req: Request, res: Response) => {
    try {
        const [allAlbums]: Album[] = await getAlbums();
        res.send(allAlbums)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

router.get('/:albumId', async (req: Request, res: Response) => {
    const { albumId } = req.params
    try {
        const album: FullAlbum = await getAlbum(Number(albumId));
        res.send(album)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

router.patch('/:albumId', async (req: Request, res: Response) => {
    const { albumId } = req.params;
    const { like } = req.body;
    try {
        const albumKey = datastore.key(['Album', Number(albumId)])
        const [album] = await datastore.get(albumKey);
        if (like === 'like') {
            album.likes ? album.likes = album.likes + 1 : album.likes = 1
        } else if (like === 'unlike') {
            album.likes ? album.likes = album.likes - 1 : album.likes = 0
        }
        const entity = {
            key: albumKey,
            data: album,
        };
        await datastore.update(entity);
        res.send(entity)
    } catch (err) {
        res.status(500).send(err.message)
    }
})


const getAlbums = () => {
    const query = datastore.createQuery('Album')
    return datastore.runQuery(query);
};

const getAlbum = async (id: number) => {
    const query = datastore.createQuery('Album').filter('id', '=', Number(id))
    const [album] = await datastore.runQuery(query);

    const songQuery = datastore.createQuery('Song').filter('albumId', '=', Number(id))
    const [songs] = await datastore.runQuery(songQuery);

    const artistQuery = datastore.createQuery('Artist').filter('id', '=', Number(album[0].id))
    const [artist] = await datastore.runQuery(artistQuery);

    return { album: album[0], artist: artist[0], songs };
};



module.exports = router;