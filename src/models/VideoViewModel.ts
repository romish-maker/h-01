import {RESOLUTIONS_ENUM} from "../enums";

export type VideoViewModel = {
    id: number;
    title: string;
    author: string;
    canBeDownloaded: boolean
    minAgeRestriction: number | null
    createdAt: string
    publicationDate: string;
    availableResolutions: RESOLUTIONS_ENUM[]
}