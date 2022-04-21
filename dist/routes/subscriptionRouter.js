"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subscriptionCtrl_1 = __importDefault(require("../controllers/subscriptionCtrl"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = (0, express_1.Router)();
router.route('/subscribe')
    .get(auth_1.default, subscriptionCtrl_1.default.getEmails)
    .post(subscriptionCtrl_1.default.postEmail);
router.delete('/subscribe/:id', auth_1.default, subscriptionCtrl_1.default.deleteEmail);
exports.default = router;
