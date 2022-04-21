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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const generateToken_1 = require("../config/generateToken");
const sendMail_1 = __importDefault(require("../config/sendMail"));
const valid_1 = require("../middleware/valid");
const CLIENT_URL = process.env.BASE_URL;
const authCtrl = {
    register: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // if(!req.user) return res.status(400).json({msg: "Invalided Authentication!"})
        // if(req.user.role !== 'admin')
        //   return res.status(400).json({msg: "Invalid Authentication!"})
        try {
            const { name, email, password } = req.body;
            const user = yield userModel_1.default.findOne({ email });
            if (user)
                return res.status(400).json({ msg: "This email already exists!" });
            const passwordHash = yield bcrypt_1.default.hash(password, 12);
            const newUser = { name, email, password: passwordHash };
            const active_token = (0, generateToken_1.generateActiveToken)({ newUser });
            const url = `${CLIENT_URL}/active/${active_token}`;
            if ((0, valid_1.validateEmail)(email)) {
                (0, sendMail_1.default)(email, url, "Verify your email");
                return res.json({ msg: "Success! Please make them check their email" });
            }
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }),
    activeAccount: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { active_token } = req.body;
            const decoded = jsonwebtoken_1.default.verify(active_token, `${process.env.ACTIVE_TOKEN_SECRET}`);
            const { newUser } = decoded;
            if (!newUser)
                return res.status(400).json({ msg: "Invalid Authentication!" });
            const user = yield userModel_1.default.findOne({ email: newUser.email });
            if (user)
                return res.status(400).json({ msg: "This user already exists!" });
            const new_user = new userModel_1.default(newUser);
            yield new_user.save();
            res.json({ msg: "Success! their account has been activated" });
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }),
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const user = yield userModel_1.default.findOne({ email });
            if (!user)
                return res.status(400).json({ msg: "Incorrect email or password!" });
            //if exists;
            loginUser(user, password, res);
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }),
    logout: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return;
        try {
            res.clearCookie('refreshtoken', { path: '/api/refresh_token' });
            yield userModel_1.default.findOneAndUpdate({ _id: req.user.id }, {
                rf_token: ''
            });
            res.json({ msg: "Logged out successfully!" });
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }),
    refreshToken: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const rf_token = req.cookies.refreshtoken;
            if (!rf_token)
                return res.status(400).json({ msg: "Please Login now!" });
            const decoded = jsonwebtoken_1.default.verify(rf_token, `${process.env.REFRESH_TOKEN_SECRET}`);
            if (!decoded.id)
                return res.status(400).json({ msg: "Please Login now!" });
            const user = yield userModel_1.default.findById(decoded.id).select("-password +rf_token");
            if (!user)
                return res.status(400).json({ msg: "This account doesn't exists!" });
            if (rf_token !== user.rf_token)
                return res.status(400).json({ msg: "Please Login now!" });
            const access_token = (0, generateToken_1.generateAccessToken)({ id: user._id });
            const refresh_token = (0, generateToken_1.generateRefreshToken)({ id: user._id }, res);
            yield userModel_1.default.findOneAndUpdate({ _id: user._id }, {
                rf_token: refresh_token
            });
            res.json({ access_token, user });
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }),
    forgotPassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email } = req.body;
            const user = yield userModel_1.default.findOne({ email });
            if (!user)
                return res.status(400).json({ msg: "This email does not exists!" });
            const access_token = (0, generateToken_1.generateAccessToken)({ id: user._id });
            const url = `${CLIENT_URL}/reset_password/${access_token}`;
            if ((0, valid_1.validateEmail)(email)) {
                (0, sendMail_1.default)(email, url, "Reset your password");
                res.json({ msg: "Success! Please check your email" });
            }
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }),
};
const loginUser = (user, password, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!isMatch)
        return res.status(400).json({ msg: "Incorrect Email or Password" });
    const access_token = (0, generateToken_1.generateAccessToken)({ id: user._id });
    const refresh_token = (0, generateToken_1.generateRefreshToken)({ id: user._id }, res);
    yield userModel_1.default.findOneAndUpdate({ _id: user.id }, {
        rf_token: refresh_token
    });
    res.json({
        msg: 'Login Success!',
        access_token,
        user: Object.assign(Object.assign({}, user._doc), { password: '' })
    });
});
exports.default = authCtrl;
