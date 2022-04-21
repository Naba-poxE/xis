"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const blogModel_1 = __importDefault(require("../models/blogModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const Pagination = (req) => {
    let page = Number(req.query.page) * 1 || 1;
    let limit = Number(req.query.limit) * 1 || 4;
    let skip = (page - 1) * limit;
    return { page, limit, skip };
};
const blogCtrl = {
    createBlog: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Invalid Authentication!" });
        try {
            const { title, content, description, thumbnail, category } = req.body;
            const newBlog = new blogModel_1.default({
                user: req.user._id,
                title: title.toLowerCase(),
                content,
                description,
                thumbnail,
                category
            });
            yield newBlog.save();
            res.json(Object.assign(Object.assign({}, newBlog._doc), { user: req.user }));
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }),
    getHomeBlogs: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const blogs = yield blogModel_1.default.aggregate([
                //User //taking the id of 'user' and getting all the props of 'user' from that id
                {
                    $lookup: {
                        from: "users",
                        let: { user_id: "$user" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                            { $project: { password: 0 } } //hides the 'password' props 
                        ],
                        as: "user"
                    }
                },
                //array --> object
                { $unwind: "$user" },
                //Category //taking the id of 'category' and getting all the props of 'category' from that id
                {
                    $lookup: {
                        "from": "categories",
                        "localField": "category",
                        "foreignField": "_id",
                        "as": "category"
                    }
                },
                { $unwind: "$category" },
                //Sorting with new blog at first
                { $sort: { "createdAt": -1 } },
                //Group by category
                {
                    $group: {
                        _id: "$category._id",
                        name: { $first: "$category.name" },
                        blogs: { $push: "$$ROOT" },
                        count: { $sum: 1 }
                    }
                },
            ]);
            res.json(blogs);
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }),
    getBlogsByCategory: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { limit, skip } = Pagination(req);
        try {
            const Data = yield blogModel_1.default.aggregate([
                {
                    $facet: {
                        totalData: [
                            { $match: {
                                    category: mongoose_1.default.Types.ObjectId(req.params.id)
                                }
                            },
                            // User
                            {
                                $lookup: {
                                    from: "users",
                                    let: { user_id: "$user" },
                                    pipeline: [
                                        { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                                        { $project: { password: 0 } }
                                    ],
                                    as: "user"
                                }
                            },
                            // array -> object
                            { $unwind: "$user" },
                            // Sorting
                            { $sort: { createdAt: -1 } },
                            { $skip: skip },
                            { $limit: limit }
                        ],
                        totalCount: [
                            { $match: {
                                    category: mongoose_1.default.Types.ObjectId(req.params.id)
                                }
                            },
                            { $count: "count" }
                        ]
                    }
                },
                {
                    $project: {
                        count: { $arrayElemAt: ["$totalCount.count", 0] },
                        totalData: 1
                    }
                }
            ]);
            const blogs = Data[0].totalData;
            const count = Data[0].count;
            //Pagination
            let total = 0;
            if (count % limit === 0) {
                total = count / limit;
            }
            else {
                total = Math.floor(count / limit) + 1; //floor rouds the real value and gives the integer value
            }
            res.json({ blogs, total });
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }),
    getBlogsByUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { limit, skip } = Pagination(req);
        try {
            const Data = yield blogModel_1.default.aggregate([
                {
                    $facet: {
                        totalData: [
                            { $match: {
                                    user: mongoose_1.default.Types.ObjectId(req.params.id)
                                }
                            },
                            // User
                            {
                                $lookup: {
                                    from: "users",
                                    let: { user_id: "$user" },
                                    pipeline: [
                                        { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                                        { $project: { password: 0 } }
                                    ],
                                    as: "user"
                                }
                            },
                            // array -> object
                            { $unwind: "$user" },
                            // Sorting
                            { $sort: { createdAt: -1 } },
                            { $skip: skip },
                            { $limit: limit }
                        ],
                        totalCount: [
                            { $match: {
                                    user: mongoose_1.default.Types.ObjectId(req.params.id)
                                }
                            },
                            { $count: "count" }
                        ]
                    }
                },
                {
                    $project: {
                        count: { $arrayElemAt: ["$totalCount.count", 0] },
                        totalData: 1
                    }
                }
            ]);
            const blogs = Data[0].totalData;
            const count = Data[0].count;
            //Pagination
            let total = 0;
            if (count % limit === 0) {
                total = count / limit;
            }
            else {
                total = Math.floor(count / limit) + 1; //floor rouds the real value and gives the integer value
            }
            res.json({ blogs, total });
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }),
    getBlog: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const blog = yield blogModel_1.default.findOne({ _id: req.params.id }).populate("user", "-password");
            if (!blog)
                return res.status(400).json({ msg: "Blog does not exist." });
            return res.json(blog);
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }),
    getTrendingBlogs: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const blog = yield blogModel_1.default.find().sort({ createdAt: -1, views: -1, }).limit(4);
            return res.json(blog);
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }),
    getBlogsByViews: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const blogs = yield blogModel_1.default.aggregate([
                {
                    $lookup: {
                        "from": "categories",
                        "localField": "category",
                        "foreignField": "_id",
                        "as": "category"
                    }
                },
                { $unwind: "$category" },
                { $sort: { "views": -1 } },
                { $limit: 6 },
                {
                    $group: {
                        _id: "$category._id",
                        name: { $first: "$category.name" },
                        blogs: { $push: "$$ROOT" },
                        count: { $sum: 1 }
                    }
                }
            ]);
            res.json(blogs);
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }),
    getUnderratedBlogs: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const blog = yield blogModel_1.default.aggregate([
                {
                    $lookup: {
                        from: "users",
                        let: { user_id: "$user" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                            { $project: { password: 0 } }
                        ],
                        as: "user"
                    }
                },
                { $unwind: "$user" },
                { $sort: { createdAt: 1 } },
                { $limit: 6 }
            ]);
            return res.json(blog);
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }),
    updateBlog: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Invalid Authentication!" });
        try {
            const blog = yield blogModel_1.default.findOneAndUpdate({
                _id: req.params.id
            }, req.body);
            if (!blog)
                return res.status(400).json({ msg: "Invalid Authentication!" });
            res.json({ msg: "Success! Blog updated", blog });
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }),
    deleteBlog: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Invalid Authentication!" });
        try {
            const blog = yield blogModel_1.default.findOneAndDelete({
                _id: req.params.id
            });
            if (!blog)
                return res.status(400).json({ msg: "Invalid Authentication!" });
            res.json({ msg: "Success! Blog deleted" });
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }),
    searchBlogs: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const blogs = yield blogModel_1.default.aggregate([
                // {
                //   $search: {
                //     index: "searchTitle",
                //     autocomplete: {
                //       "query": `${req.query.title}`,
                //       "path": "title"
                //     }
                //   }
                // },
                {
                    $match: {
                        $text: {
                            $search: `${req.query.title}`
                        }
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        let: { user_id: "$user" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                            { $project: { name: 1 } } //only shows the 'name' props hides all other
                        ],
                        as: "user"
                    }
                },
                { $unwind: "$user" },
                { $sort: { createdAt: -1 } },
                { $limit: 5 },
                {
                    $project: {
                        user: 1,
                        title: 1,
                        thumbnail: 1,
                        createdAt: 1
                    }
                }
            ]);
            if (!blogs.length)
                return res.status(400).json({ msg: 'No blogs found!' });
            res.json(blogs);
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }),
    countView: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { views } = req.body;
        try {
            yield blogModel_1.default.findOneAndUpdate({ _id: req.params.id }, {
                views
            });
            res.json(views);
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }),
};
exports.default = blogCtrl;
