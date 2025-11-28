import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormikConfig, useFormik } from "formik";
import { toast } from "sonner";
import * as Yup from "yup";
import { authService } from "@/modules/lib/utility/services/auth.service";
import { RegistrationDetails } from "@/modules/lib/utility/types/auth.interface";
import { paths } from "@/modules/lib/utility/paths";
import { useLoginView } from "./use-login";
import useUserStore from "../store/user.store";
import { useRouteGuard } from "./use-route-guard";
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
    .min(8, "Minimum password length is 8 characters")
    .max(20, "Max password length is 20 characters")
    .required("Required")
});




export const useSignUpView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { formHandler: loginFormHandler } = useLoginView()
  const { isAuthenticated, authenticateUser } = useUserStore()
  const { isLoginModal } = useCartStore()

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
      localStorage.setItem('signup-email', values.email);
      router.push(`${paths.verify}?token=${response.token}`);
      isLoginModal()

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
      localStorage.setItem("create-password-token", response.createPasswordToken);
      setToken(response.createPasswordToken);
      router.push(paths.create_password);
      setStep("createPassword");
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
          .then((response) => {
            localStorage.setItem("create-password-token", response.createPasswordToken);
            setToken(response.token);
            toast.success("OTP verified via link successfully.");
            setStep("createPassword");
            router.push(paths.create_password);
          })
      } else {
        setStep("verify");
      }
    }
  }, [router, searchParams]);

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
          await authService.setPassword(payload);
          localStorage.removeItem('create-password-token')


          const tempEmail = localStorage.getItem('signup-email');
          authService.signIn({ email: tempEmail ?? '', password: payload.password }).then((response) => {

            authenticateUser(response.user);
            useRouteGuard(isAuthenticated, paths.homepage)
          });

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
