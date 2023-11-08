import { authService } from "@/modules/lib/utility/services/auth.service";
import { LoginCredentials } from "@/modules/lib/utility/types/auth";
import { paths } from "@/modules/lib/utility/paths";
import { FormikConfig, useFormik } from "formik";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as Yup from 'yup'

const LoginValidationSchema = Yup.object().shape({
    email: Yup.string().trim()
        .test('test-username', 'Enter Valid Phone/Email',
            (value) => {
                const emailRegex = /^([a-zA-Z0-9_\\.-]+)([+][a-zA-Z0-9_\\.-]+)*@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                const phoneRegex = /^\+?\d{7,}$/;
                let isValidEmail = value ? emailRegex.test(value) : false;
                let isValidPhone = value ? phoneRegex.test(value) : false;
                if (!isValidEmail && !isValidPhone) {
                    return false;
                }
                return true;
            }),
    password: Yup.string().min(8, "Minimum password length is 8 characters").max(20, "Max password length is 20 characters").required("Required"),
})


const formikLoginConfig = (router: AppRouterInstance): FormikConfig<LoginCredentials> => ({
    initialValues: {
        email: '',
        password: ''
    },
    onSubmit: (values: LoginCredentials) => {
        authService.signIn(values)
            .then(({ token, user }) => {
                toast.success(`Welcome back!`)
                router.push(paths.homepage)
            })
    },
    validationSchema: LoginValidationSchema
})



export const useLoginView = () => {
    const router = useRouter()
    const formHandler = useFormik(formikLoginConfig(router))
    return { formHandler }
}

