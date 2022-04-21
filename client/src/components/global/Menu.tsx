import { useSelector,useDispatch } from 'react-redux'
import { Link,useLocation } from 'react-router-dom'
import { RootStore } from '../../utils/TypeScript'
import { logout } from '../../redux/actions/authActions'


const Menu = () => {
  const { auth,categories } = useSelector((state: RootStore) => state)

  const { pathname } = useLocation()

  const dispatch = useDispatch()

  const isActive = (pn: string) => {
    if(pn === pathname) return 'activated'
    
  }

  const handleLogout = () => {
    if(!auth.user || !auth.access_token) return;
    dispatch(logout(auth.access_token))
  }

  return (
      // <ul className="navbar-nav mt-0 ms-lg-4">
      <ul className='navbar-nav mb-2 mb-lg-0 navbar-brand'>
        {
          categories.map(label => (
            <li key={label._id} className={`nav-item ${isActive(`/blogs/${label.name}`)} mx-2`}>
              <Link className="nav-link m-2 p-0 text-capitalize text-dark" to={`/blogs/${label.name}`}>{label.name}</Link>
            </li>
          ))
        }
    
        {
          auth.user && 
          <li className="nav-item dropdown">
            <span className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <img src={auth.user.avatar} alt="avatar" className="avatar" />
            </span>

            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              { 
                auth.user.role !== 'user' &&
                  <li>
                    <Link className="dropdown-item" to={`/create_blog`}>CreateBlog</Link>
                    <hr className="dropdown-divider" />
                  </li>
              }

              {
                auth.user?.role === "admin" &&
                <>
                  <li>
                    <Link className="dropdown-item" to="/jury_members_register">Register Writer</Link>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/category">Category</Link>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link className='dropdown-item' to={`/users`}>
                      Writers
                    </Link>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/subscription">Subscribers</Link>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link className='dropdown-item' to={'/views'}>
                      Blogs
                    </Link>
                    <hr className="dropdown-divider" />
                  </li>
                </>
              }
              
              <li>
                <Link className="dropdown-item" to={`/profile/${auth.user._id}`}>
                  Profile
                </Link>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <Link className="dropdown-item" to="/" onClick={handleLogout} >
                  Logout
                </Link>
              </li>
            </ul>
          </li>
        }
      </ul>

 
  )
}

export default Menu;
