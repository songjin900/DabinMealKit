import twilio from "twilio";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import smtpTransport from "@libs/server/email";

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
    const { phone, email } = req.body;
    const user = phone ? { phone: phone } : email ? { email } : null;
    if (!user)
        return res.status(400).json({ ok: false });
    const payload = Math.floor(100000 + Math.random() * 900000) + "";
    const token = await client.token.create({
        data: {
            payload,
            user: {
                connectOrCreate: {
                    where: {
                        ...user
                    },
                    create: {
                        name: "Anonymous",
                        accountType: "registered",
                        email,
                        ...user
                    },
                }
            }
        }
    })

    if (phone) {
        // const message = await twilioClient.messages.create({
        //     messagingServiceSid: process.env.TWILIO_MSID,
        //     to: process.env.MY_PHONE!, //phone 
        //     body: `Your login token is ${payload}`
        // })
        // console.log(message)
    }
    else if (email) {
        // const mailOptions = {
        //     from: process.env.MAIL_ID,
        //     to: email, //email
        //     subject: "Nomad Carrot Authentication Email",
        //     text: `Authentication Code : ${payload}`,
        //     html: `<strong> hello! this is your token ${payload} </strong>`
        // };
        // const result = await smtpTransport.sendMail(
        //     mailOptions,
        //     (error: any, responses: any) => {
        //         if (error) {
        //             console.log(error);
        //             return null;
        //         } else {
        //             console.log(responses);
        //             return null;
        //         }
        //     }
        // );
        // smtpTransport.close();
        // console.log(result);
    }


    return res.json({
        ok: true
    })
}

export default withHandler({ methods: ["POST"], handler, isPrivate: false })