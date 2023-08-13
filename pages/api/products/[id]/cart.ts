import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    body: { cartQuantity, id },
    session: { user },
  } = req;

  //All individual items
  if (req.method === "GET") {
    const cart = await client.cart.findFirst({
      where: {
        productId: Number(id),
        userId: user?.id,
      },
    });

    res.json({
      ok: true,
      cart,
    });
  }
  
  if (req.method === "POST") {
    //Expire the session
    const findUser = await client.user.findFirst({
      where: {
        id: user?.id,
      },
    });

    if (!findUser) {
      await req.session.destroy();
    }

    if (!user) {
      res.json({
        ok: false,
        message: "redirect",
        cart: null,
      });
    }

    //Find product already exists in the cart
    const alreadyExists = await client.cart.findFirst({
      where: {
        productId: Number(id),
        userId: user?.id,
      },
    });

    //If quantity is 0 or less than 0 then remove
    if (alreadyExists && cartQuantity <= 0) {
      await client.cart.delete({
        where: {
          id: alreadyExists.id,
        },
      });
    } else {
      //this user id comes from the session. so if we delete user id from the db this would break.

      const alreadyExistsID = alreadyExists ? alreadyExists.id : -1;

      //If new create, if exists, then update
      const cart = await client.cart.upsert({
        where: {
          id: alreadyExistsID,
        },
        update: {
          quantity: alreadyExists ? alreadyExists.quantity + cartQuantity : 0, // .quantity + cartQuantity,
        },
        create: {
          quantity: cartQuantity,
          user: {
            connect: {
              id: user?.id,
            },
          },
          product: {
            connect: {
              id: Number(id),
            },
          },
        },
      });
      res.json({ ok: true, cart, message: "" });
    }
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler, isPrivate: true})
);
