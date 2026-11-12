import { IQueryResponse } from "./globalTypes"

export type IUserLoginData = {
    data: {
        user: {
            id: string,
            email: string,
        }
    }
}


export type IUser = {
    id: string,
    firstName: string,
    lastName: string,
    username: string,
    email: string
}

export type IAuthUserResponse = IQueryResponse & {
    data?: {
        user: IUser
    }
}