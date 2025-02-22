import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormikConfig, useFormik } from "formik";
import { toast } from "sonner";
import * as Yup from "yup";
import { authService } from "@/modules/lib/utility/services/auth.service";
import { RegistrationDetails } from "@/modules/lib/utility/types/auth.interface";
import { paths } from "@/modules/lib/utility/paths";


const signUpValidationSchema = Yup.object().shape({
  fullname: Yup.string()
    .trim()
    .min(4, "Can your fullname be that short? I'm not convinced")
    .max(25, "Over 25 characters. Kilode. Na essay?")
    .required("Required"),
  email: Yup.string()
    .trim()
    .test("test-username", "Enter Valid Phone/Email", (value) => {
      const emailRegex = /^([a-zA-Z0-9_.\-]+)([+][a-zA-Z0-9_.\-]+)*@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      const phoneRegex = /^\+?\d{7,}$/;
      return value ? emailRegex.test(value) || phoneRegex.test(value) : false;
    })
    .required("Required"),
});

const otpValidationSchema = Yup.object().shape({
  otp: Yup.string().trim().required("OTP is required")
});


const passwordCreationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Minimum password length is 8 characters")
    .max(20, "Max password length is 20 characters")
    .required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Required")
});




export const useSignUpView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<"initial" | "verify" | "createPassword">("initial");

  const [token, setToken] = useState<string>("");


  const formikInitial = useFormik({
    initialValues: {
      fullname: "",
      email: ""
    },
    validationSchema: signUpValidationSchema,
      onSubmit: async (values: { fullname: string;  email: string}) => {
      try {
      
        const response = await authService.signUpInitial({
          fullname: values.fullname,
          email: values.email
        });
          setToken(response.token);
          toast.success("OTP sent. Please check your email.");
          router.push(`${paths.verify}?token=${token}`);
      } catch (error: any) {
        toast.error(error.message || "Something went wrong during sign-up");
      }
    }
  } as FormikConfig<Pick<{ fullname: string; email: string;}, "fullname" | "email">>);

  // STEP 2: OTP verification form
  const formikOtp = useFormik({
    initialValues: {
      otp: ""
    },
    validationSchema: otpValidationSchema,
      onSubmit: async (values: { otp: string }) => {
      try {
          const response = await authService.verifyOtp({ token, otp: values.otp });
              localStorage.setItem("create-password-token", response.token);
              setToken(response.token);
              toast.success("OTP verified successfully.");
              router.push(paths.create_password);
              setStep("createPassword");

      } catch (error: any) {
        toast.error(error.message || "OTP verification failed");
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
            .then((response) => {

            localStorage.setItem("password-token", response.token);
            setToken(response.token);
            toast.success("OTP verified via link successfully.");
            setStep("createPassword");
            router.push(paths.create_password);
          })
          .catch((error: any) => {
            toast.error(error.message || "OTP verification via link failed");
          });
      } else {
        setStep("verify");
      }
    }
  }, [router, searchParams]);

  const formikComplete = useFormik({
    initialValues: {
      password: "",
      confirmPassword: ""
    },
    validationSchema: passwordCreationSchema,
    onSubmit: async (values) => {

      try {
        const storedToken = localStorage.getItem("create-password-token");
        if (!storedToken) {
          throw new Error("No valid token found. Please retry the verification process.");
        }
          
        const payload = {
          token: storedToken,
          password: values.password
        };
        const response = await authService.setPassword(payload);
          toast.success(`Hey ${response.username}. Welcome to Asoebi Africa! Login here.`);
          localStorage.removeItem('create-password-token')
        router.push(paths.login);
      } catch (error: any) {
        toast.error(error.message || "Registration failed");
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
