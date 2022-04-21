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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = exports.validRegister = void 0;
const validRegister = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const errors = [];
    if (!name) {
        errors.push("Please fill in your name"); //push the item to the array errors;
    }
    else if (name.length > 20) {
        errors.push("Your name should not exceed 20 character");
    }
    if (!email) {
        errors.push("Please fill in your email");
    }
    else if (!validateEmail(email)) {
        errors.push("Invalid email! Please check again");
    }
    if (!password) {
        errors.push("Please fill in your password");
    }
    else if (password.length < 6) {
        errors.push("Password must be at least 6 character long");
    }
    if (errors.length > 0)
        return res.status(400).json({ msg: errors });
    next();
});
exports.validRegister = validRegister;
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
exports.validateEmail = validateEmail;
