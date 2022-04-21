import React, { useEffect,useState } from "react";
import { useSelector,useDispatch } from 'react-redux';
import { getOtherInfo } from '../../redux/actions/profileActions'
import { IUser, RootStore } from "../../utils/TypeScript";
import Loading from '../global/Loading';

interface IProps {
    id: string
}

const OtherInfo: React.FC<IProps> = ({id}) => {

    const dispatch = useDispatch()
    const { otherInfo } = useSelector((state: RootStore ) => state)

    const [ other,setOther ] = useState<IUser>()

    useEffect(() => {
        if(!id) return;
    
        if(otherInfo.every(user => user._id !== id)){
          dispatch(getOtherInfo(id))
        }else{
          const newUser = otherInfo.find(user => user._id === id)
          if(newUser) setOther(newUser)
        }
    },[id, otherInfo, dispatch])

    if(!other) return <Loading/>
    return(
        <div className="profile_info neomorphism text-center rounded">
            <div className="info_avatar">
                <img src={other.avatar} alt="avatar" />
            </div>

            <div>
                <span>
                    {other.name}
                </span>
            </div>   

            <div>
                <span>
                    {other.email}
                </span>
            </div> 

            <div>
            JoinedAt: <span>
                        { new Date(other.createdAt).toDateString() }
                      </span>
            </div>  
        </div>
    )
}

export default OtherInfo;