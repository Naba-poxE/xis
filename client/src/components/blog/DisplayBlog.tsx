import React,{ useEffect, useState } from "react";
import { IBlog, RootStore } from "../../utils/TypeScript";
import { useDispatch, useSelector } from "react-redux";
import { Link,useHistory } from "react-router-dom";
import Pagination from "../global/Pagination";
import { getBlogsByCategoryId } from '../../redux/actions/blogActions'
import CardHorizontal from "../cards/CardHorizontal";
import HrBanner from "../global/HrBanner";

import '../display/hero/hero.css'

interface IProps {
    blog: IBlog
}

const DisplayBlog: React.FC<IProps> = ({blog}) => {

    const { blogsCategory} = useSelector((state: RootStore) => state)
    const dispatch = useDispatch()

    const history = useHistory()
    const { search } = history.location

    const [ blogs,setBlogs ] = useState<IBlog[]>()
    const [ total,setTotal ] = useState(0)

    useEffect(() => {
        if(!blog.category) return;

        if(blogsCategory.every(item => item.id !== blog.category)) {
            dispatch(getBlogsByCategoryId(blog.category, search))
        }else {
            const data = blogsCategory.find(element => element.id === blog.category)
            if(!data) return;

            setBlogs(data.blogs)
            setTotal(data.total)

            if(data.search) history.push(data.search) //the search came when we put the search on blogsType.ts
        }
            
    },[ blogsCategory,blog.category, dispatch, search, history])

    const handlePaginationRelated = (num: number) => {
        const search = `?page=${num}`
        dispatch(getBlogsByCategoryId(blog.category, search))
    }

    const handleShare = (url:string) => {
        const currentURL = encodeURI(window.location.href);
        const throwURL = url + currentURL
        window.open(throwURL);
    }

    return(
        <>
            <div className="card">
            </div>
            <div className="container">
                <div className="">
                    <div style={{maxWidth: '48rem',marginLeft: 'auto',marginTop:'2rem', marginRight:'auto'}}>
                            <h1 className="text-capitalize fs-1">
                                {blog.title}
                            </h1>
                            <p className="lead text-capitalize">
                                {blog.description}
                            </p>
                            <div className="d-flex flex-column">
                                <div className="d-flex">
                                By: {
                                        typeof (blog.user) !== 'string' &&
                                        <Link to={`/profile/${blog.user._id}`}>
                                            <p>{blog.user.name}</p>
                                        </Link>
                                    }
                                    <p className="ms-4">{new Date().toDateString()}</p>
                                </div>
                                <div className="d-flex" style={{fontSize: '20px', cursor: 'pointer'}}>
                                    <p onClick={() => handleShare("https://www.facebook.com/sharer/sharer.php?u=")} className="me-3"><i className="fab fa-brands fa-facebook" /></p>
                                    <p onClick={() => handleShare("https://twitter.com/intent/tweet?text=")}  className="mx-3"><i className="fab fa-brands fa-twitter-square" /></p>
                                    <p onClick={() => handleShare("https://www.linkedin.com/sharing/share-offsite/?url=")} className="mx-3"><i className="fab fa-brands fa-linkedin" /></p>
                                </div>
                            </div>
                        {
                            typeof(blog.thumbnail) === 'string' &&
                            <img src={blog.thumbnail} className="card-img display__img" alt="blog-thumbnail" />
                        }
                        <div className="display__content mt-4" style={{fontSize: '1.25rem'}}  dangerouslySetInnerHTML={{
                            __html: blog.content
                        }} />
                    </div>
                </div>
                <HrBanner />

                <div className="mt-5">
                    <h1 style={{fontWeight: 500}}>Related Posts</h1>
                    {
                        blogs?.map(blog => (
                            <CardHorizontal key={blog._id} blog={blog} />
                        ))
                    }
                </div>
                {
                    total > 1 && 
                    <Pagination total={total} callback={handlePaginationRelated} />
                }
            </div>
        </>
    )
}

export default DisplayBlog;