import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
    body: {
      firstName,
      lastName,
      address,
      city,
      province,
      postCode,
      phone,
      firstNameB,
      lastNameB,
      addressB,
      cityB,
      provinceB,
      postCodeB,
      phoneB,
    },
  } = req;


  if (req.method === "POST") {
    const orderExists = await client.order.findFirst({
      where: {
        userId: user?.id,
        status: "new",
      },
    });
    
    const userFound = await client.user.findFirst({
      where: {
        id: user?.id,
        accountType: "registered"
      }
    })

    const orderIdExists = orderExists ? orderExists.id : -1;

    const shippingAddress = await client.shippingAddress.upsert({
      where: {
        orderId: orderIdExists,
      },
      update: {
        firstName,
        lastName,
        address,
        city,
        province,
        postCode,
        phone,
      },

      create: {
        firstName,
        lastName,
        address,
        city,
        province,
        postCode,
        phone,
        order: {
          connect: {
            id: orderIdExists,
          },
        },
      },
    });  

    const billingAddress = await client.billingAddress.upsert({
      where: {
        orderId: orderIdExists,
      },
      update: {
        firstName: orderExists?.useSameAddress ? firstName : firstNameB,
        lastName: orderExists?.useSameAddress ? lastName : lastNameB,
        address: orderExists?.useSameAddress ? address : addressB,
        city: orderExists?.useSameAddress ? city : cityB,
        province: orderExists?.useSameAddress ? province : provinceB,
        postCode: orderExists?.useSameAddress ? postCode : postCodeB,
        phone: orderExists?.useSameAddress ? phone : phoneB,

      },
      create: {
        firstName: orderExists?.useSameAddress ? firstName : firstNameB,
        lastName: orderExists?.useSameAddress ? lastName : lastNameB,
        address: orderExists?.useSameAddress ? address : addressB,
        city: orderExists?.useSameAddress ? city : cityB,
        province: orderExists?.useSameAddress ? province : provinceB,
        postCode: orderExists?.useSameAddress ? postCode : postCodeB,
        phone: orderExists?.useSameAddress ? phone : phoneB,

        order: {
          connect: {
            id: orderIdExists,
          },
        },
      },
    });
    res.json({ ok: true, billingAddress });

    // if (useSameAddress) {
    //   const billingAddress = await client.billingAddress.update({
    //     where: {
    //       orderId: orderIdExists,
    //     },
    //     data: {
    //         firstName, lastName, address, city, province, postCode, phone
    //     },
    //   });
    //   res.json({ ok: true, billingAddress });
    // } else {
    //   const billingAddress = await client.billingAddress.upsert({
    //     where: {
    //       orderId: orderIdExists,
    //     },
    //     update: {
    //         firstName, lastName, address, city, province, postCode, phone

    //     },
    //     create: {
    //         firstName, lastName, address, city, province, postCode, phone ,

    //       order: {
    //         connect: {
    //           id: orderIdExists,
    //         },
    //       },
    //     },
    //   });
    //   res.json({ ok: true, billingAddress });

    // }
  }
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
