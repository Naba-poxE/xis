import { Link } from "react-router-dom";

const Footer = () => {
    return(
        <div className="home__container-lowercontent_footer">
            {/* <img src="/logowhite.svg" alt="logo"/> */}
            <h1>Tipsaza</h1>
            <div className="text-center">
                <p> 
                    <Link to='/about'>About</Link> | <Link to='#'>Contact</Link> | <Link to='/blogs/tips'>Tips</Link> | <Link to=''>Sitemap</Link> 
                </p>
                <small>© 2022 Tipsaza® All rights reserved.</small>
            </div>
             <div className="d-flex" style={{fontSize: '20px', cursor: 'pointer'}}>
                <p className="me-3"><i className="fab fa-brands fa-facebook" /></p>
                <p className="mx-3"><i className="fab fa-brands fa-twitter-square" /></p>
                <p className="mx-3"><i className="fab fa-brands fa-linkedin" /></p>
            </div>
        </div> 
    )
}

export default Footer;