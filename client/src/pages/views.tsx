import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import NotFound from "../components/global/NotFound";
import { IBlog, RootStore } from "../utils/TypeScript";
import { deleteBlog } from "../redux/actions/blogActions";
import { ALERT } from "../redux/types/alertType";



const Views = () => {

    const { auth,homeBlogs } = useSelector((state: RootStore) => state)

    const dispatch = useDispatch()

    const handleDelete = (blog: IBlog) => {
        if(!auth.user || !auth.access_token) return;

        if(auth.user.role === 'admin') {
            if(window.confirm("Do you want to delete this blog?")) {
                dispatch(deleteBlog(blog, auth.access_token))
            }
        }else {
            return dispatch({
                type: ALERT,
                payload: { errors: "Invalids Authentication"}
            })
        } 
    }


    if(auth.user?.role !== "admin") return <NotFound/>
    return(
        <div className="w-100 my-5 d-flex justify-content-center overflow-auto">
            <div>
                <table className="table neomorphism">
                    <thead>
                        <tr>
                            <th scope="col">_id</th>
                            <th scope="col">Category</th>
                            <th scope="col">Title</th>
                            <th scope="col">Writer</th>
                            <th scope="col">Views</th>
                            <th scope="col">CreatedAt</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-secondary">
                        {
                            homeBlogs.map(homeBlog => (
                                homeBlog.blogs.map(blog => (
                                    <tr key={blog._id}>
                                        <th scope="row">{blog._id}</th>
                                        <td>{homeBlog.name}</td>
                                        <td>
                                            <Link to={`/blog/${blog._id}`}>
                                                {blog.title.slice(0,50) + "..."}
                                            </Link>
                                        </td>
                                        <td>
                                            {
                                                typeof(blog.user) !== 'string' &&
                                                <Link to={`/profile/${blog.user._id}`}>{blog.user.name}</Link>
                                            }
                                        </td>
                                        <td className="text-center">{blog.views}</td>
                                        <td>{new Date(blog.createdAt).toDateString()}</td>
                                        <td>
                                            <Link style={{marginRight:'15px'}} to={`/update_blog/${blog._id}`}>
                                                <i className="fas fa-edit text-success" title="Edit"></i>
                                            </Link>
                                            <i style={{cursor:'pointer'}} className="fas fa-trash-alt text-danger" title="Remove"
                                            onClick={() =>  handleDelete(blog)}></i>
                                        </td>
                                    </tr>
                                ))
                            ))    
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Views;