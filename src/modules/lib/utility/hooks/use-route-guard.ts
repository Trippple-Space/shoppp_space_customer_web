import { Route } from "next";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";

export const useRouteGuard = (condition: boolean, redirectTo: Route = '', callback = () => {}): void => {
    const router = useRouter();

    useLayoutEffect(() => {
        if (condition) {
          callback()
          router.push(redirectTo);
        }
    }, [condition, redirectTo, router]);

}
