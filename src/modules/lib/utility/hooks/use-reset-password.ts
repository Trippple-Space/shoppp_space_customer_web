import { authService } from "@/modules/lib/utility/services/auth.service";
import { FormikConfig, useFormik } from "formik";
import { toast } from "sonner";
import * as Yup from "yup";
import { paths } from "../paths";

const ResetPasswordValidationSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .min(8, "Must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain an uppercase letter")
    .matches(/[a-z]/, "Must contain a lowercase letter")
    .matches(/[0-9]/, "Must contain a number")
    .matches(/[@$!%*?&]/, "Must contain a special character"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
});

const formikResetConfig = (
  callback?: () => void
): FormikConfig<{ token?: string; password: string; confirmPassword: string }> => ({
  initialValues: {
    token: "",
    password: "",
    confirmPassword: "",
  },
  validationSchema: ResetPasswordValidationSchema,
  onSubmit: async (values, { setSubmitting, setErrors, resetForm }) => {
    try {
      const urlToken =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("token") ??
            window.location.pathname.split("/").filter(Boolean).pop()
          : undefined;

      const token = values.token || urlToken;

      if (!token) {
        toast.error("Reset token is missing. Please check your reset link.");
        return;
      }

      await authService.resetPassword?.({
        token,
        password: values.password,
        confirmPassword: values.confirmPassword,
      }).then(() => {
        location.replace(paths.login);
      });

      callback?.();
      resetForm();
    } catch (err: any) {
      const message = err?.response?.data?.message;
      if (message) setErrors({ password: message });
      else toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  },
});

export const useResetPassword = (callback?: () => void) => {
  const formHandler = useFormik(formikResetConfig(callback));
  return { formHandler };
};
