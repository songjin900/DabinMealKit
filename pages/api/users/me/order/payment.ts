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
    body: { useSameAddress },
  } = req;

  //2. Order Status = Paid or Processing
  //3. Update the preInStock in product
  //4. Once Payment completed - update the actualStock. (NOT HERE LATER once we get a confirmation of payment from paypal)
  //5. Delete the cart

  try {
    //Create new order when user click "checkout"
    if (req.method === "POST") {
      const cart = await client.cart.findMany({
        where: {
          userId: user?.id,
        },
      });

      await Promise.all(
        cart.map(async (item) => {
          const product = await client.product.findUnique({
            where: {
              id: item.productId,
            },
          });
          const newPreStockQuantity =
            product?.preStockQuantity - item?.quantity;

          const addProductToOrder = await client.product.update({
            where: {
              id: item.productId,
            },
            data: {
              preStockQuantity: newPreStockQuantity,
            },
          });
        })
      );

      const newOrderExists = await client.order.findFirst({
        where: {
          userId: user?.id,
          status: "new",
        },
      });

      const orderId = newOrderExists ? newOrderExists.id : -1;

      if (orderId === -1) {
        res.json({
          ok: false,
        });
      }

      const updateOrderStatus = await client.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: "processing",
        },
      });

      //HERE GET A Response from PAYPAL ONCE everything is successful
      //IF all good then continue
      //If Fails, then attension requires.

      await Promise.all(
        cart.map(async (item) => {
          const addProductToOrder = await client.orderItem.create({
            data: {
              quantity: item.quantity,
              order: {
                connect: {
                  id: orderId,
                },
              },
              product: {
                connect: {
                  id: item.productId,
                },
              },
            },
          });
        })
      );

      await Promise.all(
        cart.map(async (item) => {
          const product = await client.product.findUnique({
            where: {
              id: item.productId,
            },
          });
          const newActualStockQuantity = product?.preStockQuantity;

          const addProductToOrder = await client.product.update({
            where: {
              id: item.productId,
            },
            data: {
              actualStockQuantity: newActualStockQuantity,
            },
          });
        })
      );

      const deleteCart = await client.cart.deleteMany({
        where: {
          userId: user?.id,
        },
      });
      const payload = Math.floor(10000 + Math.random() * 90000) + "";

      const updateOrderStatusToComplete = await client.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: "complete",
          orderNumber: orderId.toString() + user?.id.toString() + payload,
          deliveryStatus: "Preparing",
          paymentType: "paypal",
          orderPlacedDate: new Date(),         
        },
      });
      

      res.json({
        ok: true,
        orderNumber: updateOrderStatusToComplete.orderNumber,
        orderId
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500);
  }
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
