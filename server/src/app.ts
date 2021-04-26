import express, { Application, Request, Response } from 'express';
const path = require('path')

const app: Application = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, '../build')))

app.use('/api', require('./routes/v1'));

app.get("*", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../build/', "index.html"))
});

export default app;