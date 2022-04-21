import React from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { deleteBlog } from "../../redux/actions/blogActions";

import { IBlog,IParams, IUser, RootStore } from "../../utils/TypeScript";
import { ALERT } from "../../redux/types/alertType";

interface IProps {
    blog: IBlog
}

const CardHoriz: React.FC<IProps> = ({blog}) => {

    const { slug } = useParams<IParams>()
    const { auth } = useSelector((state: RootStore) => state)
    const dispatch = useDispatch()

    const handleDelete = () => {
        if(!auth.user || !auth.access_token) return;

        if(slug === auth.user._id || auth.user.role === 'admin') {
            if(window.confirm("Do you want to delete this blog?")) {
                dispatch(deleteBlog(blog, auth.access_token))
            }
        }else {
            return dispatch({
                type: ALERT,
                payload: { errors: "Invalid Authentication"}
            })
        } 
        
    }

    return(
        <div className="card mb-3 bg-white" style={{minWidth: "260px", borderRadius: '15px'}}>
            <div className="row g-0 p-2">
                <div className="col-md-4" style={{
                    minHeight: '150px', maxHeight: '170px', overflow: 'hidden'
                }}>
                {
                    blog.thumbnail && 
                    <>
                    {
                        typeof(blog.thumbnail) === 'string'
                        ? <Link to={`/blog/${blog._id}`}>
                            <img src={blog.thumbnail} 
                            className="w-100 h-100" 
                            alt="thumbnail" style={{objectFit: 'cover'}} />
                          </Link>
                        :<img src={URL.createObjectURL(blog.thumbnail)} 
                            className="w-100 h-100" 
                            alt="thumbnail" style={{objectFit: 'cover'}} />
                    }
                    </>
                }
                
                </div>
                
                <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title fs-4">
                            <Link to={`/blog/${blog._id}`}
                            className="text-capitalize">
                                {blog.title}
                            </Link>
                        </h5>
                        <p className="card-text">{`${blog.description.slice(0,100)}...`}</p>
                        {   
                            blog.title && 
                                <div className="card-text d-flex justify-content-between align-items-center">
                                    {
                                        ((slug && ((blog.user as IUser)._id === auth.user?._id)) || (auth.user?.role === 'admin')) &&
                                        <div>
                                            <Link to={`/update_blog/${blog._id}`}>
                                                <i className="fas fa-edit text-success" title="edit" />
                                            </Link>

                                            <i className="fas fa-trash text-danger mx-3" 
                                                title="delete" onClick={handleDelete} />
                                        </div> 
                                    }   
                                    <small className="text-secondary">
                                        {new Date(blog.createdAt).toDateString()}
                                    </small>
                                </div>
                        }
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardHoriz;