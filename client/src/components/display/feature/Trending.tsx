import { useEffect, useState } from 'react';
import { getAPI } from '../../../utils/FetchDatas';
import { IBlog } from '../../../utils/TypeScript';
import './feature.css'
import FeatureList from './FeatureList';


const Feature = () => {

    const [blogs,setBlogs] = useState<IBlog[]>([])

    useEffect(() => {
        getAPI('trending')
            .then(res => setBlogs(res.data))
            .catch(err => console.log(err.response.data.msg))
    },[])

    return(
        <div className="home__feature">
            <div className="home__feature-heading">
                <h1 className='text-white'>Trending Subjects</h1>
            </div>
            <div className="home__feature-container">
                {
                   blogs.map(blog => (
                        <FeatureList key={blog._id} id={blog._id} title={blog.title} description={blog.description}/>
                   ))
                }
            </div>
        </div>
    )
}

export default Feature;