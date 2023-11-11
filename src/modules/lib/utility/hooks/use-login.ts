import { authService } from "@/modules/lib/utility/services/auth.service";
import { LoginCredentials } from "@/modules/lib/utility/types/auth";
import { paths } from "@/modules/lib/utility/paths";
import { FormikConfig, useFormik } from "formik";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import * as Yup from 'yup'
import useUserStore from "@/store/user.store";
import { User } from "../types/user";
import { useRouteGuard } from "./use-route-guard";

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


const formikLoginConfig = (router: AppRouterInstance, callback?: (user: User) => void): FormikConfig<LoginCredentials> => ({
    initialValues: {
        email: '',
        password: ''
    },
    onSubmit: (values: LoginCredentials) => {
        authService.signIn(values)
            .then(({ user }) => {
                toast.success(`Welcome ${user.profile.firstName}`)
                callback?.(user)
            })
    },
    validationSchema: LoginValidationSchema
})

export const useLoginView = () => {
    const router = useRouter()
    const {isAuthenticated, authenticateUser} = useUserStore()
    const formHandler = useFormik(formikLoginConfig(router, (user) => { authenticateUser(user) }))

    useRouteGuard(isAuthenticated, paths.homepage)

    return { formHandler }
}

