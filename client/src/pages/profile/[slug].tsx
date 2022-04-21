import { useParams } from "react-router"
import { useSelector } from "react-redux"
import { IParams } from "../../utils/TypeScript"
import { RootStore } from "../../utils/TypeScript"
import UserBlogs from "../../components/profile/UserBlogs"
import UserInfo from "../../components/profile/UserInfo"
import OtherInfo from "../../components/profile/OtherInfo"

const Profile = () => {
    const { slug }: IParams = useParams()
    const { auth } = useSelector((state : RootStore) => state) 

    return (
        <div className="row m-4">
           <div className="col-md-5 mb-3">
                {
                    auth.user?._id === slug
                    ? <UserInfo/>
                    : <OtherInfo id={slug}/>
                }
           </div>

           <div className="col-md-7">
                <UserBlogs/>
           </div>
        </div>
    )
}

export default Profile