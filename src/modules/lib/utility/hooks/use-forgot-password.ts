import { authService } from "@/modules/lib/utility/services/auth.service";
import { paths } from "@/modules/lib/utility/paths";
import { FormikConfig, useFormik } from "formik";
import { toast } from "sonner";
import * as Yup from "yup";
import useUserStore from "@/store/user.store";
import { useRouteGuard } from "./use-route-guard";
import { emailRegex } from "../utility";

/* ---------------------- Forgot Password ---------------------- */
const ForgotPasswordValidationSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .test("test-email", "Enter valid email", (value) =>
      value ? emailRegex.test(value) : false
    )
    .required("Required"),
});

const formikForgotConfig = (
  callback?: () => void
): FormikConfig<{ email: string }> => ({
  initialValues: { email: "" },
  validationSchema: ForgotPasswordValidationSchema,
  onSubmit: async (values, { setSubmitting, setErrors, resetForm }) => {
    try {
      await authService.forgotPassword?.(values.email);
      callback?.();
      resetForm();
    } catch (err: any) {
      const message = err?.response?.data?.message;
      if (message) setErrors({ email: message });
      else toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  },
});

export const useForgotPassword = (isLoginModal?: boolean) => {
  const { isAuthenticated } = useUserStore();
  const formHandler = useFormik(formikForgotConfig());
  useRouteGuard(!isLoginModal && isAuthenticated, paths.homepage);
  return { formHandler };
};

