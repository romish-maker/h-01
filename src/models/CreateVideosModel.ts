import {RESOLUTIONS_ENUM} from "../enums";

export type CreateVideosModel = {
    title: string
    author: string
    availableResolutions: RESOLUTIONS_ENUM[]
}