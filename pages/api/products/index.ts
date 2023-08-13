import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const products = await client.product.findMany({
      where: {
        preStockQuantity: { gt: 0 },
      },
      include: {
        _count: {
          select: {
            Fav: true,
          },
        },
        Categories: {
          select: {
            name: true,
            productId: true,
          },
        },
        productImage: {
          select: {
            image: true
          }
        }
      },
    });

    res.json({
      ok: true,
      products,
    });
  }
  if (req.method === "POST") {
    const {
      body: { name, price, description, category, preStockQuantity, photoId, photos },
      session: { user },
    } = req;

    const product = await client.product.create({
      data: {
        name,
        price: +price,
        description,
        preStockQuantity: Number(preStockQuantity),
        actualStockQuantity: Number(preStockQuantity),
        image: photoId,
        user: {
          connect: {
            id: user?.id,
          },
        },
        modelNumber: "TodoForNow",
      },
    });
    if (category) {
      await Promise.all(
        category.map(async (ctg: string) => {
          await client.category.create({
            data: {
              name: ctg,
              product: {
                connect: {
                  id: Number(product.id),
                },
              },
            },
          });
        })
      );
    }

    if (photos){
      await Promise.all(
        photos.map(async (photo) => {
          await client.productImage.create({
            data: {
              image: photo.photoId,
              orderIndex: photo.orderIndex,
              product: {
                connect: {
                  id: Number(product.id),
                },
              },
            },
          });
        })
      );
    }

    res.json({
      ok: true,
      product,
    });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
