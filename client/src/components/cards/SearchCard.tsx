import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { IBlog } from "../../utils/TypeScript";
import { countView } from "../../redux/actions/blogActions";

interface IProps {
    blog: IBlog
}

const SearchCard: React.FC<IProps> = ({blog}) => {

    const dispatch = useDispatch()

    return(
        <div className="card mb-2 bg-transparent" style={{minWidth: "260px"}}>
            <div className="row g-0 p-2">
                {/* <div style={{
                   width:'100px',height:'100px'
                }}>
                {
                    blog.thumbnail && 
                    <>
                    {
                        typeof(blog.thumbnail) === 'string'
                        ? <Link onClick={() => dispatch(countView(blog._id))} to={`/blog/${blog._id}`}>
                            <img src={blog.thumbnail} 
                            className="w-75 h-75" 
                            alt="thumbnail" style={{objectFit: 'cover'}} />
                        </Link>
                        :<img src={URL.createObjectURL(blog.thumbnail)} 
                        className="w-75 h-75" 
                        alt="thumbnail" style={{objectFit: 'cover'}} />
                    }
                    </>
                }
                
                </div> */}
                
                <div className="col-md-auto">
                    <div className="card-body">
                        <p className="card-title">
                            <Link onClick={() => dispatch(countView(blog._id))} to={`/blog/${blog._id}`}
                            className="text-capitalize text-decoration-none">
                                {blog.title}
                            </Link>
                        </p>

                        <p className="card-text text-capitalize">
                            <small className="text-muted">
                                By:
                                    {
                                    typeof(blog.user) !== 'string' &&
                                    <Link to={`/profile/${blog.user._id}`}>
                                        {blog.user.name}
                                    </Link>
                                    }
                            </small>

                            <small className="text-muted ms-5">
                                {new Date(blog.createdAt).toDateString()}
                            </small>
                        </p>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchCard;