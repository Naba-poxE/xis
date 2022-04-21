import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link,useHistory } from 'react-router-dom';
import LoginPass from "../components/auth/LoginPass";
import { RootStore } from "../utils/TypeScript";

const Login = () => {
    const history = useHistory()

    const { auth } = useSelector((state: RootStore) => state)

    useEffect(() => {
        if(auth.access_token) {
            let url = history.location.search.replace('?','/')
            return  history.push(url)
        }
    },[auth.access_token,history])

    return(
        <div className="auth_page"> 
           <div className="auth_box neomorphism">
               <h3 className="text-uppercase text-center fw-bold mb-4">Welcome Editors</h3>
               <LoginPass/>

               <small className="row my-2 text-primary">
                   <span className="col-6">
                       <Link to='/forgot_password' className="text-primary">
                            Forgot Password?
                       </Link>  
                   </span>
               </small>
           </div>
        </div>
    )
}

export default Login;