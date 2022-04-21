import { IUserRegister,IBlog } from './TypeScript'

export const validRegister = (userRegister: IUserRegister) => {
  const { name, email, password, cf_password } = userRegister;
  const errors: string[] = [];

  if(!name){
    errors.push("Please add your name.")
  }else if(name.length > 20){
    errors.push("Your name is up to 20 chars long.")
  }

  if(!email){
    errors.push("Please add your email")
  }else if(!validPhone(email) && !validateEmail(email)){
    errors.push("Invalid Email")
  }

  const msg = checkPassword(password, cf_password)
  if(msg) errors.push(msg)

  return {
    errMsg: errors,
    errLength: errors.length
  }
}


export const checkPassword = (password: string, cf_password: string) => {
  if(password.length < 6){
    return("Password must be at least 6 character long.")
  }else if(password !== cf_password){
    return("Password did not match.")
  }
}


export function validPhone(phone: string) {
  const re = /^[+]/g
  return re.test(phone)
}

export function validateEmail(email: string) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

//Valid Blog

export const validCreateBlog = ({
  title,content,description,thumbnail,category
}: IBlog) => {

  const err: string[] = []

  if(title.trim().length < 10) {
    err.push("Title should atleast be 10 chars")
  }else if(title.trim().length > 100) {
    err.push("Title shouldn't exceed 100 chars")
  }

  if(content.trim().length < 500) {
    err.push("Your content should be atleast 500 chars")
  }

  if(description.trim().length < 50) {
    err.push("Description should atleast be 50 chars")
  }else if(description.trim().length > 200) {
    err.push("Description shouldn't exceed 200 chars")
  }

  if(!thumbnail) {
    err.push("Thumbnail cannot be left blank")
  }

  if(!category) {
    err.push("Category cannot be left blank")
  }

  return {
    errMsg: err,
    errLength: err.length
  }

}

//Shallow Equality

export const shallowEqual = (object1: any, object2: any) => {
  const key1 = Object.keys(object1)
  const key2 = Object.keys(object2) 

  if(key1.length !== key2.length) {
    return false;
  }

  for(let key of key1) {
    if(object1[key] !== object2[key]) {
      return false;
    }
  }
  return true;
} 