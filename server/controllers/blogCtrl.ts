import { Request,Response } from 'express';
import { IReqAuth } from '../config/interface';
import Blogs from '../models/blogModel';
import mongoose from 'mongoose';


const Pagination = (req: IReqAuth) => {
    let page = Number(req.query.page) * 1 || 1;
    let limit = Number(req.query.limit) * 1 || 4;
    let skip = (page - 1) * limit;
  
    return { page, limit, skip };
  }

const blogCtrl = {
    createBlog: async( req: IReqAuth, res: Response ) => {
        if(!req.user) return res.status(400).json({msg: "Invalid Authentication!"})

        try {
            const { title, content, description, thumbnail, category } = req.body
      
            const newBlog = new Blogs({
              user: req.user._id,
              title: title.toLowerCase(), 
              content,
              description, 
              thumbnail, 
              category
            })
      
            await newBlog.save()
            res.json({
                ...newBlog._doc,
                user: req.user
            })
      
          } catch (err: any) {
            return res.status(500).json({msg: err.message})
    }
    },
    getHomeBlogs: async ( req: IReqAuth, res: Response ) => {
        try {
            const blogs = await Blogs.aggregate([
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
                { $unwind: "$user"}, //tranfer array to object
                //Category //taking the id of 'category' and getting all the props of 'category' from that id
                {
                    $lookup: {
                        "from": "categories",
                        "localField": "category",
                        "foreignField": "_id",
                        "as": "category"
                    }
                },
                { $unwind: "$category" }, //trasnferring the array to object of categories

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
            ])
            res.json(blogs)

        } catch (err: any) {
            return res.status(500).json({msg: err.message})
        }
    },
    getBlogsByCategory: async ( req: IReqAuth, res: Response ) => {
        const { limit, skip } = Pagination(req)

        try {
            const Data = await Blogs.aggregate([
                {
                    $facet: {
                        totalData: [
                            { $match: 
                                { 
                                    category: mongoose.Types.ObjectId(req.params.id) 
                                } 
                            },
                            // User
                            {
                                $lookup:{
                                from: "users",
                                let: { user_id: "$user" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                                    { $project: { password: 0 }}
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
                            { $match: 
                                { 
                                    category: mongoose.Types.ObjectId(req.params.id) 
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
            ])
            
            const blogs = Data[0].totalData;
            const count = Data[0].count;

            //Pagination
            let total = 0;

            if(count % limit === 0) {
                total = count / limit;
            }else {
                total = Math.floor(count / limit) + 1 //floor rouds the real value and gives the integer value
            }

            res.json({ blogs,total })

        } catch (err: any) {
            return res.status(500).json({msg: err.message})
        }
    },
    getBlogsByUser: async ( req: IReqAuth, res: Response ) => {
        const { limit, skip } = Pagination(req)

        try {
            const Data = await Blogs.aggregate([
                {
                    $facet: {
                        totalData: [
                            { $match: 
                                { 
                                    user: mongoose.Types.ObjectId(req.params.id) 
                                } 
                            },
                            // User
                            {
                                $lookup:{
                                from: "users",
                                let: { user_id: "$user" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                                    { $project: { password: 0 }}
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
                            { $match: 
                                { 
                                    user: mongoose.Types.ObjectId(req.params.id) 
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
            ])
            
            const blogs = Data[0].totalData;
            const count = Data[0].count;

            //Pagination
            let total = 0;

            if(count % limit === 0) {
                total = count / limit;
            }else {
                total = Math.floor(count / limit) + 1 //floor rouds the real value and gives the integer value
            }

            res.json({ blogs,total })

        } catch (err: any) {
            return res.status(500).json({msg: err.message})
        }
    },
    getBlog: async ( req: Request, res: Response ) => {
        try {
            const blog = await Blogs.findOne({_id: req.params.id}).populate("user", "-password")
            if(!blog) return res.status(400).json({ msg: "Blog does not exist." })

            return res.json(blog)

        } catch (err: any) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getTrendingBlogs: async ( req: Request, res: Response ) => {
        try {
            const blog = await Blogs.find().sort({createdAt: -1, views: -1,}).limit(4)
            return res.json(blog)
        } catch (err: any) {
            return res.status(500).json({msg: err.message})
        }
    },
    getBlogsByViews: async ( req: Request, res: Response ) => {
        try {
            const blogs = await Blogs.aggregate([
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
            ])

            res.json(blogs)

        } catch (err: any) {
            return res.status(500).json({msg: err.message})
        }
    },
    getUnderratedBlogs: async ( req: Request,res: Response ) => {
        try {
            const blog = await Blogs.aggregate([
                {
                    $lookup: {
                        from: "users",
                        let: { user_id: "$user"},
                        pipeline: [
                            { $match: { $expr: { $eq: ["$_id","$$user_id"] } } },
                            { $project: { password: 0 } }
                        ],
                        as: "user"
                    }
                },

                { $unwind: "$user" },
                { $sort: { createdAt: 1 } },
                { $limit: 6 }
            ])

            return res.json(blog)
        } catch (err: any) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateBlog: async( req: IReqAuth, res: Response ) => {
        if(!req.user) return res.status(400).json({msg: "Invalid Authentication!"})
        try {
            const blog = await Blogs.findOneAndUpdate({
                _id: req.params.id
            }, req.body)

            if(!blog) return res.status(400).json({msg: "Invalid Authentication!"})

            res.json({ msg: "Success! Blog updated" , blog })

        } catch (err: any) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteBlog: async( req: IReqAuth, res: Response ) => {
        if(!req.user) return res.status(400).json({msg: "Invalid Authentication!"})
        try {
            const blog = await Blogs.findOneAndDelete({
                _id: req.params.id
            })

            if(!blog) return res.status(400).json({msg: "Invalid Authentication!"})

            res.json({msg: "Success! Blog deleted"})
            
        } catch (err: any) {
            return res.status(500).json({msg: err.message})
        }
    },
    searchBlogs: async ( req: Request, res: Response ) => {
        try {
          const blogs = await Blogs.aggregate([
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
            { $limit: 5},
            {
              $project: {
                user: 1,
                title: 1,
                thumbnail: 1,
                createdAt: 1
              }
            }
          ])
    
          if(!blogs.length)
            return res.status(400).json({msg: 'No blogs found!'})
    
          res.json(blogs)
    
        } catch (err: any) {
          return res.status(500).json({msg: err.message})
        }
    },
    countView: async ( req: Request, res: Response ) => {
        
        const { views } = req.body

        try {
            await Blogs.findOneAndUpdate({_id: req.params.id},{
                views
            })

            res.json(views)
            
        } catch (err:any) {
            return res.status(500).json({msg: err.message})
        }
    },
} 

export default blogCtrl;