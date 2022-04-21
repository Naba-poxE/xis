"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blogCtrl_1 = __importDefault(require("../controllers/blogCtrl"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = (0, express_1.Router)();
router.post('/blog', auth_1.default, blogCtrl_1.default.createBlog);
router.get('/home/blogs', blogCtrl_1.default.getHomeBlogs);
router.get('/blogs/category/:id', blogCtrl_1.default.getBlogsByCategory);
router.get('/blogs/user/:id', blogCtrl_1.default.getBlogsByUser);
router.route('/blog/:id')
    .get(blogCtrl_1.default.getBlog)
    .put(auth_1.default, blogCtrl_1.default.updateBlog)
    .delete(auth_1.default, blogCtrl_1.default.deleteBlog);
router.patch('/count_view/:id', blogCtrl_1.default.countView);
router.get('/search/blogs', blogCtrl_1.default.searchBlogs);
router.get('/trending', blogCtrl_1.default.getTrendingBlogs);
router.get('/popular', blogCtrl_1.default.getBlogsByViews);
router.get('/underrated', blogCtrl_1.default.getUnderratedBlogs);
exports.default = router;
