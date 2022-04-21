import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { IBlog } from "../../utils/TypeScript";
import { countView } from '../../redux/actions/blogActions'



interface IProps {
    blog: IBlog
    category: string
}

const CardOverlay: React.FC<IProps> = ({blog,category}) => {

    const dispatch = useDispatch()

    return(
        <div className="card border-0 bg-transparent">
            <Link onClick={() => dispatch(countView(blog._id))} to={`/blog/${blog._id}`}>
                <div className="scale_image">
                    {
                        typeof (blog.thumbnail) === "string" &&
                        
                            <img src={blog.thumbnail} className="card-img" alt="thumbnail"
                            style={{height: '280px', objectFit: 'cover'}}/>
                        
                    }
                    <div className="card-img-overlay">
                        <Link className="scale_button" to={`/blogs/${category}`}>
                            <button className="card-title button__overlay">{category}</button>
                        </Link>
                    </div>
                </div>
            </Link>
            <h3 className="text-capitalize">{blog.title}</h3>
        </div>
    )
}

export default CardOverlay;