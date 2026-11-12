import { IQueryResponse } from "./globalTypes"


export type IAuthResponse = IQueryResponse & {
    data?: {
        isAuthenticated: boolean
    }
}

