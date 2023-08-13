import type { NextPage } from "next";
import Link from "next/link";
import Layout from "@components/layout";
import useMutation from "@libs/client/useMutation";
import { useCallback, useEffect, useState } from "react";
import { Cart, Product } from "@prisma/client";
import { useRouter } from "next/router";
import ItemsWide from "@components/itemsWide";
import useSWR, { mutate, useSWRConfig } from 'swr'
import Image from "next/image";

interface validateQuantity {
    message: string;
    type: "update" | "remove";
    productId: number;
    name: string;
    price: number;
    quantity: number;
}


// interface validateQuantityResponse {
//     cartQuantityErrorArray: any;
//     ok: boolean
//     validateQuantity: validateQuantity[]
// }

interface cartError {
    message: string,
    type: string,
    productId: number,
    price: number,
    name: string,
    quantity: number,
    image: string
}

interface CartMutationResponse {
    ok: boolean,
    data: Cart[],
    cartQuantityErrorArray?: cartError[],
    buttonDisable: boolean
}

interface CartResponse {
    ok: boolean,
    cart: CartWithProduct[],
}

type CostDetail = {
    totalCostBeforeTax: string;
    totalCostAfterTax: string;
    tax: string;
    shipping: string;
}

interface CartWithProduct extends Cart {
    product: Product
}

