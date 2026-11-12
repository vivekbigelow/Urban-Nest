'use client'
import React from "react"
import { IUser } from "../types/userTypes"
import { baseFetchOption, BASE_LOCAL_URL_PATH } from "../types/globalTypes"
import { usePathname } from "next/navigation"
import { IAuthResponse } from "../types/authTypes"
import { IAuthUserResponse } from "../types/userTypes"


const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
const isReload = navigation?.type === "reload"

type IUserState = {
    user: IUser | undefined,
    isAuthenticated: boolean
}

type IAuthState = {
    state: IUserState,
    dispatch: React.ActionDispatch<[action: IAction]>
}

const getUser = async (): Promise<IAuthUserResponse> => {
    const res = await fetch(`${BASE_LOCAL_URL_PATH}/api/me`, {
        method: "GET",
        ...baseFetchOption
    })

    const data: IAuthUserResponse = await res.json()

    return data;
}
const getAuth = async (): Promise<IAuthResponse> => {
    const res = await fetch(`${BASE_LOCAL_URL_PATH}/api/auth`, {
        method: "GET",
        ...baseFetchOption
    })

    const data: IAuthResponse = await res.json()

    return data;
}
const initialUserState: IUserState = {
    user: undefined,
    isAuthenticated: isReload ? (await getAuth()).data?.isAuthenticated ?? false : false
}

const initialAuthState: IAuthState = {
    state: initialUserState,
    dispatch: () => undefined
}

type IAction =
    { type: "updateUser", payload: IUser }
    | { type: "logout" }
    | { type: "updateAuth", payload: boolean }



const reducer = (current: IUserState, action: IAction): IUserState => {
    switch (action.type) {
        case "updateUser":
            const res = { ...current, user: action.payload }
            return res

        case "logout":
            return {
                ...current,

                //Will update sesion cookie to delete later
                user: undefined,
                isAuthenticated: false
            };


        case "updateAuth": {
            return { ...current, isAuthenticated: action.payload }
        }

    }
}


const AuthContext = React.createContext<IAuthState>(initialAuthState)


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = React.useReducer(reducer, initialUserState)
    const pathname = usePathname();
    const isLoggedinAndReg =
        pathname !== "/login" && pathname !== "/register"

    React.useEffect(() => {

        const handleAuth = async () => {
            const res = await getAuth()
            const { data: authData } = res
            if (authData?.isAuthenticated) {
                dispatch({ type: "updateAuth", payload: authData.isAuthenticated })
                const userData = await getUser()
                const { data } = userData
                if (data?.user) {
                    dispatch({ type: "updateUser", payload: data?.user })
                }
            }
        }
        handleAuth()
    }, [isLoggedinAndReg])


    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    )

}


export default function useAuth() {
    return React.useContext(AuthContext)

}