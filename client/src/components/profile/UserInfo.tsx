import { useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import { RootStore,InputChange, IUserProfile,FormSubmit } from "../../utils/TypeScript";
import NotFound from "../global/NotFound";
import { updateUser,resetPassword } from "../../redux/actions/profileActions";

const UserInfo = () => {
    const initState = {
        name:'',
        email:'',
        avatar:'',
        password:'',
        cf_password:''
    }

    const { auth } = useSelector((state: RootStore) => state)
    const dispatch = useDispatch()

    const [ user,setUser ] = useState<IUserProfile>(initState)
    const [ typePass,setTypePass ] = useState(false)
    const [ typeCfPass,setTypeCfPass ] = useState(false)

    const handleChangeInput = (e: InputChange) => {
        const { name,value } = e.target
        setUser({...user, [name]:value })
    }

    const handleChangeFile = (e: InputChange) => {
        const target = e.target as HTMLInputElement
        const files = target.files

        if(files) {
            const file = files[0]
            setUser({...user, avatar: file})
        }
    }

    const handleSubmit = (e: FormSubmit) => {
        e.preventDefault()
        if( avatar || name ) {
            dispatch(updateUser((avatar as File),name,auth))
        }

        if( password && auth.access_token ) {
            dispatch(resetPassword( password, cf_password, auth.access_token))
        }
    }

    const { name,avatar,password,cf_password } = user

    if(!auth.user) return <NotFound/>
    return(
        <form className="profile_info glassmorphism" onSubmit={handleSubmit}>
            <div className="info_avatar">
                <img src={ avatar ? URL.createObjectURL(avatar) : auth.user?.avatar } alt="avatar" />

                <span>
                    <i className="fas fa-camera"/>
                    <p>Change</p>
                    <input 
                        type="file" 
                        accept="image/*" 
                        name="file" id="file_up"
                        onChange={handleChangeFile}/>
                </span>
            </div>
           
            <div className="form-group my-3">
                <label htmlFor="name">Name</label> 
                <input 
                    type="text" 
                    name="name" 
                    id="name"
                    className="form-control" 
                    defaultValue={auth.user?.name} 
                    onChange={handleChangeInput} />
            </div>

            <div className="form-group my-3">
                <label htmlFor="email">Email</label> 
                <input 
                    type="text" 
                    name="email" 
                    id="email"
                    className="form-control" 
                    defaultValue={auth.user?.email} 
                    onChange={handleChangeInput} 
                    disabled={true} />
            </div>

            <div className="form-group my-3">
                <label htmlFor="password">Password</label> 
                <div className="pass">
                    <input 
                        type={ typePass ? 'text' : 'password'} 
                        className="form-control" 
                        name="password" 
                        id="password"
                        value={password} 
                        onChange={handleChangeInput} />

                    <small onClick={() => setTypePass(!typePass)}>
                        {typePass ? 'Hide' : 'Show'}
                    </small>    
                </div>

            </div>

            <div className="form-group my-3">
                <label htmlFor="cf_password">Confirm password</label> 
                <div className="pass">
                    <input 
                        type={ typeCfPass ? 'text' : 'password'} 
                        className="form-control" 
                        name="cf_password" 
                        id="cf_password"
                        value={cf_password} 
                        onChange={handleChangeInput} />

                    <small onClick={() => setTypeCfPass(!typeCfPass)}>
                        {typeCfPass ? 'Hide' : 'Show'}
                    </small>    
                </div>

            </div>

            <button className="btn btn-dark w-100" type="submit">
                Update
            </button>
        </form>
    )
}

export default UserInfo;