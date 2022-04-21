import { useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import NotFound from "../components/global/NotFound";
import { deleteUser, getUsers } from "../redux/actions/usersActions";
import { RootStore } from "../utils/TypeScript";


const Users = () => {

    const { auth,users } = useSelector((state: RootStore) => state)
    const dispatch = useDispatch()

    // const [users,setUsers] = useState<IUser[]>([])
    
    // useEffect(() => {
    //    if(auth.user?.role === 'admin') {
    //        getAPI('users',auth.access_token)
    //        .then(res => {
    //             setUsers(res.data)

    //        })
    //    }
    // },[auth.access_token,auth.user?.role])

    useEffect(() => {
        if(auth.user?.role === 'admin') dispatch(getUsers(auth.access_token!))
    },[dispatch,auth.user?.role,auth.access_token])

    const handleDelete = (id:string) => {
        if(auth.user?._id !== id) {
            if(window.confirm("Are you sure you want to delete this user?")){
               dispatch(deleteUser(id,auth.access_token!))
            }
        }
    }

    if(auth.user?.role !== "admin") return <NotFound/>
    return (
        <div className="w-100 my-5 d-flex justify-content-center overflow-auto">
            <div>
                <table className="table neomorphism">
                    <thead >
                        <tr>
                            <th scope="col">_id</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Admin</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-secondary">
                        {
                            users.map(data => (
                                <tr key={data._id}>
                                    <th scope="row">{data._id}</th>
                                    <td>
                                        <Link to={`/profile/${data._id}`}>
                                            {data.name}
                                        </Link>    
                                    </td>
                                    <td>{data.email}</td>
                                    <td className="text-center">
                                        {
                                            data.role === "admin" 
                                            ? <i className="fas fa-check" title="Admin"></i>
                                            : <i className="fas fa-times" title="User"></i> 
                                        }
                                    </td>
                                    <td className="text-center">
                                        <i style={{cursor:'pointer'}} className="fas fa-trash-alt text-danger" title="Remove"
                                        onClick={() => handleDelete(data._id)} ></i>
                                    </td>
                                </tr>
                            
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Users;