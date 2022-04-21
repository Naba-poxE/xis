import { IUser } from "../../utils/TypeScript";
import { DELETE_USER, GET_USERS, IUsersType } from "../types/usersType";


const usersReducer = (state: IUser[] = [], action: IUsersType): IUser[] => {
    switch (action.type) {
        case GET_USERS:
            return action.payload

        case DELETE_USER:
            return state.filter(item => item._id !== action.payload)

        default:
            return state
    }
}

export default usersReducer;