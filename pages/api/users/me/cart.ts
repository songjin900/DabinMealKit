import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import { Cart } from "@prisma/client";

interface validateQuantity {
  message: string;
  type: "update" | "remove";
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
    body: { cartArray },
  } = req;


  //somehow where:{userId} is returning value even user is null
  if (req.method === "GET") {
    const cart = await client.cart.findMany({
      where: {
        userId: user?.id ? user?.id : -1,
      },
      include: {
        product: true,
      },
    });

    let totalCostBeforeTax = "";
    let totalCostAfterTax = "";
    let tax = "";
    let shipping = "";

    if (cart && cart.length > 0) {
      const totalQuantity = cart
        ? cart.reduce((acc, item) => acc + item.quantity, 0)
        : 0;

      const totalCostBeforeTaxNumber = cart
        .map((product) => {
          return product.quantity * product.product.price;
        })
        .reduce((accumulator, currentValue) => {
          return accumulator + currentValue;
        });
      const taxNumber = (totalCostBeforeTaxNumber + 8) * 0.13;
      const totalCostAfterTaxNumber = totalCostBeforeTaxNumber + 8 + taxNumber;

      totalCostBeforeTax = totalCostBeforeTaxNumber.toFixed(2);
      totalCostAfterTax = totalCostAfterTaxNumber.toFixed(2);
      tax = taxNumber.toFixed(2);
      shipping = "8.00";
    }

    res.json({
      ok: true,
      cart,
      totalCostBeforeTax,
      totalCostAfterTax,
      tax,
      shipping,
    });
  }

  if (req.method === "POST") {

    await Promise.all(
      cartArray.map(async (item: Cart) => {
        const alreadyExists = await client.cart.findFirst({
          where: {
            productId: Number(item.productId),
            userId: user?.id,
          },
        });

        const cartId = alreadyExists ? alreadyExists.id : -1;

        if (cartId !== -1) {
          //Remove. No need
          if (item.quantity === 0) {
            const removedItem = await client.cart.delete({
              where: {
                id: cartId,
              },
            });
          } else {
            const cart = await client.cart.update({
              where: {
                id: cartId,
              },
              data: {
                quantity: item.quantity,
              },
            });
          }
        }
      })
    );

    const cart = await client.cart.findMany({
      where: {
        userId: user?.id ? user?.id : -1,
      },
      include: {
        product: true,
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
            image: true
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
              image: productQuantity?.image
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
              image: productQuantity?.image
            });
          }
        }
      })
    );

    let buttonDisable = true;
    if (cart?.length > 0 && (cartQuantityErrorArray && cartQuantityErrorArray.length == 0)){
      buttonDisable = false;
    }

    //when all the loops are done
    res.json({
      ok: true,
      data: cartArray,
      cartQuantityErrorArray,
      buttonDisable
    });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
