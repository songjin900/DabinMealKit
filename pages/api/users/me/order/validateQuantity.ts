import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

interface validateQuantity {
  message: string;
  type: "update" | "remove";
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
  } = req;

  //Checkout page
  if (req.method === "GET") {
    //cart vs product
    const cart = await client.cart.findMany({
      where: {
        userId: user?.id,
      },
    });

    let cartQuantityErrorArray: validateQuantity[] = [];

    await Promise.all(
      cart.map(async (item) => {
        const productQuantity = await client.product.findUnique({
          where: {
            id: item.productId,
          },
          select: {
            preStockQuantity: true,
            actualStockQuantity: true,
            price: true,
            name: true,
          },
        });
        if (
          item.quantity > (productQuantity?.preStockQuantity ?? 0) ||
          item.quantity > (productQuantity?.actualStockQuantity ?? 0)
        ) {
          if (
            productQuantity?.preStockQuantity === 0 ||
            productQuantity?.actualStockQuantity === 0
          ) {
            cartQuantityErrorArray.push({
              message:
                "This item is no longer available. Please remove it from your cart",
              type: "remove",
              productId: item.productId,
              price: productQuantity.price,
              name: productQuantity.name,
              quantity: productQuantity?.preStockQuantity,
            });
          } else {
            cartQuantityErrorArray.push({
              message:
                `Please update the quantity of the item as there has been a change in stock. Quantity left in stock: ${productQuantity?.preStockQuantity}`,
              type: "update",
              productId: item.productId,
              price: productQuantity?.price ?? 0,
              name: productQuantity?.name ?? "",
              quantity: productQuantity?.preStockQuantity ?? 0,
            });
          }
        }
      })
    );

    if (cartQuantityErrorArray.length > 0) {
      res.json({ ok: false, cartQuantityErrorArray });
    } else {
      res.json({ ok: true });
    }
  }
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
