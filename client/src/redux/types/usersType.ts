import { IUser } from "../../utils/TypeScript";

export const GET_USERS = "GET_USERS"
export const DELETE_USER = "DELETE_USER"
export const UPDATE_USER = "UPDATE_USER"

export interface IGetUsersType {
    type: typeof GET_USERS
    payload: IUser[]
}

export interface IDeleteUserType {
    type: typeof DELETE_USER
    payload: string
}

export interface IUpdateUserType {
    type: typeof UPDATE_USER
    payload: string
}

export type IUsersType =
| IGetUsersType
| IDeleteUserType
| IUpdateUserType