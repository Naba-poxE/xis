import { useState,useEffect } from 'react'
import { getAPI } from '../../utils/FetchDatas';
import { IBlog } from '../../utils/TypeScript';
import { useLocation } from 'react-router-dom';
import SearchCard from '../cards/SearchCard';

const Search = () => {
  const [search, setSearch] = useState('')
  const [blogs, setBlogs] = useState<IBlog[]>([])

  const { pathname } = useLocation()

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if(search.length < 2) return setBlogs([]); 

      try {
        const res = await getAPI(`search/blogs?title=${search}`)
        setBlogs(res.data)

      } catch (err) {
          console.log(err)
      } 
    },400)

    return () => clearTimeout(delayDebounce)

  },[search])

  useEffect(() => {
    setSearch('')
    setBlogs([])
  },[pathname])

  return (
    <div className="search position-relative">
      <input type="text" className="form-control bg-transparent border border-dark w-100"
      value={search} placeholder="Enter your search..."
      onChange={e => setSearch(e.target.value)}  />

      {
        search.length >= 2 &&
        <div className="position-absolute pt-2 px-1 w-100 rounded" 
        style={{background:'#F2F6FF', zIndex: 10,
                maxHeight:'calc(100vh - 100px)', overflow:'auto'}}>
            {
              blogs.length 
              ? blogs.map(blog => (
                <SearchCard key={blog._id} blog={blog} />
              ))
              : <h3 className="text-center text-dark">Looks like no result found for your search</h3>
            }
        </div>
      }
    </div>
  )
}

export default Search
