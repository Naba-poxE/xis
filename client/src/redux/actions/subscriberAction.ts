import { Dispatch } from "redux";
import { postAPI,deleteAPI,getAPI } from "../../utils/FetchDatas";
import { validateEmail } from "../../utils/Valid";
import { ALERT, IAlertType } from "../types/alertType";
import { checkTokenExp } from "../../utils/checkTokenExp";
import { DELETE_EMAIL, GET_EMAILS, ISubscribeType } from "../types/subscriptionType";



export const postEmail = (email: string) => async (dispatch: Dispatch<IAlertType>) => {
    const check = validateEmail(email)
    if(!check) return dispatch({type: ALERT, payload: {errors: "Please enter a valid email!"}})
    try {
        
        await postAPI('subscribe',{email})

        dispatch({
            type: ALERT,
            payload: { success: "Congrats! See ya in your inbox"}
        })

    } catch (err: any) {
        dispatch({
            type: ALERT,
            payload: { errors: err.response.data.msg}
        })
    }
}

export const getEmails = (token:string) => async (dispatch: Dispatch<IAlertType | ISubscribeType>) => {
    const result = await checkTokenExp(token,dispatch)
    const access_token = result ? result : token
    try {
        dispatch({type: ALERT, payload:{loading:true}})

        const res = await getAPI('subscribe',access_token)

        dispatch({
            type: GET_EMAILS,
            payload: res.data
        })
        
        dispatch({type:ALERT, payload:{loading:false}})
    } catch (err:any) {
        dispatch({type: ALERT, payload: {errors: err.response.data.msg}})
    }
}

export const deleteEmail = (id:string,token:string) => async (dispatch: Dispatch<IAlertType | ISubscribeType>) => {
    const result = await checkTokenExp(token,dispatch)
    const access_token = result ? result : token
    try {
        dispatch({type:DELETE_EMAIL,payload:id})
        await deleteAPI(`subscribe/${id}`,access_token)

    } catch (err:any) {
        dispatch({type: ALERT, payload: {errors: err.response.data.msg}})
    }
}