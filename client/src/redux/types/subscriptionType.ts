import { ISubscriber } from "../../utils/TypeScript"

export const GET_EMAILS = "GET_EMAILS"
export const DELETE_EMAIL = "DELETE_EMAIL"

export interface IGetEmailsType {
    type: typeof GET_EMAILS
    payload: ISubscriber[]
}

export interface IDeleteEmailType {
    type: typeof DELETE_EMAIL
    payload: string
}

export type ISubscribeType =
| IGetEmailsType
| IDeleteEmailType