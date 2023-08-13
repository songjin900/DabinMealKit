import { Cart } from "@prisma/client";
import {withIronSessionApiRoute} from "iron-session/next"

declare module "iron-session" {
    interface IronSessionData {
        user?:{
            id: number;
        },
        cart?:{
            cart: Cart[];
        }
    }
}

const cookiOptions = {
    cookieName: "carrotsession",
    password: process.env.COOKIE_PASSWORD!
}

export function withApiSession(fn:any){
    return withIronSessionApiRoute(fn, cookiOptions)
}