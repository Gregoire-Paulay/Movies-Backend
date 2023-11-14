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
exports.isAuthenticated = void 0;
const User_1 = require("../models/User");
const isAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.headers.authorization) {
            // console.log("Middleware isAuthenticated");
            const receivedToken = req.headers.authorization.replace("Bearer ", "");
            const foundUser = yield User_1.User.findOne({ token: receivedToken });
            if (foundUser) {
                // console.log("Authorized");
                req.user = foundUser;
                return next();
            }
            else {
                return res.status(401).json({ error: "Unauthorized" });
            }
        }
        else {
            return res.status(401).json({ error: "Unauthorized" });
        }
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.isAuthenticated = isAuthenticated;
