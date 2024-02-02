import express, { Request, Response } from 'express'
import {HTTP_STATUSES, RESOLUTIONS_ENUM} from "./enums";
import {ErrorsMessagesType, RequestWithBody, RequestWithParams, RequestWithParamsAndBody, VideoType} from "./types";
import {CreateVideosModel} from "./models/CreateVideosModel";
import {URIParamsVideoIdModel} from "./models/URIParamsVideoIdModel";
import {VideoViewModel} from "./models/VideoViewModel";
import {UpdateVideosModel} from "./models/UpdateVideosModel";


const app = express()
const port = 3003

const jsonMiddleware = express.json()

app.use(jsonMiddleware);


const getVideosViewModel = (video: VideoType): VideoType => {
    return {
        id: video.id,
        title: video.title,
        author: video.author,
        canBeDownloaded: video.canBeDownloaded,
        minAgeRestriction: video.minAgeRestriction,
        createdAt: video.createdAt,
        publicationDate: video.publicationDate,
        availableResolutions: video.availableResolutions,
    }
}
const db: { videos: VideoType[] } = {
    videos: [
        {
            author: "romish-author",
            availableResolutions: [
                RESOLUTIONS_ENUM.P144
            ],
            canBeDownloaded: false,
            createdAt: new Date().toISOString(),
            id: +new Date(),
            minAgeRestriction: null,
            publicationDate: new Date().toISOString(),
            title: "romish-title",
        },
    ]
}
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!23e23')
})


app.get('/videos', (req: Request, res: Response<VideoViewModel[]>) => {
    res.json(db.videos)
        .sendStatus(HTTP_STATUSES.OK_200)
})

app.post('/videos', (req: Request<RequestWithBody<CreateVideosModel>>, res: Response<VideoType | any>) => {
    const reqBody = ['title', 'author', 'availableResolutions'];
    const errorsMessages: ErrorsMessagesType[] = [];

    reqBody.forEach(key => {
        if (req.body[key] === undefined || req.body[key] === null || req.body[key] === "") {
            errorsMessages.push({
                field: key,
                message: 'This field is required.'
            });
        }
    });

    if (errorsMessages.length > 0) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400)
            .json({errorsMessages: errorsMessages});
    }

    const newVideo = {
        id: +new Date(),
        title: req.body.title,
        author: req.body.author,
        availableResolutions: req.body.availableResolutions,
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date().toISOString(),
    }

    db.videos.push(newVideo)

    res.status(HTTP_STATUSES.CREATED_201)
        .json(getVideosViewModel(newVideo))
})

app.get('/videos/:id', (req: RequestWithParams<URIParamsVideoIdModel>, res: Response<VideoViewModel>) => {
    const foundVideo = db.videos.find(video => video.id === req.params.id)

    if (!foundVideo) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    res.json(getVideosViewModel(foundVideo))
        .sendStatus(HTTP_STATUSES.OK_200)
})

app.delete('/videos/:id', (req: RequestWithParams<URIParamsVideoIdModel>, res: Response) => {
    const foundVideo = db.videos.find(video => video.id === req.params.id);

    if (!foundVideo) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    db.videos = db.videos.filter(video => video.id !== +req.params.id)

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

app.put('/videos/:id', (req: RequestWithParamsAndBody<URIParamsVideoIdModel, UpdateVideosModel>, res: Response) => {
    const reqBody: (keyof UpdateVideosModel)[] = ['title', 'author', 'availableResolutions', 'canBeDownloaded', 'minAgeRestriction', 'publicationDate'];
    const errorsMessages: ErrorsMessagesType[] = [];

    reqBody.forEach((key) => {
        if (req.body[key] === undefined || req.body[key] === null || req.body[key] === "") {
            errorsMessages.push({
                field: key,
                message: 'This field is required.'
            });
        }
    });

    if (errorsMessages.length > 0) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400)
            .json({errorsMessages: errorsMessages});
    }

    const foundVideo = db.videos.find(video => video.id === +req.params.id)

    if (foundVideo) {
        foundVideo.title = req.body.title;
        foundVideo.author = req.body.author;
        foundVideo.availableResolutions = req.body.availableResolutions;
        foundVideo.canBeDownloaded = req.body.canBeDownloaded;
        foundVideo.minAgeRestriction = req.body.minAgeRestriction;
        foundVideo.publicationDate = req.body.publicationDate;
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

// MOCK: FOR TESTS
app.delete('/testing/all-data', (req: Request, res: Response) => {
    db.videos = [];

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})