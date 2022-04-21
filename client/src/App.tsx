import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from './components/global/Header';
import PageRender from './PageRender';
import { Alert } from './components/alert/Alert';
import { refreshToken } from './redux/actions/authActions';
import { getCategories } from './redux/actions/categoryActions';
import { getHomeBlogs } from './redux/actions/blogActions';

import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import Footer from './components/global/Footer';

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(refreshToken())
    dispatch(getCategories())
    dispatch(getHomeBlogs())
  },[dispatch])
  
  return (
    <>
        <Router>
          <Alert/>
          <Header/>

          <Switch>
            <Route exact path='/' component={PageRender}/>
            <Route exact path='/:page' component={PageRender}/>
            <Route exact path='/:page/:slug' component={PageRender}/>
          </Switch>

          <Footer/>
        </Router>
    </>
  );
}

export default App;
