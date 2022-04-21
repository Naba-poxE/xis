import { Link } from 'react-router-dom'
import Search from './Search'
import Menu from './Menu'

const Header = () => {

  return (
    <nav className="navbar navbar_glass navbar-expand-lg p-2 border-bottom"
         style={{position: 'sticky', top:0, left:0, zIndex:9}}>
            <div className="container-fluid">
              <Link className="navbar-brand me-5" to="/">TIPSAZA</Link>
                <button className="navbar-toggler navbar-light" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <Menu />
                    <form className="ms-lg-auto" style={{maxWidth:'25rem',width:'100%'}}>
                       <Search />
                    </form>
                </div>
            </div>
        </nav>
  )
}

export default Header