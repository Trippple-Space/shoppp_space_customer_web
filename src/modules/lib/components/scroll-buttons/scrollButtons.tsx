import { useState, useEffect, useCallback, FC, RefObject } from "react";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";

type ScrollDirection = "left" | "right";

interface IScrollButtons {
  scrollRef: RefObject<HTMLDivElement | null>;
  page?: any;
  scrollLength?: number;
  component?: any;

  stepPx?: number;
  stepMultiplier?: number; 
  behavior?: ScrollBehavior;
  leftButtonClassName?: string;
  rightButtonClassName?: string;
  leftIconClassName?: string;
  rightIconClassName?: string;
}

const ScrollButtons: FC<IScrollButtons> = ({
  scrollRef,
  page,
  scrollLength,
  component,
  stepPx,
  stepMultiplier,
  behavior = "smooth",
  leftButtonClassName,
  rightButtonClassName,
  leftIconClassName,
  rightIconClassName,
}) => {
  const [buttonsState, setButtonsState] = useState({
    showLeftButton: false,
    showRightButton: false,
    isLeftDisabled: true,
    isRightDisabled: true,
  });

  const getDefaultStepMultiplier = useCallback(() => {
    return component === "categories" ? 0.55 : 0.85;
  }, [component]);

  const scrollByDirection = useCallback(
    (direction: ScrollDirection) => {
      const target = scrollRef?.current;
      if (!target) return;

      const maxScrollLeft = Math.max(0, target.scrollWidth - target.clientWidth);

      const multiplier =
        typeof stepMultiplier === "number" ? stepMultiplier : getDefaultStepMultiplier();
      const computedStep =
        typeof stepPx === "number" ? stepPx : target.clientWidth * multiplier;

      const delta = direction === "left" ? -computedStep : computedStep;
      const nextLeft = Math.max(
        0,
        Math.min(target.scrollLeft + delta, maxScrollLeft)
      );

      target.scrollTo({ left: nextLeft, behavior });
    },
    [behavior, scrollRef, stepMultiplier, stepPx, getDefaultStepMultiplier]
  );

  const checkOverflowAndPosition = useCallback(() => {
    const target = scrollRef?.current;
    if (!target) return;

    const tolerance = 2; // px; fixes premature "at start/end" detection
    const maxScrollLeft = Math.max(0, target.scrollWidth - target.clientWidth);

    const hasOverflow = maxScrollLeft > tolerance;
    const isLeftDisabled = !hasOverflow || target.scrollLeft <= tolerance;
    const isRightDisabled = !hasOverflow || target.scrollLeft >= maxScrollLeft - tolerance;

    const next = {
      showLeftButton: hasOverflow,
      showRightButton: hasOverflow,
      isLeftDisabled,
      isRightDisabled,
    };

    setButtonsState((prev) => {
      if (
        prev.showLeftButton === next.showLeftButton &&
        prev.showRightButton === next.showRightButton &&
        prev.isLeftDisabled === next.isLeftDisabled &&
        prev.isRightDisabled === next.isRightDisabled
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
    };
  }, [scrollRef, checkOverflowAndPosition]);

  useEffect(() => {
    checkOverflowAndPosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkOverflowAndPosition, scrollLength, page, component]);

  return (
    <>
      {(buttonsState.showLeftButton || buttonsState.showRightButton) && (
        <>
          {buttonsState.showLeftButton && (
            <div
              onClick={() => !buttonsState.isLeftDisabled && scrollByDirection("left")}
              aria-disabled={buttonsState.isLeftDisabled}
              className={`${
                component === "categories"
                  ? "t-10p l--10 px-6 py-6 l:bg-white bg-#F5F5F5 sm:flex hidden"
                  : "t-40p l-0 p-12 bg-#FFFFFFCC md:flex hidden"
              } absolute z-1 l:border border-#00000014 pointer round j-content-center items-center margin-left:12px; ${
                buttonsState.isLeftDisabled ? "opacity-0 pointer-events-none" : ""
              } ${leftButtonClassName ?? ""}`}
            >
              <HiOutlineChevronLeft
                className={
                  leftIconClassName ??
                  (component === "categories" ? "w-16 h-16" : "w-24 h-24")
                }
              />
            </div>
          )}

          {buttonsState.showRightButton && (
            <div
              onClick={() => !buttonsState.isRightDisabled && scrollByDirection("right")}
              aria-disabled={buttonsState.isRightDisabled}
              className={`${
                component === "categories"
                  ? "t-10p r--10 px-6 py-6 l:bg-white bg-#F5F5F5 sm:flex hidden"
                  : "t-40p r-0 p-12 bg-#FFFFFFCC md:flex hidden"
              } absolute z-1 l:border border-#00000014 pointer round j-content-center items-center margin-left:12px; ${
                buttonsState.isRightDisabled ? "opacity-0 pointer-events-none" : ""
              } ${rightButtonClassName ?? ""}`}
            >
              <HiOutlineChevronRight
                className={
                  rightIconClassName ??
                  (component === "categories" ? "w-16 h-16" : "w-24 h-24")
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
