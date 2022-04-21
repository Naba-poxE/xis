import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteEmail, getEmails } from "../redux/actions/subscriberAction";
import { RootStore } from "../utils/TypeScript";
import NotFound from "../components/global/NotFound";


const Subscription = () => {

    const { auth,subscribers } = useSelector((state: RootStore) => state)
    
    const dispatch = useDispatch()

    useEffect(() => {
        if(auth.user?.role === 'admin') dispatch(getEmails(auth.access_token!))
    },[dispatch,auth.user?.role,auth.access_token])

    const handleDelete = (id:string) => {
        if(auth.user?._id !== id) {
            if(window.confirm("Are you sure you want to delete this user?")){
               dispatch(deleteEmail(id,auth.access_token!))
            }
        }
    }

    if(auth.user?.role !== "admin") return <NotFound/>
    return (
        <div className="w-100 my-5 d-flex justify-content-center overflow-auto">
            <div>
                <table className="table neomorphism">
                    <thead>
                        <tr>
                            <th scope="col">_id</th>
                            <th scope="col">Email</th>
                            <th scope="col">CreatedAt</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-secondary">
                       {
                           subscribers.map(data => (
                            <tr key={data._id} >
                                <th scope="row">{data._id}</th>
                                <td>{data.email}</td>
                                <td>{new Date(data.createdAt).toDateString()}</td>
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

export default Subscription;