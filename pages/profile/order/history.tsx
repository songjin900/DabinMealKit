import { NextPage } from "next";
import Layout from "@components/layout";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { Order } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";

const History: NextPage = () => {
    const { data } = useSWR(`/api/users/me/order/history`);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (data)
            setHistory(data.order);
    }, [data])

    const statusWithTimeSwitch = (status: string, deliveryDate: Date) => {
        switch (status) {
            case 'Delivery Scheduled':
                return <div>{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(new Date(deliveryDate))} between 6-9pm</div>
            case 'Delivery Complete':
                return <div>{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(new Date(deliveryDate))}</div>
            default:
                return null
        }
    }

    return (
        <Layout title="History" hasTabBar>
            <div className="px-4 md:px-20 py-4 bg-gray-100">
                <div className="flex flex-col md:flex-row md:space-x-4 justify-center">
                    <div className="w-full md:min-w-[30rem] md:max-w-[50rem]">
                        {
                            data ?
                                (
                                    history?.map((order: Order) => (
                                        <div key={order.id} className="border-2 rounded-xl space-x-4 bg-white mb-3 p-1 ">
                                            <div className="grid grid-cols-6 grid-rows-1 bg-gray-200 p-1 rounded-xl">
                                                <div className="grid grid-rows-2 col-span-2">
                                                    <div>Order Placed</div>
                                                    <div>{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(new Date(order.orderPlacedDate))}</div>
                                                </div>
                                                <div className="grid grid-rows-2">
                                                    <div>Total</div>
                                                    <div>{order.totalCostAfterTax} </div>
                                                </div>
                                                <div className="grid grid-rows-2">
                                                    <div>Ship To</div>
                                                    <div>{order.shippingAddress.firstName} </div>
                                                </div>
                                                <div className="grid grid-rows-2">
                                                    <div>Order</div>
                                                    <div>{order.orderNumber} </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <Link legacyBehavior href={`/profile/order/${order.id}/invoice`}>
                                                        <div className="underline cursor-pointer">Invoice</div>
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="p-1 text-lg">
                                                Status: {order.deliveryStatus} {statusWithTimeSwitch(order?.deliveryStatus, order?.deliveryDate)}
                                            </div>

                                            {order?.orderItem?.map((orderItem) => (
                                                // <div key={item.id}>{item.productId}</div>
                                                <div key={orderItem.id} className="flex flex-col border-2 rounded-xl p-1 hover:border-orange-400 cursor-pointer ">
                                                    <Link legacyBehavior href={`/products/${orderItem.product.id}`}>
                                                        <div className="flex flex-row space-x-4">
                                                            <Image
                                                                width={150}
                                                                height={150}
                                                                src={`https://imagedelivery.net/F5uyA07goHgKR71hGfm2Tg/${orderItem.product.image}/public`}
                                                                className="bg-white"
                                                            />
                                                            <div className="">
                                                                <span className="text-lg font-md text-gray-800">{orderItem.product.name}</span>
                                                                <div className="flex flex-col md:mt-2 ">
                                                                    <span className="text-sm text-gray-500">${orderItem?.product?.price}</span>
                                                                    <span className="text-sm text-gray-500">Quantity {orderItem?.quantity}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    ))
                                )
                                : null
                        }
                    </div>
                </div>
            </div >
        </Layout>
    )
}

export default History;