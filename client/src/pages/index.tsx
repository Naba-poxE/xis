import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootStore } from "../utils/TypeScript";
import CardVert from "../components/cards/CardVert";
import Loading from '../components/global/Loading';
import Hero from "../components/display/hero/Hero";
import CTA from '../components/display/cta/CTA';
import Underrated from "../components/display/feature/Underrated";
import CardGrid from "../components/cards/CardGrid";
import Popular from "../components/display/feature/Popular";


const Home = () => {
    const { homeBlogs } = useSelector((state: RootStore) => state)


    if(homeBlogs.length === 0) return <Loading/>
    return(
        <>
        <Hero />
        <div className="container">
            {
                homeBlogs.slice(0,2).map(homeBlog => (
                    <div key={homeBlog._id}>
                        {
                            homeBlog.count > 0 && 
                            <>
                                <h2 className="text-capitalize">
                                    <Link to={ `/blogs/${(homeBlog.name).toLowerCase()}` }>
                                        { homeBlog.name } <small>({ homeBlog.count })</small>
                                    </Link>
                                </h2>
                
                                <div className="home_blogs-vert">
                                {
                                    homeBlog.blogs.slice(0,4).map(blog => (
                                    <CardVert key={blog._id} blog={blog} />
                                    ))
                                }
                                </div>
                          </>
                        
                        }
                        {
                            homeBlog.count > 4 && 
                                <Link className="d-block text-end" style={{color: '#0077CC'}}
                                to={`/blogs/${homeBlog.name}`}>
                                    More on {homeBlog.name} --&gt;
                                </Link>
                        }

                    </div>
                ))  
            }
            <Popular />
            <h1 style={{fontWeight: 500}}>Pro Topics</h1>
            <div className="home_blogs-vert mb-5">
                <CardGrid />
            </div>
            <Underrated/>
        </div>
        <CTA />
        </>
    )
}

export default Home;