import { useDispatch, useSelector } from "react-redux";
import { countView } from "../../../redux/actions/blogActions";
import { Link } from "react-router-dom";
import { RootStore } from "../../../utils/TypeScript";
import './hero.css';
import Feature from "../feature/Trending"
import React from "react";


const Hero = () => {

    const { homeBlogs } = useSelector((state: RootStore) => state)

    const dispatch = useDispatch()
    
    return(
        // <div className='home'>  
        //     {
        //         homeBlogs.slice(0,1).map(homeBlog => (
        //             homeBlog.blogs.slice(0,1).map((blog,index) => (
        //                 <div key={index} className="home__container">
        //                     {
        //                         typeof(blog.thumbnail) === 'string' &&
        //                         <img src={blog.thumbnail} alt="ai"/>
        //                     }
        //                     <div className="home__container-content">
        //                         <Link className="scale_button" to={`/blogs/${homeBlog.name}`}>
        //                             <button>{homeBlog.name}</button>
        //                         </Link>
        //                         <Link onClick={() => dispatch(countView(blog._id))} to={`/blog/${blog._id}`}> 
        //                             <h1 className="text-white">
        //                                 {blog.title}
        //                             </h1>
        //                         </Link>  
        //                             <p>{blog.description.slice(0,200) + "..."}</p>  

        //                         <div  className="text-white">
        //                             <small>{new Date().getMonth() - new Date(blog.createdAt).getMonth()} months ago</small>
        //                             <small className="mx-4">{blog.views} views</small>
        //                         </div>
        //                     </div> 
        //                     <Feature />
        //                 </div>    
        //             ))
        //         )) 
        //     }   
        // </div>
        
        <div className="card hero__card">
            {
                homeBlogs.slice(0,1).map(homeBlog => (
                    homeBlog.blogs.slice(0,1).map(blog => (
                        <React.Fragment key={blog._id}>
                            {
                                typeof(blog.thumbnail) === 'string' &&
                                <img className="card-img" src={blog.thumbnail} alt="thumbnail" 
                                style={{height: '100%', objectFit: 'cover'}}/>
                            }
                            
                            <div className="card-img-overlay p-0 d-flex flex-column justify-content-between" style={{background: 'linear-gradient(to right,rgba(0,0,0,0.4),rgba(0,0,0,0.3))'}}>
                                <div className="hero__container-content">
                                    <Link className="scale_button" to={`/blogs/${homeBlog.name}`}>
                                        <button>{homeBlog.name}</button>
                                    </Link>
                                    <Link onClick={() => dispatch(countView(blog._id))} to={`/blog/${blog._id}`}> 
                                        <h1 className="text-white">
                                            {blog.title}
                                        </h1>
                                    </Link>  
                                        <p>{blog.description.slice(0,200) + "..."}</p>  

                                    <div  className="text-white">
                                        <small>{new Date().getMonth() - new Date(blog.createdAt).getMonth()} months ago</small>
                                        <small className="mx-4">{blog.views} views</small>
                                    </div>
                                </div> 
                                <Feature />
                            </div>
                        </React.Fragment>
                    ))
                ))
            }
        </div>
    )
}

export default Hero;