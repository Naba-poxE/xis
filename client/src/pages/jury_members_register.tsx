import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm'
import NotFound from '../components/global/NotFound';
import { RootStore } from '../utils/TypeScript';

const Register = () => {

  const { auth } = useSelector((state : RootStore) => state)
  const history = useHistory()

  useEffect(() => {
    if( auth.access_token && auth.user?.role !== 'admin') {
      let url = history.location.search.replace('?','/')
      history.push(url)
    }
  },[auth.access_token,auth.user?.role,history])

  if(auth.user?.role !== 'admin') return <NotFound/> 
  return (
    <div className="auth_page">
      <div className="auth_box neomorphism">
        <h3 className="text-uppercase text-center mb-4 fw-bold">Register</h3>
        <RegisterForm />
      </div>
    </div>
  )
}

export default Register