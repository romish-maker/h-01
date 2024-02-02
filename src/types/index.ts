import { Request } from 'express'
import {RESOLUTIONS_ENUM} from "../enums";

export type RequestWithBody<BODY> = Request<{}, {}, BODY>
export type RequestWithQuery<QUERY> = Request<{}, {}, {}, QUERY>
export type RequestWithParams<PARAMS> = Request<PARAMS>
export type RequestWithParamsAndBody<PARAMS, BODY> = Request<PARAMS, {}, BODY>


export type VideoType = {
    id: number;
    title: string;
    author: string;
    canBeDownloaded: boolean
    minAgeRestriction: number | null
    createdAt: string
    publicationDate: string;
    availableResolutions: RESOLUTIONS_ENUM[]
}

export type ErrorsMessagesType = {
    field: string;
    message: string;
}