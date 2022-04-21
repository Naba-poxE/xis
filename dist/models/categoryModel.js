"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const categorySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        require: [true, "Please add your category"],
        unique: true,
        trim: true,
        maxLength: [50, "Name shouldn't be more than 50 chars long"],
    },
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('category', categorySchema);
