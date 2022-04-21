import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { countView } from "../../redux/actions/blogActions";
import { IBlog } from "../../utils/TypeScript";

interface IProps {
    blog: IBlog
}

const CardVert: React.FC<IProps> = ({ blog }) => {


    const dispatch = useDispatch()

    return(
        <div className="card card__none scale_card bg-white" style={{borderRadius: '15px'}}>
            {
                typeof(blog.thumbnail) === 'string' &&
                <Link onClick={() => dispatch(countView(blog._id))} to={`/blog/${blog._id}`}>
                    <img src={blog.thumbnail} className="card-img-top " alt="..."
                        style={{height: '200px', objectFit: 'cover'}} />
                </Link>
            }
            <div className="card-body text-capitalize">
                <li>
                    {new Date(blog.createdAt).toDateString()}
                </li>
                <h5 className="card-title fs-4">
                    <Link onClick={() => dispatch(countView(blog._id))} to={`/blog/${blog._id}`}>
                        {blog.title}
                    </Link>
                </h5>
                <p className="card-text">
                    {blog.description.slice(0,70) + "..."}
                </p>
                <span className="card-text">
                    <small className="text-secondary">
                    By: 
                        {
                        typeof(blog.user) !== 'string' &&
                        <Link className="username" to={`/profile/${blog.user._id}`}>
                           {blog.user.name}
                        </Link>
                        }
                    </small>
                </span>
            </div>
        </div>
    )
}

export default CardVert;