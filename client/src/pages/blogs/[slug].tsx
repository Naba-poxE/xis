import { useState,useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { RootStore,IParams, IBlog } from "../../utils/TypeScript";
import { getBlogsByCategoryId } from "../../redux/actions/blogActions";
import Loading from "../../components/global/Loading";
import Pagination from "../../components/global/Pagination";
import CardVert from "../../components/cards/CardVert";


const BlogsByCategory = () => {
    const { categories,blogsCategory } = useSelector((state: RootStore) => state)
    const dispatch = useDispatch()
    const { slug } =  useParams<IParams>()
    
    const history = useHistory()
    const { search } = history.location
    
    const [ categoryId,setCategoryId ] = useState('')
    const [ categoryName,setCategoryName ] = useState('')
    const [ blogs,setBlogs ] = useState<IBlog[]>()
    const [ total,setTotal ] = useState(0)

    useEffect(() => {
        const category = categories.find(element => element.name === slug )  //find gets the very first elemet which satifies the given condition....

        if(category){
            setCategoryId(category._id) 
            setCategoryName(category?.name)
        } 

    },[slug,categories])

    useEffect(() => {
        if(!categoryId) return;

        if(blogsCategory.every(item => item.id !== categoryId)) {
            dispatch(getBlogsByCategoryId(categoryId, search))
        }else {
            const data = blogsCategory.find(element => element.id === categoryId)
            if(!data) return;

            setBlogs(data.blogs)
            setTotal(data.total)

            if(data.search) history.push(data.search) //the search came when we put the search on blogsType.ts
        }
            
    },[categoryId, blogsCategory, dispatch, search, history])

    const handlePagination = (num: number) => {
        const search = `?page=${num}`
        dispatch(getBlogsByCategoryId(categoryId, search))
    }

    if(!blogs) return <Loading/>
    return (
        <div className="container">
            <h1 className="text-center text-capitalize text-secondary mb-5">{categoryName}</h1>
            <div className="show_blogs">
                {
                    blogs.map(blog => (
                        <CardVert key={blog._id} blog={blog} />
                    ))
                }
            </div>
            {
                total > 1 && 
                <Pagination total={total} callback={handlePagination} />
            }
           
        </div>
    )
}

export default BlogsByCategory;