import { useState } from "react";
import { useDispatch } from "react-redux";
import { InputChange,FormSubmit } from "../../utils/TypeScript";
import { register } from "../../redux/actions/authActions";


const RegisterForm = () => {
    const initialState = { name:'', email:'', password:'', cf_password:'' }
    const [ userRegister,setUserRegister ] = useState(initialState)
    const { name, email, password, cf_password } = userRegister

    const [typePass, setTypePass] = useState(false)
    const [typeCfPass, setTypeCfPass] = useState(false)

    const dispatch = useDispatch()

    const handleChangeInput = (e:InputChange) => {
        const { name,value } = e.target
        setUserRegister({...userRegister, [name]:value})
    }

    const handleSubmit = (e: FormSubmit) => {
        e.preventDefault()
        dispatch(register(userRegister))
    }

    return (
        <form onSubmit={handleSubmit}> 

            <div className="form-group mb-3">
                <label htmlFor="name" className="form-label text-dark">Name</label>
                <input 
                    type="text" 
                    id="name" 
                    className="form-control"
                    name="name" value={name} 
                    placeholder="ex.David"
                    onChange={handleChangeInput} />
            </div>

            <div className="form-group mb-3">
                <label htmlFor="email" className="form-label text-dark">Email</label>
                <input 
                    type="text" 
                    id="email" 
                    className="form-control"
                    name="email" value={email} 
                    placeholder="ex.example@gmail.com"
                    onChange={handleChangeInput} />
            </div>

            <div className="form-group mb-3">
                <label htmlFor="password" className="form-label text-dark">Password</label>
                <div className="pass">
                    <input 
                        type={ typePass ? "text" : "password"}
                        id="password" 
                        className="form-control" 
                        name="password" value={password}
                        placeholder="Your password must be 6 chars"  
                        onChange={handleChangeInput} />

                    <small onClick={() => setTypePass(!typePass)}>
                        {typePass ? "Hide" : "Show"}
                    </small>    
                </div>
            </div>

            <div className="form-group mb-3">
                <label htmlFor="cf_password" className="form-label text-dark">Confirm Password</label>
                <div className="pass">
                    <input 
                        type={ typeCfPass ? "text" : "password"}
                        id="cf_password" 
                        className="form-control" 
                        name="cf_password" value={cf_password}
                        placeholder="Your password must be 6 chars" 
                        onChange={handleChangeInput} />

                    <small onClick={() => setTypeCfPass(!typeCfPass)}>
                        {typeCfPass ? "Hide" : "Show"}
                    </small>    
                </div>
            </div>

            <button type="submit" className="btn btn-dark w-100 my-1" disabled= {(name && email && password && cf_password) ? false : true}>
                Register
            </button>
        </form>
    )
}

export default RegisterForm;