const CartPage: NextPage = () => {
    const router = useRouter()
    const [submitType, setSubmitType] = useState("update");
    const { data, mutate } = useSWR<CartResponse>(`/api/users/me/cart`);
    
    const [updateCart, { loading: cartLoading, data: cartData }] = useMutation<CartMutationResponse>(`/api/users/me/cart`);
    const [makeOrder, { loading: orderLoading, data: orderData }] = useMutation(`/api/users/me/order`);
    const [cartError, setCartError] = useState(cartData?.cartQuantityErrorArray);
    const [buttonDisabled, setButtonDisabled] = useState(true);

    // const [cartArray, setCartArray] = useState(data?.cart);
    const [cost, setCost] = useState<CostDetail>({
        totalCostBeforeTax: "0.00",
        totalCostAfterTax: "0.00",
        tax: "0.00",
        shipping: "8.00"
    });


    const costSummary = useCallback(() => {
        if (data?.cart && data?.cart?.length > 0) {
            const totalCostBeforeTax = data?.cart?.map((product) => {
                return product.quantity * product.product.price
            }).reduce((accumulator, currentValue) => {
                return accumulator + currentValue
            })
            const taxNumber = (totalCostBeforeTax + 8) * 0.13;
            const totalCostAfterTaxNumber = totalCostBeforeTax + 8 + taxNumber;

            setCost({
                totalCostBeforeTax: totalCostBeforeTax.toFixed(2),
                totalCostAfterTax: totalCostAfterTaxNumber.toFixed(2),
                tax: taxNumber.toFixed(2),
                shipping: "8.00"
            });
        }
    }, [data]);

    useEffect(() => {
        costSummary();
    }, [costSummary])

    const onQtyIncreaseClicked = (quantityInCartT: number, productIdInCart: number) => {
        if (!data || !data?.cart)
            return

        const index = data.cart.findIndex(item => item.productId === productIdInCart);

        if (index === -1) {
            return;
        }
        if (data.cart[index].quantity + 1 > data?.cart[index].product.preStockQuantity)
            return;

        mutate({
            ...data,
            cart: [
                ...data.cart.slice(0, index),
                { ...data.cart[index], quantity: data.cart[index].quantity + 1 },
                ...data.cart.slice(index + 1)
            ]
        }, false);
        setSubmitType("update");

    }

    useEffect(() => {
        if (!data || !data?.cart)
            return;

        updateCart({ cartArray: data.cart });
    }, [data]);



    const onQtyDecreaseClicked = (quantityInCartT: number, productIdInCart: number) => {
        if (!data || !data?.cart)
            return

        const index = data.cart.findIndex(item => item.productId === productIdInCart);
        if (index === -1) {
            return;
        }
        if (data.cart[index].quantity - 1 < 1)
            return;

        mutate({
            ...data,
            cart: [
                ...data.cart.slice(0, index),
                { ...data.cart[index], quantity: quantityInCartT - 1 }, // the updated item
                ...data.cart.slice(index + 1)
            ]
        }, false);
        setSubmitType("update");
    }
    //

    const onRemoveClicked = (productIdInCart: number) => {

        if (!data || !data?.cart)
            return

        const index = data.cart.findIndex(item => item.productId === productIdInCart);
        if (index === -1) {
            return;
        }

        mutate({
            ...data,
            cart: [
                ...data.cart.slice(0, index), // all items before the updated item
                { ...data.cart[index], quantity: 0 }, // the updated item
                ...data.cart.slice(index + 1) // all items after the updated item
            ]
        }, false);
        setSubmitType("update");
    }

    const onCheckoutClicked = () => {
        if (!data || !data?.ok) {
            return;
        }
        if (data.cart) {
            updateCart({ cartArray: data.cart });

            if (cartError && cartError.length > 0) {
                return; // something is wrong with quantity
            }

            makeOrder({ useSameAddress: true });
            setSubmitType("checkout");
        }
    }

    useEffect(() => {
        if (submitType === "checkout") {
            router.push(`/profile/order`);
        }

    }, [cartData, router, submitType])


    //test this later if this is needed
    useEffect(() => {
        setCartError(cartData?.cartQuantityErrorArray)
        setButtonDisabled(false)
    }, [cartData?.cartQuantityErrorArray])

    return (
        <Layout title="My Cart" hasTabBar>
            <div className="px-4 md:px-20 py-4 bg-gray-100 min:h-screen-50">
                <div className="flex flex-col md:flex-row md:space-x-4 justify-center">
                    <div className="md:hidden p-2">
                        <button onClick={onCheckoutClicked} disabled={buttonDisabled} className={`w-full bg-[#3A4884]  hover:bg-[#5246BA] text-white  px-4 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none py-2 text-sm ${buttonDisabled ? `bg-gray-300 hover:bg-gray-300` : `bg-[#3A4884]`}`}>Continue To Checkout</button>                    
                    </div>
                    <div className="w-full md:min-w-[30rem] md:max-w-[50rem] md:min-h-[36rem]">
                        <>
                            {/* I want to separate this cart from ProductList because of remove feature  and quantity control */}

                            {data?.cart?.filter((record) => record.quantity > 0).map((record) => (
                                <div id={record.id.toString()} key={record.id} className="p-2 cursor-pointer border-y-8 border-gray-100 bg-white">
                                    <div className="flex flex-col md:flex-row">
                                        <Link legacyBehavior href={`/products/${record.product.id}`}>

                                            <div className="flex justify-center items-center">
                                                {/* <div className="bg-red-300 w-64 h-40 rounded-lg"></div> */}
                                                <Image
                                                    width={200}
                                                    height={200}
                                                    src={`https://imagedelivery.net/F5uyA07goHgKR71hGfm2Tg/${record.product.image}/public`}
                                                    className="bg-white" alt={""} />
                                            </div>
                                        </Link>

                                        <div className="flex flex-col pl-2 mt-2 w-full">
                                            <span className="text-lg font-md text-gray-800">{record.product.name}</span>
                                            <div className="flex flex-col md:mt-2 md:items-end">
                                                <span className="text-sm text-gray-500">model-1-2-3</span>
                                                <span className="text-sm text-gray-500">${record.product.price}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between mt-4 flex-row  md:gap-x-4 border-t-2 p-1 items-center bg-slate-200">
                                        <div className="flex items-center gap-x-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                            <button disabled={cartLoading} onClick={() => onRemoveClicked(record.product.id)}>
                                                <span className="text-sm font-medium">Remove</span>
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-x-2">

                                            <button disabled={cartLoading} onClick={() => onQtyDecreaseClicked(record.quantity, record.product.id)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </button>
                                            <span>{record.quantity}</span>

                                            <button disabled={cartLoading} onClick={() => onQtyIncreaseClicked(record.quantity, record.product.id)}>

                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>

                    </div>
                    <div className="p-2 border-t-2 flex flex-col md:min-w-[15rem] md:w-[35rem]">
                        <>
                            {cartError ?
                                <div>
                                    {cartError?.map((qRecord) => (
                                        <ItemsWide
                                            id={qRecord.productId}
                                            key={qRecord.productId}
                                            title={qRecord.name}
                                            price={qRecord.price}
                                            comments={qRecord.message}
                                            kind={"small"}
                                            // image={qRecord.image}
                                        />
                                    ))}
                                </div>
                                : null}
                        </>
                        <span className="text-xl font-medium">Order Summary</span>
                        <div className="flex justify-between mt-2">
                            <div className="flex flex-col space-y-1">
                                <span>Product Subtotal</span>
                                <span>Estimated Shipping</span>
                                <span>Estimated Taxes</span>
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                                <span>${cost.totalCostBeforeTax}</span>
                                <span>${cost.shipping}</span>
                                <span>${cost.tax}</span>
                            </div>
                        </div>
                        <div className="flex justify-between border-t-2 mt-3">
                            <span className="my-3">Estimated Total</span>
                            <span className="my-3">${cost.totalCostAfterTax}</span>
                        </div>
                        <button onClick={onCheckoutClicked} disabled={buttonDisabled} className={`w-full bg-[#3A4884]  hover:bg-[#5246BA]  text-white px-4 border border-transparent rounded-sm shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-3A4884  focus:outline-none py-2 text-sm ${buttonDisabled ? `bg-gray-300 hover:bg-gray-300` : `bg-[#3A4884]`}`}>Continue To Checkout</button>
                    </div>
                </div>
            </div >
        </Layout>
    )
}

export default CartPage;