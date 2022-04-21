import { useEffect, useState } from "react";
import { IHomeBlogs } from "../../../redux/types/blogType";
import { getAPI } from "../../../utils/FetchDatas";
import CardOverlay from "../../cards/CardOverlay";


const Popular = () => {

    const [ editorBlogs,setEditorBlogs ] = useState<IHomeBlogs[]>([])

    useEffect(() => {
        getAPI('popular')
            .then(res => setEditorBlogs(res.data))
            .catch(err => console.log(err))       
    },[setEditorBlogs])

    return ( 
        <div className="mt-5">
            <h1 style={{fontWeight: 500}}>
                Most Popular
            </h1>
            <div className="mb-5">
                <div className="home_blogs-list">
                    {
                        editorBlogs.slice(0,2).map(editorBlog => (
                        
                            editorBlog.blogs.map(blog => (
                                <CardOverlay key={blog._id} category={editorBlog.name} blog={blog} />   
                            ))
                            
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Popular;