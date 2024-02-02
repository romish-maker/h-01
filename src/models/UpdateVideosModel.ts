import {RESOLUTIONS_ENUM} from "../enums";

export type UpdateVideosModel = {
    title: string;
    author: string;
    canBeDownloaded: boolean
    minAgeRestriction: number | null
    publicationDate: string;
    availableResolutions: RESOLUTIONS_ENUM[]
}