import { Dispatch } from "redux"
import { checkTokenExp } from "../../utils/checkTokenExp"
import { deleteAPI, getAPI } from "../../utils/FetchDatas"
import { ALERT, IAlertType } from "../types/alertType"
import { DELETE_USER, GET_USERS,IUsersType } from "../types/usersType"



export const getUsers = (token:string) => async (dispatch: Dispatch<IAlertType | IUsersType>) => {
    const result = await checkTokenExp(token,dispatch)
    const access_token = result ? result : token
    try {
        dispatch({type: ALERT, payload:{loading:true}})

        const res = await getAPI('users',access_token)

        dispatch({
            type: GET_USERS,
            payload: res.data
        })
        
        dispatch({type:ALERT, payload:{loading:false}})
    } catch (err:any) {
        dispatch({type: ALERT, payload: {errors: err.response.data.msg}})
    }
}

export const deleteUser = (id:string,token:string) => async (dispatch: Dispatch<IAlertType | IUsersType>) => {
    const result = await checkTokenExp(token,dispatch)
    const access_token = result ? result : token
    try {
        dispatch({type:DELETE_USER,payload:id})
        await deleteAPI(`delete_user/${id}`,access_token)

    } catch (err:any) {
        dispatch({type: ALERT, payload: {errors: err.response.data.msg}})
    }
}