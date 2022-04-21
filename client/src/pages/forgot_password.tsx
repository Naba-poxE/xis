import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../redux/actions/authActions';
import { FormSubmit } from '../utils/TypeScript';


const ForgotPassword = () => {

    const [email,setEmail] = useState('')

    const dispatch = useDispatch()

    const handleSend = (e: FormSubmit) => {
        e.preventDefault()
        dispatch(forgotPassword(email))
    }

    return(
        <div className="container my-4" style={{maxWidth:'500px'}}>
            <h2>Forgot Password?</h2>
            <p className='text-secondary'>Please confirm your email address in order to reset your password</p>

            <form className="form-group" onSubmit={handleSend}>
                <label htmlFor="email">Email:</label>

                <div className="d-flex align-items-center">
                    <input 
                        id="email" type="email" 
                        className="form-control" 
                        name="email" 
                        onChange={(e) => setEmail(e.target.value)}/>

                    <button type="submit" className="btn btn-primary mx-2 d-flex align-items-center">
                        <i className="fas fa-paper-plane me-2" /> Send
                    </button>
                </div>

            </form>
        </div>
    )
}

export default ForgotPassword;