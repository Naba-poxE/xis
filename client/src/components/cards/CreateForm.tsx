import { useSelector } from "react-redux";
import { IAuth } from '../../redux/types/authType';
import { RootStore,InputChange } from "../../utils/TypeScript";
import { IBlog } from '../../utils/TypeScript'


interface IProps {
    blog: IBlog,
    setBlog: (blog: IBlog) => void,
    auth: IAuth
}

const CreateForm: React.FC<IProps> = ({blog, setBlog }) => {
    
    const { categories } = useSelector((state: RootStore) => state)

    const handleChangeInput = (e: InputChange) => {
        const { name,value } = e.target
        setBlog({...blog, [name]:value})
    }

    const handleChangeThumbnail = (e: InputChange) => {
        const target = e.target as HTMLInputElement
        const files = target.files

        if(files) {
            const file = files[0]
            setBlog({...blog,thumbnail:file})
        }
    }

    return(
        <form>
            <div className="form-group position-relative">
                <input 
                    type="text" 
                    className="form-control" 
                    value={blog.title} name="title"
                    onChange={handleChangeInput}
                    placeholder= "Title"
                     />
                <small className="text-muted position-absolute" style={{bottom:'8px', right:'3px', opacity:'0.3'}}>
                    {blog.title.length}/100
                </small>
            </div>

            <div className="form-group my-3">
                <input type="file" className="form-control"  accept="image/*" onChange={handleChangeThumbnail}/>
            </div>
        
            <div className="form-group position-relative">
                <textarea 
                    className="form-control" 
                    rows={4} style={{resize:'none'}}
                    value={blog.description} name="description"
                    placeholder= "Description"
                    onChange={handleChangeInput} />
                
                <small className="text-muted position-absolute" style={{bottom:0, right:'3px', opacity:'0.3'}}>
                     {blog.description.length}/200
                </small>
            </div>
        
            <div className="form-group my-3">
                <select 
                    className="form-control text-capitalize bg-dark text-light w-25" 
                    value={blog.category} name="category" 
                    onChange={handleChangeInput} >
                    <option value="">Choose Category</option>
                    {
                        categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))
                    }
                </select>
            </div>
        </form>
    )
}

export default CreateForm;