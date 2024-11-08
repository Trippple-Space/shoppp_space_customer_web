import React, { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ImageAlt from "../../image-alt/ImageAlt";

interface ICategoryLink {
  linkTo?: any;
  src?: any;
}

const CategoryComp: FC<ICategoryLink> = ({ linkTo, src }) => {
  const pathname = usePathname();

  return (
    <div>
      <Link
        href={linkTo}
        className="flex flex-col a-items-center gap-7 space-between w-90"
      >
        <ImageAlt
          className={`w-47.02 h-46 border round ${pathname === linkTo ? 'border-2 border-green' : 'border-#00000026'}`}
          type={"image"}
          src={src}
          iconClassName="w-47.02 h-46"
        />
        <span className={`weight-600 text-small text-center capitalize ${pathname === linkTo && 'text-green'}`}>
          {linkTo === '/' ? 'All' : linkTo.substring(1)}
        </span>
      </Link>
    </div>
  );
};

export default CategoryComp;
