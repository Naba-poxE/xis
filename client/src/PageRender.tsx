import React from 'react';
import { useParams } from "react-router-dom";
import { IParams } from "./utils/TypeScript";
import NotFound from './components/global/NotFound';


const generatePage = (name:any) => {
    const component = () => require(`./pages/${name}`).default //takes 'name from PageRender and the search for the path 
                                                               //like './pages/register if found try block if not catch block
    try {
        return React.createElement(component())
    } catch (err) {
        return <NotFound />
    }
}

const PageRender = () => {

    const { page,slug } : IParams = useParams()

    let name = '';

    if(page) {
        name = slug ? `${page}/[slug]` : `${page}` // `${page}/[slug]` here the [slug] actually represents the [slug] named files like slug.tsx
    }                                              //and page represents the name of the folder that stores tha [slug] 
                                                   //so everything that has [slug] has a folder that represents the page in url
    return generatePage(name)
}

export default PageRender;