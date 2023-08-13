import { NextPage } from "next";
import Layout from "@components/layout";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { BillingAddress, Order, OrderItem, Product, ShippingAddress } from "@prisma/client";
import Image from "next/image";

interface OrderResponse extends Order {
    billingAddress: BillingAddress,
    shippingAddress: ShippingAddress,
    orderItem: OrderItem
}

interface invoiceResponse {
    ok: boolean,
    order: OrderResponse
}

interface OrderItemWithProduct extends OrderItem {
    product: Product
}

const Invoice: NextPage = () => {
    const router = useRouter()
    const { data, mutate: boundMutate } = useSWR<invoiceResponse>(router.query.id ? `/api/users/me/order/${router.query.id}/invoice` : null)
    const [order, setOrder] = useState<OrderResponse | null>(null);
    useEffect(() => {
        if (data)
            setOrder(data?.order);
    }, [data])

    return (
        <Layout title="Invoice" hasTabBar>
            <div className="px-4 md:px-20 py-4 bg-gray-100">
                <div className="flex flex-col md:flex-row md:space-x-4 justify-center">
                    <div className="w-full md:min-w-[30rem] md:max-w-[50rem] bg-white">
                        {
                            order?.status !== 'complete' ? <div>  Went Wrong </div> :
                                <div className="p-2">
                                    <div className="flex justify-center text-2xl m-4">Sunny&apos;s Express</div>
                                    <div className="flex justify-center text-2xl m-4">Order#: {order.orderNumber}</div>
                                    <div className="grid grid-cols-2 grid-rows-1 rounded-xl border-2 p-2">
                                        <div className="">
                                            <div className="font-bold text-lg">Date Placed</div>
                                            <div>Order Total</div>
                                            <div>Status</div>
                                        </div>
                                        <div className="">
                                            <div>{order.orderPlacedDate}</div>
                                            <div>{order.totalCostAfterTax}</div>
                                            <div>{order.deliveryStatus}</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 grid-rows-2 rounded-xl border-2 p-2 mt-2">
                                        <div className="">
                                            <div className="font-bold text-lg">Payment Method</div>
                                            <div>{order.paymentType} or Paypal</div>
                                        </div>
                                        <div className="">
                                            <div className="font-bold text-lg">{order?.deliveryStatus === "Delivery Complete" ? "Delivered Date" : "Estimated Shipping Schedule"}</div>
                                            <div>{order?.deliveryStatus === "Delivery Complete" || order?.deliveryStatus === "Delivery Scheduled" ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(new Date(order?.deliveryDate)) : ""} {order?.deliveryStatus === "Delivery Scheduled" ? " between 6-9pm" : ""}</div>
                                        </div>
                                        <div className="">
                                            <div className="font-bold text-lg">Billing Address</div>
                                            <div>Name: {order.billingAddress?.firstName} {order.billingAddress?.lastName} </div>
                                            <div>Address: {order.billingAddress?.address},</div>
                                            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                {order.billingAddress?.city}, {order.billingAddress?.province}, {order.billingAddress?.postCode}</div>
                                            <div>Phone: {order.billingAddress?.phone}</div>
                                        </div>
                                        <div className="">
                                            <div className="font-bold text-lg">Shipping Address</div>
                                            <div>Name: {order.shippingAddress?.firstName} {order.shippingAddress?.lastName} </div>
                                            <div>Address: {order.shippingAddress?.address}, </div>
                                            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                {order.shippingAddress?.city}, {order.shippingAddress?.province}, {order.shippingAddress?.postCode}</div>
                                            <div>Phone: {order.shippingAddress?.phone}</div>
                                        </div>
                                    </div>
                                    <div className="flex justify-center m-2 text-xl">Items</div>
                                    {order?.orderItem?.map((orderItem: OrderItemWithProduct) => (
                                        // <div key={item.id}>{item.productId}</div>
                                        <div key={orderItem.id} className="flex flex-col border-2 rounded-xl p-1 hover:border-orange-400 cursor-pointer ">
                                            <Link legacyBehavior href={`/products/${orderItem.productId}`}>
                                                <div className="flex flex-row space-x-4">
                                                    <Image
                                                        height={100}
                                                        width={100}

                                                        src={`https://imagedelivery.net/F5uyA07goHgKR71hGfm2Tg/${orderItem?.product.image}/public`}
                                                        className= "bg-white"
                                                        alt=""
                                                    />
                                                    <div className="">
                                                        <span className="text-lg font-md text-gray-800">{orderItem.product?.name}</span>
                                                        <div className="flex flex-col md:mt-2 ">
                                                            <span className="text-sm text-gray-500">${orderItem?.product?.price}</span>
                                                            <span className="text-sm text-gray-500">Quantity {orderItem?.quantity}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                    <div className="mt-4">
                                        <div className="flex justify-between">
                                            <div>
                                                Subtotal
                                            </div>
                                            <div>
                                                ${order?.totalCostBeforeTax ? parseFloat(order.totalCostBeforeTax).toFixed(2) : ''}
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <div>
                                                Shipping
                                            </div>
                                            <div>
                                                ${order?.shipping ? parseFloat(order.shipping).toFixed(2) : ''}
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <div>
                                                Tax
                                            </div>
                                            <div>
                                                ${order?.tax ? parseFloat(order.tax).toFixed(2) : ''}
                                            </div>
                                        </div>
                                        <div className="flex justify-between border-t-2 mt-2 pt-2">
                                            <div>
                                                Order Total
                                            </div>
                                            <div>
                                                ${order?.totalCostAfterTax ? parseFloat(order.totalCostAfterTax).toFixed(2) : ''}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        }
                    </div>
                </div>
            </div >
        </Layout>
    )
}

export default Invoice;