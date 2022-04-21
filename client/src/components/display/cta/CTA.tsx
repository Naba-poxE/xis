import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { postEmail } from '../../../redux/actions/subscriberAction';
import './cta.css'

const CTA = () => {


    const dispatch = useDispatch()
    const [email,setEmail] = useState('')

    const handleSumbit = () => {
        dispatch(postEmail(email))
        setEmail('')
    }

    return(
        <div className="home__cta neomorphism">
            <div className="home__cta-content">
                <p>Subscribe to Get Access to the great</p>
                <h3>Subscribe & get all the Latest and Greatest posts from us</h3>
            </div>
            <div className="home__cta-container">
                <input type='email' name='email' value={email} onChange={(e) => setEmail(e.target.value) } placeholder='Enter you email...' />
                <button type="button" onClick={() => handleSumbit()}>
                    Subscribe
                </button>
            </div>
        </div>
    )
}

export default CTA;