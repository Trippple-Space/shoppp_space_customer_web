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
        <div className="w-100p h-100p mx-auto flex flex-col items-center j-content-center p-20 l:p-70">
          <Icon name="amico" className="w-80p l:100p h-250 my-10" />
          <h1 className="text-24 l:text-30 line-height-40 my-15 weight-700" key={order?.id}>
            Success! Order number #{getLastFiveIdChars(order?.id)}
          </h1>
          <p className="text-16 l:text-18 line-height-30">
            we have already started preparing your order.
          </p>
          <p className="text-16 l:text-18 line-height-30">
            Delivery within {Number(order?.deliveryFee) === 6_500 ? "24" : "72"} hrs
          </p>
          <Link
            href={"/"}
            className="bg-green radius-10 text-white text-16 weight-500 my-20 py-12 px-20"
          >
            Go Home
          </Link>
        </div>
      ) : (
        <div className="w-100p h-100p mx-auto flex items-center j-content-center my-3">
         <DotsLoader />
        </div>
      )}
      <Footer />
    </>
  );
};

export default SuccessMessage;
