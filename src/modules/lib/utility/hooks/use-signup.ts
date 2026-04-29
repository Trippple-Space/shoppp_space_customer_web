import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormikConfig, useFormik } from "formik";
import { toast } from "sonner";
import * as Yup from "yup";
import { authService } from "@/modules/lib/utility/services/auth.service";
import { paths } from "@/modules/lib/utility/paths";
import useUserStore from "../store/user.store";
import { syncGuestStateAfterAuth } from "../guest-session";
import { useCartStore } from "../store/cart.store";


const signUpValidationSchema = Yup.object().shape({
  fullname: Yup.string()
    .trim()
    .test("test-fullname", "Full name can only contain letters and spaces", (value) => {
      const nameRegex = /^[a-zA-Z\s]+$/
      return value ? nameRegex.test(value) : false
    })
    .required("Required"),
  email: Yup.string()
    .trim()
    .test("test-username", "Enter Valid Email", (value) => {
      const emailRegex = /^([a-zA-Z0-9_.\-]+)([+][a-zA-Z0-9_.\-]+)*@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      return value ? emailRegex.test(value) : false;
    })
    .required("Required"),
});

const passwordCreationSchema = Yup.object().shape({
  password: Yup.string()
    .min(5, "Minimum password length is 5 characters")
    //.max(20, "Max password length is 20 characters")
    .required("Required")
});




export const useSignUpView = (options?: {
  redirectOnOtpSent?: boolean;
  redirectOnVerified?: boolean;
  onOtpSent?: (token: string, email: string) => void;
  onVerified?: () => void;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { authenticateUser } = useUserStore()
  const fetchCart = useCartStore((state) => state.fetchCart);
  const redirectOnOtpSent = options?.redirectOnOtpSent ?? true;
  const redirectOnVerified = options?.redirectOnVerified ?? true;

  const [step, setStep] = useState<"initial" | "verify" | "createPassword">("initial");

  const [token, setToken] = useState<string>("");


  const formikInitial = useFormik({
    initialValues: {
      fullname: "",
      email: ""
    },
    validationSchema: signUpValidationSchema,
    onSubmit: async (values: { fullname: string; email: string }) => {
      const response = await authService.signUpInitial({
        fullname: values.fullname,
        email: values.email
      });
      if (!response?.token) {
        return;
      }
      localStorage.setItem('signup-email', values.email);
      if (redirectOnOtpSent) {
        router.push(`${paths.verify}?token=${response.token}`);
      } else {
        options?.onOtpSent?.(response.token, values.email);
      }

    }
  } as FormikConfig<Pick<{ fullname: string; email: string; }, "fullname" | "email">>);

  // STEP 2: OTP verification form
  const formikOtp = useFormik({
    initialValues: {
      otp: ""
    },
    onSubmit: async (values: { otp: string }) => {
      const tokenFromUrl = searchParams.get("token") || "";
      const response = await authService.verifyOtp({ token: tokenFromUrl, otp: values.otp });
      if (response?.token && response?.user) {
        authenticateUser(response.user);
        await syncGuestStateAfterAuth(response.user.id);
        fetchCart();
        options?.onVerified?.();
        if (redirectOnVerified) {
          router.push(paths.asoebi_wears);
        }
        return;
      }

      if (response?.createPasswordToken) {
        localStorage.setItem("create-password-token", response.createPasswordToken);
        setToken(response.createPasswordToken);
        router.push(paths.create_password);
        setStep("createPassword");
      }
    }
  } as FormikConfig<{ otp: string }>);


  useEffect(() => {
    const tokenFromUrl = searchParams.get("token") || "";
    const otpFromUrl = searchParams.get("otp");

    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      if (otpFromUrl) {
        authService
          .verifyOtp({ token: tokenFromUrl, otp: otpFromUrl })
          .then(async (response) => {
            if (response?.token && response?.user) {
              authenticateUser(response.user);
              await syncGuestStateAfterAuth(response.user.id);
              fetchCart();
              options?.onVerified?.();
              toast.success("OTP verified successfully.");
              if (redirectOnVerified) {
                router.push(paths.asoebi_wears);
              }
              return;
            }

            if (response?.createPasswordToken) {
              localStorage.setItem("create-password-token", response.createPasswordToken);
              setToken(response.token);
              toast.success("OTP verified via link successfully.");
              setStep("createPassword");
              router.push(paths.create_password);
            }
          })
      } else {
        setStep("verify");
      }
    }
  }, [router, searchParams, authenticateUser, options, redirectOnVerified]);

  //STEP 3: CREATE PASSWORD

  const formikComplete = useFormik({
    initialValues: {
      password: "",
      confirmPassword: ""
    },
    validationSchema: passwordCreationSchema,
    onSubmit: async (values) => {
      if (values.password === values.confirmPassword) {
        try {
          const storedToken = localStorage.getItem("create-password-token");
          if (!storedToken) {
            throw new Error("No valid token found. Please retry the verification process.");
          }

          const payload = {
            token: storedToken,
            password: values.password
          };

          const res = await authService.setPassword(payload)

          if (res?.success) {
            localStorage.removeItem('create-password-token');

            const tempEmail = localStorage.getItem('signup-email');
            authService.signIn({ email: tempEmail ?? '', password: payload.password }).then((response) => {
              authenticateUser(response.user);
              syncGuestStateAfterAuth(response.user.id).finally(() => {
                fetchCart();
                router.push(paths.asoebi_wears);
              });
            });
          } else {
            //toast.error(res?.message || "Something went wrong. Please try again.");
          }

        } catch (error: any) {
          toast.error(error.response.data.message || "Registration failed");
        }
      } else {
        toast.error("Password does not match")
      }
    }
  } as FormikConfig<{ password: string; confirmPassword: string }>);

  return {
    step,
    token,
    formikInitial,
    formikOtp,
    formikComplete
  };
};



// <- FORMER SIGNUP IMPLEMENTATION ->

// const formikSignUpConfig = (router: any): FormikConfig<RegistrationDetails> => ({
//     initialValues: {
//         fullname: '',
//         email: '',
//         password: '',
//         acceptTerms: false
//     },
//     onSubmit: (values: RegistrationDetails) => {
//         authService.signUp(values)
//             .then((user) => {
//                 toast.success(`Hey ${user.username}. Welcome to Asoebi Africa! Login here.`)
//                 router.push(paths.login)
//             })
//     },
//     // validationSchema: SignUpValidationSchema
// })

// export const useSignUpView = () => {
//     const router = useRouter()
//     const formHandler = useFormik(formikSignUpConfig(router))

//     return { formHandler }
// }
