import React from 'react';
import { useDispatch } from 'react-redux';
import { countView } from '../../../redux/actions/blogActions';
import { Link } from 'react-router-dom';
import './feature.css'

interface IProps {
    id?: string
    title: string
    description: string
}

const FeatureList: React.FC<IProps> = ({id,title,description}) => {

    const dispatch = useDispatch()

    return(
        <div className="home__features-container_feature">
            <div className="home__features-container_feature-title">
                <div />
                <h1>
                   <Link onClick={() => dispatch(countView(id))} className='text-white' to={`/blog/${id}`}>
                        {title}
                   </Link> 
                </h1>
            </div>
            <div className="home__features-container_feature-text">
                <p>{`${description.slice(0,100)}...`}</p>
            </div>
        </div>
    )
}

export default FeatureList;