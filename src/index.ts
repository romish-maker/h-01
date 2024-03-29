import express, { Request, Response } from 'express'
import {HTTP_STATUSES, RESOLUTIONS_ENUM} from "./enums";
import {ErrorsMessagesType, RequestWithBody, RequestWithParams, RequestWithParamsAndBody, VideoType} from "./types";
import {CreateVideosModel} from "./models/CreateVideosModel";
import {URIParamsVideoIdModel} from "./models/URIParamsVideoIdModel";
import {VideoViewModel} from "./models/VideoViewModel";
import {UpdateVideosModel} from "./models/UpdateVideosModel";
import {addDays} from "date-fns";


export const app = express()
const port = 3003

const jsonMiddleware = express.json()

app.use(jsonMiddleware);


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
            publicationDate: addDays(new Date(), 1).toISOString(),
            title: "romish-title",
        },
    ]
}
const getVideosViewModel = (video: VideoType | undefined): VideoType | undefined => {
    if (video) {
        return {
            author: video.author,
            availableResolutions: video.availableResolutions,
            canBeDownloaded: video.canBeDownloaded,
            createdAt: video.createdAt,
            id: video.id,
            minAgeRestriction: video.minAgeRestriction,
            publicationDate: video.publicationDate,
            title: video.title,
        }
    }

    return undefined
}
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!23e23')
})


app.get('/videos', (req: Request, res: Response<VideoViewModel[]>) => {
    res.json(db.videos)
        .sendStatus(HTTP_STATUSES.OK_200)
})

app.post('/videos', (req: RequestWithBody<CreateVideosModel>, res: Response<VideoType | any>) => {
    const reqBody: (keyof CreateVideosModel)[] = ['title', 'author', 'availableResolutions'];
    const errorsMessages: ErrorsMessagesType[] = [];

    reqBody.forEach(key => {
        if (req.body[key] === undefined || req.body[key] === null || req.body[key] === "") {
            errorsMessages.push({
                field: key,
                message: 'This field is required.'
            });
        }
    });


    const validResolutions = Object.values(RESOLUTIONS_ENUM);

    const areValidResolutions = req.body.availableResolutions.every(resolution => validResolutions.includes(resolution));

    if (!areValidResolutions) {
        errorsMessages.push({
            field: 'availableResolutions',
            message: 'Invalid resolution value(s).'
        });
    }

    if (req.body.title?.length > 40) {
        errorsMessages.push({
            field: 'title',
            message: 'title length should not be more than 40 characters'
        });
    }

    if (req.body.author?.length > 20) {
        errorsMessages.push({
            field: 'author',
            message: 'author length should not be more than 20 characters'
        });
    }

    if (errorsMessages.length > 0) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400)
            .json({errorsMessages: errorsMessages});

        return
    }

    const newVideo = {
        author: req.body.author,
        availableResolutions: req.body.availableResolutions,
        canBeDownloaded: false,
        createdAt: new Date().toISOString(),
        id: +new Date(),
        minAgeRestriction: null,
        publicationDate: addDays(new Date(), 1).toISOString(),
        title: req.body.title,
    }

    db.videos.push(newVideo)

    res.status(HTTP_STATUSES.CREATED_201)
        .json(getVideosViewModel(newVideo))
})

app.get('/videos/:id', (req: RequestWithParams<URIParamsVideoIdModel>, res: Response<VideoViewModel>) => {
    const foundVideo = db.videos.find(video => video.id === +req.params.id)

    if (!foundVideo) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    res.json(getVideosViewModel(foundVideo))
        .sendStatus(HTTP_STATUSES.OK_200)
})

app.delete('/videos/:id', (req: RequestWithParams<URIParamsVideoIdModel>, res: Response) => {
    const foundVideo = db.videos.find(video => video.id === +req.params.id);

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

    const validResolutions = Object.values(RESOLUTIONS_ENUM);

    const areValidResolutions = req.body.availableResolutions.every(resolution => validResolutions.includes(resolution));

    if (!areValidResolutions) {
        errorsMessages.push({
            field: 'availableResolutions',
            message: 'Invalid resolution value(s).'
        });
    }

    if (typeof req.body.canBeDownloaded !== 'boolean') {
        errorsMessages.push({
            field: 'canBeDownloaded',
            message: 'canBeDownloaded should be boolean type'
        });
    }

    if (req.body.title?.length > 40) {
        errorsMessages.push({
            field: 'title',
            message: 'title length should not be more than 40 characters'
        });
    }

    if (req.body.author?.length > 20) {
        errorsMessages.push({
            field: 'author',
            message: 'author length should not be more than 20 characters'
        });
    }

    if (req.body.minAgeRestriction && req.body.minAgeRestriction > 18) {
        errorsMessages.push({
            field: 'minAgeRestriction',
            message: 'minAgeRestriction cannot be upper than 18'
        });
    }

    if (typeof req.body.publicationDate !== 'string') {
        errorsMessages.push({
            field: 'publicationDate',
            message: 'publicationDate is not correct format'
        });
    }

    if (errorsMessages?.length > 0) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400)
            .json({errorsMessages: errorsMessages});

        return;
    }

    const foundVideo = db.videos.find(video => video.id === +req.params.id)

    if (!foundVideo) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    foundVideo.title = req.body.title;
    foundVideo.author = req.body.author;
    foundVideo.availableResolutions = req.body.availableResolutions;
    foundVideo.canBeDownloaded = req.body.canBeDownloaded;
    foundVideo.minAgeRestriction = req.body.minAgeRestriction;
    foundVideo.publicationDate = req.body.publicationDate;

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