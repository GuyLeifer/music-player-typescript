import { Router, Response, Request } from 'express';
const { Datastore } = require('@google-cloud/datastore');
const router = Router();

const datastore = new Datastore();

router.get('/', async (req: Request, res: Response) => {
    const searchWord: any = req.query.params
    if (req.query.params === "") {
        res.send([[], [], [], []]);
    } else {
        try {
            const [songs] = await getSearch('Song', searchWord)
            const [artists] = await getSearch('Artist', searchWord)
            const [albums] = await getSearch('Album', searchWord)
            const [users] = await getSearch('User', searchWord)
            res.send([songs, artists, albums, users])
        } catch (err) {
            res.send(err.message)
        }
    }
})

const getSearch = async (key: string, word: string) => {
    word = word.toLowerCase();
    word = word.charAt(0).toUpperCase() + word.slice(1);
    const newWord: string = word.replace(word.charAt(word.length - 1), word.charAt(word.length - 1) + 'z')
    const query = datastore.createQuery(key)
        .filter(key === 'Song' ? 'title' : 'name', '>', word)
        .filter(key === 'Song' ? 'title' : 'name', '<=', newWord)
        .limit(3)
    return datastore.runQuery(query);
};

module.exports = router