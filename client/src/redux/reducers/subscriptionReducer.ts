import { ISubscriber } from "../../utils/TypeScript";
import { DELETE_EMAIL, GET_EMAILS, ISubscribeType } from "../types/subscriptionType";



const subscriptionReducer = (state: ISubscriber[] = [] ,action: ISubscribeType) : ISubscriber[] => {
    switch (action.type) {
        case GET_EMAILS:
            return action.payload
    
        case DELETE_EMAIL:
            return state.filter(item => item._id !== action.payload)

        default:
            return state
    }
}   

export default subscriptionReducer;