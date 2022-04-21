import { Router } from 'express';
import auth from '../middleware/auth'
import userCtrl from '../controllers/userCtrl';

const router = Router()


router.patch('/user', auth, userCtrl.updateUser) 

router.patch('/reset_password', auth, userCtrl.resetPassword)

router.get('/user/:id', userCtrl.getUser)

router.get('/users', auth, userCtrl.getAllUsers)

router.delete('/delete_user/:id', auth, userCtrl.deleteUser)


export default router;