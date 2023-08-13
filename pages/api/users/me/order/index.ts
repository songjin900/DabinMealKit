import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  //Get order by user id and status
  if (req.method === "GET"){
    const {
      session: { user },
      query: { status },
    } = req;
    const receivedStatus = status === undefined ? "new" : status?.toString()
    const order = await client.order.findFirst({
      where:{
        userId: user?.id,
        status: receivedStatus
      },
      include:{
        billingAddress: true,
        shippingAddress: true,
        orderItem: true,
      },
      orderBy:{
        id: "desc",
      }
    })

    console.log(order);
    res.json({ ok: true, order});
  }

  //Create new order when user click "checkout"
  if (req.method === "POST") {

    const {
      session: { user },
      body: {useSameAddress}
    } = req;

    const cart = await client.cart.findMany({
      where: {
        userId: user?.id,
      },
      include: {
        product: true
      }
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

    const newOrderExists = await client.order.findFirst({
      where: {
        userId: user?.id,
        status: "new",
      },
    });

    if (!newOrderExists) {
      const order = await client.order.create({
        data: {
          user: {
            connect: {
              id: user?.id,
            },
          },
          status:"new",
          useSameAddress,
          totalCostBeforeTax: Number(totalCostBeforeTax),
          totalCostAfterTax: Number(totalCostAfterTax),
          tax: Number(tax),
          shipping: Number(shipping),      
        },
      });
      res.json({ ok: true });
    }
    else {
      //Update the useSameAddress checkbox field
      const orderSameAddress = await client.order.update({
        where: {
          id: newOrderExists?.id
        },
        data: {
          useSameAddress,
          totalCostBeforeTax: Number(totalCostBeforeTax),
          totalCostAfterTax: Number(totalCostAfterTax),
          tax: Number(tax),
          shipping: Number(shipping),   
         }
      }
    )
      res.json({ ok: true });
    }
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
