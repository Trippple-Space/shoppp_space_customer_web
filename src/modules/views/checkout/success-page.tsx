"use client";
import { DotsLoader } from "@/modules/lib/components/dots-loader/DotsLoader";
import Footer from "@/modules/lib/components/footer/Footer";
import Icon from "@/modules/lib/components/icon/Icon";
import HomepageNavBar from "@/modules/lib/components/nav-bar/HomepageNavBar";
import { useOrders } from "@/modules/lib/utility/hooks/use-orders";
import { getLastFiveIdChars } from "@/modules/lib/utility/utility";
import Link from "next/link";

const SuccessMessage = () => {
  const { orders } = useOrders({});
  const order = orders?.slice(-1)[0];

  return (
    <>
      <HomepageNavBar parent='checkout' />
      {order ? (
        <div className="w-full h-full mx-auto flex flex-col items-center justify-center p-[20px] lg:p-[70px]">
          <Icon name="amico" className="w-[80%] lg:100p h-[250px] my-[10px]" />
          <h1 className="text-[24px] lg:text-[30px] leading-[40px] my-[15px] font-bold" key={order?.id}>
            Success! Order number #{getLastFiveIdChars(order?.id)}
          </h1>
          <p className="text-[16px] lg:text-[18px] leading-[30px]">
            we have already started preparing your order.
          </p>
          <p className="text-[16px] lg:text-[18px] leading-[30px]">
            Delivery within {Number(order?.deliveryFee) === 6_500 ? "24" : "72"} hrs
          </p>
          <Link
            href={"/"}
            className="bg-brand rounded-[10px] text-white text-[16px] font-medium my-[20px] py-[12px] px-[20px]"
          >
            Go Home
          </Link>
        </div>
      ) : (
        <div className="w-full h-full mx-auto flex items-center justify-center my-[3px]">
         <DotsLoader />
        </div>
      )}
      <Footer />
    </>
  );
};

export default SuccessMessage;
