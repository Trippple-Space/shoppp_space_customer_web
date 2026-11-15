import Link from "next/link";
import React from "react";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { TbMail, TbPhone } from "react-icons/tb";
import { Store } from "../../utility/types/store.interface";
import useNewsletterSubscribe from "./useNewsletterSubscribe";

const StorefrontFooter: React.FC<{ store: Store }> = ({ store }) => {
  const {
    loading,
    newsletterError,
    clearNewsletterError,
    handleNewsletterSubmit,
  } = useNewsletterSubscribe({ mode: "email-only" });

  return (
    <footer className="bg-black">
      <div className="py-[20px] lg:px-[80px] sm:px-[40px] px-[24px] text-white flex flex-col sm:gap-[35px] gap-[28px] max-w-[1440px] mx-auto">
        <div className="sm:py-[40px] py-[24px] lg:gap-[40px] gap-[30px] flex sm:flex-row sm:flex-nowrap flex-reverse justify-between items-center">
          <div className="flex flex-col gap-[20px]">
            <h6 className="font-semibold text-[20px]">Contact us</h6>
            <p className="flex flex-col gap-[14px]">
              <Link href={`tel:${store?.user?.mobile || store?.profile?.phoneNumbers?.[0]}`} className="flex flex-row gap-[8px] w-fit">
                <TbPhone className="w-[24px] h-[24px]" />
                <span className="text-[16px]">{store?.user?.mobile || store?.profile?.phoneNumbers?.[0]}</span>
              </Link>
              <Link
                href={`https://maps.google.com/?q=${store?.meta?.settings?.location?.coordinates?.lat || store?.meta?.coordinates?.lat},${store?.meta?.settings?.location?.coordinates?.lon || store?.meta?.coordinates?.lon}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-row gap-[8px] w-fit"
              >
                <HiOutlineLocationMarker className="w-[24px] min-w-[24px] h-[24px]" />
                <span className="text-[16px]">
                  {store?.meta?.settings?.location?.address || JSON.parse(store?.registrationProposal?.data)?.storeAddress}
                </span>
              </Link>
            </p>
          </div>
          <form
            onSubmit={handleNewsletterSubmit}
            className="flex flex-col gap-[12px] lg:max-w-[461px] max-w-[416px] w-full"
          >
            <p className="font-semibold text-[16px]">Subscribe for latest updates</p>
            <div className="flex justify-end gap-[8px]">
              <div className="bg-white flex items-center gap-[12px] px-[12px] rounded-[6px] border border-[#00000026] sm:flex-grow-1 w-full">
                <TbMail className="w-[24px] min-w-[24px] h-[24px] text-[#00000099]" />
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  className="py-[12px] px-0 border-none outline-none placeholder:sm:text-[16px] placeholder:text-[14px] w-full"
                  onChange={clearNewsletterError}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="py-[12px] px-[16px] bg-[#FACE33] rounded-[6px] font-semibold text-[16px] border border-none text-[#000000E0]"
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </button>
            </div>
            {newsletterError && (
              <p className="text-[14px] text-[#FF7070]">{newsletterError}</p>
            )}
          </form>
        </div>
        <hr className="bg-[#FFFFFF4D]" />
        <div>
          <p className="text-[16px] text-center">
            Powered by Shoppp Space
          </p>
        </div>
      </div>
    </footer>
  );
}

export default StorefrontFooter