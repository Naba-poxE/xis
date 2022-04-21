import React,{ useState,useRef, useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import NotFound from "../components/global/NotFound";
import { RootStore,IBlog, IUser } from "../utils/TypeScript";
import CardHoriz from "../components/cards/CardHoriz";
import CreateForm from "../components/cards/CreateForm";
import ReactQuill from "../components/editor/ReactQuill";
import { validCreateBlog } from "../utils/Valid";
import { ALERT } from "../redux/types/alertType";
import { createBlog,updateBlog } from "../redux/actions/blogActions";
import { getAPI } from "../utils/FetchDatas";
import { shallowEqual } from '../utils/Valid'

interface IProps{
    id?: string
}

const CreateBlog: React.FC<IProps> = ({id}) => {

    const initState = {
        user: '',
        title: '',
        content: '',
        description: '',
        thumbnail: '',
        category: '',
        views: 0,
        createdAt: new Date().toISOString()
    }

    const { auth } = useSelector((state: RootStore) => state)
    const dispatch = useDispatch()

    const [ blog,setBlog ] = useState<IBlog>(initState)
    const [ body,setBody ] = useState('')
    const [ text,setText ] = useState('')
    const [ oldData,setOldData ] = useState<IBlog>(initState)
    const divRef = useRef<HTMLDivElement>(null)

    useEffect(() => {  //before using useEffect id was console.logged many times but now it consoles one time only
        if(!id) return;

        getAPI(`blog/${id}`)  //get api is getting all the datas from the particular id
        .then(res => {
            setBlog(res.data)
            setBody(res.data.content)
            setOldData(res.data)
        })
        .catch(err => console.log(err))

        const initData = {
            user: '',
            title: '',
            content: '',
            description: '',
            thumbnail: '',
            category: '',
            views: 0,
            createdAt: new Date().toISOString()
        }

        return () => {
            setBlog(initData)
            setBody('')
            setOldData(initData)
        }
        
    },[id])

    useEffect(() => {
        const div = divRef.current;
        if(!div) return

        const text = (div?.innerText as string)
        setText(text)
    },[body])   //means whenever the body changes re-render the component

    const handleSubmit = async () => {
        if(!auth.access_token) return;

        const check = validCreateBlog({ ...blog, content:text})
        if(check.errLength !== 0) return dispatch({type: ALERT, payload: {errors: check.errMsg}})
        
        let newData = {...blog, content: body}

        if(id) {
            if((blog.user as IUser)._id === auth.user?._id || auth.user?.role === 'admin') {
                dispatch(updateBlog(newData, auth.access_token))
            } else {
                return dispatch({
                    type: ALERT,
                    payload: { errors: "Invalid Authentication"}
                })
            }


            const result = shallowEqual(oldData, newData)
            if(result) return dispatch({
                type: ALERT,
                payload: { errors: "The Data has not been"}
            })

            setBlog(initState)
            setBody('')
        }else{
            dispatch(createBlog(newData, auth.access_token))
            setBlog(initState)
            setBody('')
        }
    }

    if(!auth.access_token || !auth.user) return <NotFound />
    return(
        <div className="container my-4">
            <h2 className="text-secondary">Create Blog</h2>
            <div className="row mt-4">
                <div className="col-md-6">
                    <h5>Create</h5>
                    <CreateForm auth={auth} blog={blog} setBlog={setBlog} />
                </div>

                <div className="col-md-6 ">
                    <h5>Preview</h5>
                    <CardHoriz blog={blog}/>
                </div>
            </div>
            <div>
                <ReactQuill setBody={setBody} body={body} />
            </div>
        
            <div ref={divRef} dangerouslySetInnerHTML={{
                __html: body
            }} style={{display:'none'}} />
            <small>{text.length}</small>

            <button className="btn btn-dark mt-3 d-block mx-auto" onClick={handleSubmit}>
                { id ? 'Update' : 'Create' }
            </button>
        </div>
    )
}

export default CreateBlog;