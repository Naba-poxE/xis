import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "../../utils/TypeScript";
import { Link } from "react-router-dom";
import { countView } from "../../redux/actions/blogActions";



const CardGrid = () => {

    const { homeBlogs } = useSelector((state: RootStore) => state)

    const dispatch = useDispatch()

    return(
        <>
            {
                homeBlogs.slice(2,4).map(homeBlog => (
                    homeBlog.blogs.slice(0,4).map(blog => (
                        <div key={blog._id} className="card border-0 bg-transparent">
                            <Link onClick={() => dispatch(countView(blog._id))} to={`/blog/${blog._id}`}>
                                    {
                                        typeof (blog.thumbnail) === "string" &&
                                        
                                            <img src={blog.thumbnail} className="card-img" alt="thumbnail"
                                            style={{height: '280px', objectFit: 'cover'}}/>
                                        
                                    }
                                    <div className="card-img-overlay text-light text__overlay">
                                        <Link className="scale_button" to={`/blogs/${homeBlog.name}`}>
                                            <button className="card-title button__overlay">{homeBlog.name}</button>
                                        </Link>
                                        <h3 className="card-title text-capitalize">{blog.title}</h3>
                                        <p className="card-text">{new Date().getMonth() - new Date(blog.createdAt).getMonth()} months ago</p>
                                    </div>
                            </Link>
                        </div>
                    ))
                ))
            }
        </>
    )
}

export default CardGrid;