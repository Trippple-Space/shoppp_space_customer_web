import { useState, useEffect, useCallback, FC } from "react";
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
  const [buttonsState, setButtonsState] = useState({
    showScrollButtons: false,
    showLeftButton: false,
    showRightButton: false,
  });

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
    const target = scrollRef?.current;
    if (!target) return;
    const scrollWidth = target.scrollWidth;
    const clientWidth = target.clientWidth;
    const hasOverflow = scrollWidth > clientWidth;
    const atStart = target.scrollLeft <= 0;
    const atEnd =
      Math.ceil(target.scrollLeft + clientWidth) >= Math.floor(scrollWidth);

    const next = {
      showScrollButtons: hasOverflow,
      showLeftButton: hasOverflow && !atStart,
      showRightButton: hasOverflow && !atEnd,
    };

    setButtonsState((prev) => {
      if (
        prev.showScrollButtons === next.showScrollButtons &&
        prev.showLeftButton === next.showLeftButton &&
        prev.showRightButton === next.showRightButton
      ) {
        return prev;
      }
      return next;
    });
  }, [scrollRef]);

  useEffect(() => {
    checkOverflowAndPosition();
    window.addEventListener("resize", checkOverflowAndPosition);

    return () => window.removeEventListener("resize", checkOverflowAndPosition);
  }, [checkOverflowAndPosition]);

  useEffect(() => {
    const target = scrollRef?.current;
    if (!target) return;

    target.addEventListener("scroll", checkOverflowAndPosition);
    return () => {
      target.removeEventListener("scroll", checkOverflowAndPosition);
    }
  }, [scrollRef, checkOverflowAndPosition]);

  return (
    <>
      {buttonsState.showScrollButtons && (
        <>
          {buttonsState.showLeftButton && (
            <div
              onClick={() => scrollCategories("left")}
              className={`${
                component === "categories"
                  ? "t-10p l--10  px-6 py-6 l:bg-white bg-#F5F5F5 sm:flex hidden"
                  : "t-40p l-0 p-12 bg-#FFFFFFCC md:flex hidden"
              } absolute z-1 l:border border-#00000014 pointer round j-content-center items-center margin-left:12px;`}
            >
              <HiOutlineChevronLeft
                className={
                  component === "categories" ? "w-16 h-16" : "w-24 h-24"
                }
              />
            </div>
          )}

          {buttonsState.showRightButton && (
            <div
              onClick={() => scrollCategories("right")}
              className={`${
                component === "categories"
                  ? "t-10p r--10  px-6 py-6 l:bg-white bg-#F5F5F5 sm:flex hidden"
                  : "t-40p r-0 p-12 bg-#FFFFFFCC md:flex hidden"
              } absolute z-1 l:border border-#00000014 pointer round j-content-center items-center margin-left:12px;`}
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
