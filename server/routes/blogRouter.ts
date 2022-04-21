import { Router } from "express";
import blogCtrl from "../controllers/blogCtrl";
import auth from '../middleware/auth'


const router = Router()

router.post('/blog', auth, blogCtrl.createBlog)

router.get('/home/blogs', blogCtrl.getHomeBlogs)

router.get('/blogs/category/:id', blogCtrl.getBlogsByCategory)

router.get('/blogs/user/:id', blogCtrl.getBlogsByUser)

router.route('/blog/:id')
      .get(blogCtrl.getBlog)
      .put(auth, blogCtrl.updateBlog)
      .delete(auth, blogCtrl.deleteBlog)

router.patch('/count_view/:id', blogCtrl.countView)

router.get('/search/blogs', blogCtrl.searchBlogs)  

router.get('/trending',blogCtrl.getTrendingBlogs)

router.get('/popular',blogCtrl.getBlogsByViews)

router.get('/underrated',blogCtrl.getUnderratedBlogs)



export default router;