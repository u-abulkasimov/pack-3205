import express, { Application } from 'express';
import cors from 'cors';
import router from './routes';
import ErrorHandler from './middleware/ErrorHandler';

const app: Application = express();
const port: number = 3091;
const host: string = 'http://localhost';
import path from 'path';

app.use(express.static(path.resolve(__dirname, '../../client/build')));
app.use(cors());

// register API root
app.use(express.json())
app.use('/api/v1', router);
app.use(ErrorHandler);

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../client/build', 'index.html'));
});

const start = async () => {
    try {
        app.listen(port, () => {
            console.log(`\nServer listening on ${host}:${port}\n`);
        });
    } catch (e) {
        console.log(e);
    }
}

start();
