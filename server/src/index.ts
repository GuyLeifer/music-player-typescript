import app from './app';

const port: Number = 8080;

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})