export const checkImage = (file: File) => {
    const types = ['image/png', 'image/jpeg'] 

    let err = '';

    if(!file) return err = 'File does not exist!'

    if(file.size > 2048 * 2048) return err = 'Too large file!'

    if(!types.includes(file.type)) return err = 'Image format is invalid!'
        
    return err;
}


export const imageUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file',file)
    formData.append('upload_preset','b20m1fqi')
    formData.append('cloud_name','dpra6ghs3')

    const res = await fetch('https://api.cloudinary.com/v1_1/dpra6ghs3/upload',{
        method: 'POST',
        body: formData
    })

    const data = await res.json()
    return { public_id: data.public_id, url: data.secure_url};
}
