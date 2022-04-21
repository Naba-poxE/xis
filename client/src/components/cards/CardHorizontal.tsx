import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { countView } from "../../redux/actions/blogActions";
import { IBlog } from '../../utils/TypeScript';


interface IProps {
    blog: IBlog
}

const CardHorizontal: React.FC<IProps> = ({blog}) => {

    const dispatch = useDispatch()

    return (
        <div className="card mb-3 bg-white card__none scale_card" style={{maxWidth: "840px", borderRadius: '15px'}}>
            <div className="row g-0 p-2">
                <div className="col-md-4" style={{
                    minHeight: '150px', maxHeight: '170px', overflow: 'hidden'
                }}>
                {
                    blog.thumbnail && 
                    <>
                    {
                        typeof(blog.thumbnail) === 'string'
                        ? <Link onClick={() => dispatch(countView(blog._id))} to={`/blog/${blog._id}`}>
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
                            <Link onClick={() => dispatch(countView(blog._id))} to={`/blog/${blog._id}`}
                            className="text-capitalize">
                                {blog.title}
                            </Link>
                        </h5>
                        <p className="card-text">{`${blog.description.slice(0,100)}...`}</p>
                        {   
                            blog.title && 
                                <div className="card-text"> 
                                By:<small>
                                    {
                                        typeof(blog.user) !== 'string' &&
                                            <Link className='username' to={`/profile/${blog.user._id}`}>
                                                {blog.user.name}
                                            </Link>
                                    }
                                    </small>
                                    <small className='ms-5'>{new Date().getMonth() - new Date(blog.createdAt).getMonth()} months ago</small>
                                </div>
                        }
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardHorizontal;