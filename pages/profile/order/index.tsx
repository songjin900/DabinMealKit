import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect, useState } from "react";
import { Cart, Order, UserDetail } from "@prisma/client";
import { useRouter } from "next/router";
import useSWR from "swr"
import useUser from "@libs/client/useUser";
import Image from "next/image";

type validateQuantity = {
  message: string;
  type: "update" | "remove";
  productId: number;
}

interface validateQuantityResponse {
  cartQuantityErrorArray: any;
  ok: boolean
  validateQuantity: validateQuantity[]
}


interface UserDetailForm {
  firstName?: string;
  lastName?: string;
  address?: string;
  phone?: string;
  city?: string;
  province?: string;
  postCode?: string;
  formError?: string;
  firstNameB?: string;
  lastNameB?: string;
  addressB?: string;
  phoneB?: string;
  cityB?: string;
  provinceB?: string;
  postCodeB?: string;
  payment?: string;
}

interface UserDetailMutation {
  ok: boolean;
  userDetail: UserDetail;
}

interface orderResponse {
  ok: boolean,
  order: Order,
}

interface CartResponse {
  ok: boolean,
  cart: Cart[],
  totalCostBeforeTax: string,
  totalCostAfterTax: string,
  tax: string,
  shipping: string,
}

const Checkout: NextPage = () => {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const { data: orderData } = useSWR<orderResponse>(`/api/users/me/order`);
  const { data: cartData } = useSWR<CartResponse>(`/api/users/me/cart`);
  const [useSameAddress, setUseSameAddress] = useState(true);
  const { register, handleSubmit, setValue, setError, formState: { errors } } = useForm<UserDetailForm>();
  const [updateAddresses, { loading, data: addressData }] = useMutation("/api/users/me/order/address")
  const [updateSameAddress, { loading: sameAddressLoading, data: sameAddressData }] = useMutation("/api/users/me/order")
  const { data: validateQuantityData } = useSWR<validateQuantityResponse>(`/api/users/me/order/validateQuantity`);

  useEffect(() => {
    if (orderData?.order?.shippingAddress?.firstName) setValue("firstName", orderData?.order?.shippingAddress?.firstName);
    if (orderData?.order?.shippingAddress?.lastName) setValue("lastName", orderData?.order?.shippingAddress?.lastName);
    if (orderData?.order?.shippingAddress?.phone) setValue("phone", orderData?.order?.shippingAddress?.phone);
    if (orderData?.order?.shippingAddress?.address) setValue("address", orderData?.order?.shippingAddress?.address);
    if (orderData?.order?.shippingAddress?.city) setValue("city", orderData?.order?.shippingAddress?.city);
    if (orderData?.order?.shippingAddress?.province) setValue("province", orderData?.order?.shippingAddress?.province);
    if (orderData?.order?.shippingAddress?.postCode) setValue("postCode", orderData?.order?.shippingAddress?.postCode);
    if (orderData?.order?.shippingAddress?.paymentType) setValue("payment", orderData?.order?.shippingAddress?.payment);

  }, [orderData?.order?.shippingAddress, setValue])

  useEffect(() => {
    if (orderData?.order?.billingAddress?.firstName) setValue("firstNameB", orderData?.order?.billingAddress?.firstName);
    if (orderData?.order?.billingAddress?.lastName) setValue("lastNameB", orderData?.order?.billingAddress?.lastName);
    if (orderData?.order?.billingAddress?.phone) setValue("phoneB", orderData?.order?.billingAddress?.phone);
    if (orderData?.order?.billingAddress?.address) setValue("addressB", orderData?.order?.billingAddress?.address);
    if (orderData?.order?.billingAddress?.city) setValue("cityB", orderData?.order?.billingAddress?.city);
    if (orderData?.order?.billingAddress?.province) setValue("provinceB", orderData?.order?.billingAddress?.province);
    if (orderData?.order?.billingAddress?.postCode) setValue("postCodeB", orderData?.order?.billingAddress?.postCode);

  }, [orderData?.order?.billingAddress, setValue])

  useEffect(() => {
    setUseSameAddress(orderData?.order?.useSameAddress && orderData?.order?.useSameAddress === true ? true : false)
  }, [orderData?.order?.useSameAddress])

  const onValid = ({ firstName, lastName, address, city, province, postCode, phone, firstNameB, lastNameB, addressB, cityB, provinceB, postCodeB, phoneB }: UserDetailForm) => {
    if (validateQuantityData?.ok === false) {
      router.push(`/profile/cart`);
      return;
    }

    if (loading)
      return;

    updateAddresses({ firstName, lastName, address, city, province, postCode, phone, firstNameB, lastNameB, addressB, cityB, provinceB, postCodeB, phoneB })
  }

  const onCheckboxClicked = () => {
    if (useSameAddress === true) {
      setUseSameAddress(false);
      updateSameAddress({ useSameAddress: false });
    }
    else {
      setUseSameAddress(true);
      updateSameAddress({ useSameAddress: true });
    }
  }

  useEffect(() => {
    if (addressData?.ok) {
      router.push(`/profile/order/payment`);
    }
  }, [addressData, router])


  return (
    <Layout canGoBack title="Shipping">
      <div className="px-4 md:px-20 py-4 bg-gray-100">
        <form className="p-4 space-y-4 w-full  bg-gray-100" onSubmit={handleSubmit(onValid)}>
          <div className="flex flex-col md:flex-row md:space-x-10 justify-center">
            <div className="w-full md:max-w-[30rem]">
              <div className="w-full flex flex-col space-y-2 pb-2 border-b-2">
                <span >CHECKOUT</span>
                <div className="border-2 p-2 rounded-xl">
                  Email: {user?.email}
                </div>
                <span >Shipping</span>
              </div>
              <div className="flex flex-col md:flex-row md:gap-x-4">
                <Input register={register("firstName", { required: true })} required label="*First Name" name="firstName" type="text" />
                <Input register={register("lastName", { required: true })} required label="*Last Name" name="lastName" type="text" />
              </div>
              <Input register={register("address", { required: true })} required label="*Address" name="address" type="text" />
              <div className="flex flex-col md:flex-row gap-x-4">
                <Input register={register("city", { required: true })} required label="*City" name="name" type="city" />
                <div className="flex gap-x-4">
                  <Input register={register("province", { required: true })} required label="*Province" name="province" type="text" />
                  <Input register={register("postCode", { required: true })} required label="*Postal Code" name="postCode" type="text" />
                </div>
              </div>
              <Input register={register("phone", { required: true })} required label="*Phone" name="phone" type="text" />

              <div className="w-full border-b-2 max-w-[30rem] pt-4">
                <span>Billing Address</span>
                <div className="flex items-center mb-4 pl-2 pt-1">
                  <input type="checkbox" onChange={() => onCheckboxClicked()} checked={useSameAddress} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                  <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Same as shipping address</label>
                </div>
              </div>
              <div className={`${useSameAddress ? `hidden` : `block`}`}>
                <div className="flex flex-col md:flex-row md:gap-x-4 ">
                  <Input register={register("firstNameB", { required: !useSameAddress })} label="*First Name" name="firstNameB" type="text" />
                  <Input register={register("lastNameB", { required: !useSameAddress })} label="*Last Name" name="lastNameB" type="text" />
                </div>
                <Input register={register("addressB", { required: !useSameAddress })} label="Address" name="addressB" type="text" />
                <div className="flex flex-col md:flex-row gap-x-4">
                  <Input register={register("cityB", { required: !useSameAddress })} label="City" name="cityB" type="city" />
                  <div className="flex gap-x-4">
                    <Input register={register("provinceB", { required: !useSameAddress })} label="Province" name="provinceB" type="text" />
                    <Input register={register("postCodeB", { required: !useSameAddress })} label="Postal Code" name="postCodeB" type="text" />
                  </div>
                </div>
                <Input register={register("phoneB", { required: !useSameAddress })} label="Phone" name="phoneB" type="text" />
              </div>
              {/* <div className={`mt-2 ${useSameAddress ? `border-t-0` : `border-t-2`}`}>
                <Input label="Payment" name="Payment" type="payment" kind="payment" checked="stride"/>
              </div> */}
            </div>
            <div className="flex flex-col max-w-md min-w-[20rem]">
              <span>Order Summary</span>
              <div className=" overflow-auto max-h-[36rem] min-h-[20rem] mb-4">
                <>
                  {/* I want to separate this cart from ProductList because of remove feature  and quantity control*/}
                  {cartData?.cart?.map((record) => (
                    // <Link id={record.product.id} key={record.id} legacyBehavior href={`/products/${record.product.id}`}>
                    <div id={record.product.id} key={record.id} className="cursor-pointer border-y-2 border-gray-100 bg-white">
                      <div className="flex">
                        <div className="flex flex-row space-x-2 pl-1 my-1 w-full">
                          <Image
                            width={100}
                            height={100}
                            src={`https://imagedelivery.net/F5uyA07goHgKR71hGfm2Tg/${record.product.image}/public`}
                            className=" bg-white"
                            alt=""
                          />
                          <div className="flex flex-col  w-full">
                            <div className="flex justify-between ">
                              <span className="text-lg font-md text-gray-800">{record.product.name}</span>
                              <span className="text-sm text-gray-500 flex items-center">${record.product.price}</span>
                            </div>
                            <div className="flex flex-col md:mt-2">
                              <span className="text-sm text-gray-500">model-1-2-3</span>
                              <span className="text-sm text-gray-500">Quantity: {record.quantity}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              </div>
              <div className="flex flex-col border-t-2 space-y-2">
                <div className="flex justify-between py-1">
                  <span className="text-sm">Subtotal</span>
                  <span className="text-sm">{cartData?.totalCostBeforeTax}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-sm">Shipping</span>
                  <span className="text-sm">{cartData?.shipping}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-sm">Tax</span>
                  <span className="text-sm">{cartData?.tax}</span>
                </div>
                <div className="flex justify-between border-t-2 pt-2">
                  <span className="text-sm">Order Total</span>
                  <span className="text-sm">{cartData?.totalCostAfterTax}</span>
                </div>
                <Button text={"Proceed to Payment / Payment Method"} />
              </div>
            </div>
          </div>
        </form>

      </div>
    </Layout>
  );
};

export default Checkout;