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
const valid_1 = require("../middleware/valid");
const subscriptionModel_1 = __importDefault(require("../models/subscriptionModel"));
const subscriptionCtrl = {
    getEmails: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Invalid Authentication!" });
        if (req.user.role !== 'admin')
            return res.status(400).json({ msg: "Invalid Authentication!" });
        try {
            const subscribers = yield subscriptionModel_1.default.find().sort('-createdAt');
            res.json(subscribers);
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }),
    postEmail: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const email = req.body.email;
            const subscriber = yield subscriptionModel_1.default.findOne({ email });
            if (subscriber)
                return res.status(400).json({ msg: "Email already exists!" });
            if ((0, valid_1.validateEmail)(email)) {
                const newEmail = new subscriptionModel_1.default({ email });
                yield newEmail.save();
                res.json({ msg: "Congrats! See you in your inbox" });
            }
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }),
    deleteEmail: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Invalid Authentication!" });
        if (req.user.role !== 'admin')
            return res.status(400).json({ msg: "Invalid Authentication!" });
        try {
            const emails = yield subscriptionModel_1.default.findByIdAndDelete(req.params.id);
            if (!emails)
                return res.status(400).json({ msg: "Email does not exists!" });
            res.json({ msg: "Success! Email deleted" });
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    })
};
exports.default = subscriptionCtrl;
