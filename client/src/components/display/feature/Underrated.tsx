import { useEffect, useState } from 'react';
import { getAPI } from '../../../utils/FetchDatas';
import { IBlog } from '../../../utils/TypeScript';
import CardHorizontal from '../../cards/CardHorizontal';
import './feature.css'



const Underrated = () => {

    const [ blogs,setBlogs ] = useState<IBlog[]>([])

    useEffect(() => {
        getAPI('underrated')
        .then(res => setBlogs(res.data))
    },[])

    return(
        <div className='mt-5'>
            <h1 style={{fontWeight: 500}}>You May Like</h1>
            {
                blogs.map(blog => (
                    <CardHorizontal key={blog._id} blog={blog} />
                ))
            }
        </div>
        
    )
}


export default Underrated;