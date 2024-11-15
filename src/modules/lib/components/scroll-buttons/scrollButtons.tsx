import { useState, useEffect, useRef, useCallback, FC } from "react";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";

interface IScrollButtons {
  scrollRef: any;
  page: any;
  scrollLength: number;
  component: any;
}

const ScrollButtons: FC<IScrollButtons> = ({
  scrollRef,
  page,
  scrollLength,
  component,
}) => {
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);

  const scrollCategories = useCallback((direction: any) => {
    if (scrollRef) {
      scrollRef.current.scrollBy({
        behavior: "smooth",
        left:
          direction === "left"
            ? component === "categories"
              ? -180
              : -400
            : component === "categories"
            ? 180
            : 400,
      });
    }
  }, []);

  const checkOverflowAndPosition = useCallback(() => {
    const categoriesWidth = screen.width >= 576 ? 90 : 71;
    const storeFrontCats = screen.width >= 576 ? 125 : 96;
    const scrollContainerWidth =
      page === "home"
        ? categoriesWidth * scrollLength
        : page === "store"
        ? storeFrontCats * scrollLength
        : 238 * scrollLength;

    if (scrollRef.current) {
      const hasOverflow = scrollContainerWidth > scrollRef.current.clientWidth;
      setShowScrollButtons(hasOverflow);

      const atStart = scrollRef.current.scrollLeft === 0;
      const atEnd =
        scrollRef.current.scrollLeft + scrollRef.current.clientWidth >=
        scrollContainerWidth;

      setShowLeftButton(!atStart);
      setShowRightButton(!atEnd);
    }
  }, []);

  useEffect(() => {
    checkOverflowAndPosition();
    window.addEventListener("resize", checkOverflowAndPosition);

    return () => window.removeEventListener("resize", checkOverflowAndPosition);
  }, []);

  useEffect(() => {
    if (scrollRef) {
      scrollRef?.current.addEventListener("scroll", checkOverflowAndPosition);
    }
  }, []);

  return (
    <>
      {showScrollButtons && (
        <>
          {showLeftButton && (
            <div
              onClick={() => scrollCategories("left")}
              className={`${
                component === "categories"
                  ? "t-10p l--10  px-6 py-6 l:bg-white bg-#F5F5F5 sm:flex hidden"
                  : "t-40p l-24 p-12 bg-#FFFFFFCC md:flex hidden"
              } absolute l:border border-#00000014 pointer round j-content-center items-center margin-left:12px;`}
            >
              <HiOutlineChevronLeft
                className={
                  component === "categories" ? "w-16 h-16" : "w-24 h-24"
                }
              />
            </div>
          )}

          {showRightButton && (
            <div
              onClick={() => scrollCategories("right")}
              className={`${
                component === "categories"
                  ? "t-10p r--10  px-6 py-6 l:bg-white bg-#F5F5F5 sm:flex hidden"
                  : "t-40p r-24 p-12 bg-#FFFFFFCC md:flex hidden"
              } absolute l:border border-#00000014 pointer round j-content-center items-center margin-left:12px;`}
            >
              <HiOutlineChevronRight
                className={
                  component === "categories" ? "w-16 h-16" : "w-24 h-24"
                }
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ScrollButtons;
