import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

/*
This is specific handler for userDetail
Allows you to GET and POST
*/

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
  } = req;

  if (req.method === "GET") {
    const userDetail = await client.userDetail.findUnique({
      where: {
        userId: user?.id,
      },
      include: {
        user: {
          select: {
            email: true,
            phone: true,
            accountType: true
          },
        },
      },
    });
    res.json({
      ok: true,
      userDetail,
    });
  }

  if (req.method === "POST") {
    const {
      body: {
        firstName,
        lastName,
        phone,
        // email,
        address,
        city,
        province,
        postCode,
      },
      session: { user },
    } = req;

    const currentUser = await client.user.findUnique({
      where: {
        id: user?.id,
      }
    }) 
    // console.log(currentUser);

    // //Check if Email Exists
    // if (email && email !== currentUser?.email){
    //   const alreadyExists = Boolean(
    //     await client.user.findUnique({
    //       where: {
    //         email,
    //       },
    //       select: {
    //         id: true,
    //       },
    //     })
    //   );
    //   if (alreadyExists) {
    //     return res.json({
    //       ok: false,
    //       error: "Email already taken.",
    //     });
    //   }
    // }

    // const userFromDB = await client.user.findUnique({
    //   where: {
    //     id: user?.id
    //   }
    // });

    // const emailToUpdate = userFromDB ? userFromDB.email : email;

    const userDetail = await client.userDetail.upsert({
      where:{
        userId: user?.id
      },
      update:{
        firstName,
        lastName,
        phone,
        // email: emailToUpdate,
        address,
        city,
        province,
        postCode,
      },
      create:
      {
          firstName,
          lastName,
          phone,
          // email: emailToUpdate,
          address,
          city,
          province,
          postCode,
          user: {
            connect: {
              id: user?.id,
            },
        },
      }
    })
    res.json({
      ok: true,
      userDetail,
    });

    // const userDetailExists = Boolean(
    //   await client.userDetail.findUnique({
    //     where: {
    //       userId: user?.id,
    //     },
    //   })
    // );
    
    // if (userDetailExists){
    //   const userDetail = await client.userDetail.update({
    //     where: {
    //       userId: user?.id
    //     },

    //     data: {
    //       firstName,
    //       lastName,
    //       phone,
    //       phoneExtension,
    //       email,
    //       address,
    //       city,
    //       province,
    //       postCode,
    //     },
    //   });
    //   res.json({
    //     ok: true,
    //     userDetail,
    //   });
    // }
    // else {
    //   const userDetail = await client.userDetail.create({
    //     data: {
    //       firstName,
    //       lastName,
    //       phone,
    //       phoneExtension,
    //       email,
    //       address,
    //       city,
    //       province,
    //       postCode,
    //       user: {
    //         connect: {
    //           id: user?.id,
    //         },
    //       },
    //     },
    //   });
    //   res.json({
    //     ok: true,
    //     userDetail,
    //   });
   // }
  }
}


export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
