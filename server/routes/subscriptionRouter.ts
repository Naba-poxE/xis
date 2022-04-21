import { Router } from "express";
import subscriptionCtrl from "../controllers/subscriptionCtrl";
import auth from "../middleware/auth";

const router = Router()

router.route('/subscribe')
        .get(auth,subscriptionCtrl.getEmails)
        .post(subscriptionCtrl.postEmail)


router.delete('/subscribe/:id', auth, subscriptionCtrl.deleteEmail)



export default router;