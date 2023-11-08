import { authService } from "@/modules/lib/utility/services/auth.service"
import { RegistrationDetails } from "@/modules/lib/utility/types/auth"
import { paths } from "@/modules/lib/utility/paths";
import { FormikConfig, useFormik } from "formik"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as Yup from 'yup';

export const SignUpValidationSchema = Yup.object().shape({
    fullname: Yup.string().trim().min(4, 'Can your fullname be that short? I\'m not convinced').max(25, 'Over 25 characters. Kilode. Na essay?').required('Required'),
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
            }).required('Required'),
    password: Yup.string().min(8, "Minimum password length is 8 characters").max(20, "Max password length is 20 characters").required("Required"),
    acceptTerms: Yup.boolean().oneOf([true], 'Kindly accept our terms of service to proceed.').required('Kindly accept our terms of service to proceed.')
});

const formikSignUpConfig = (router: AppRouterInstance): FormikConfig<RegistrationDetails> => ({
    initialValues: {
        fullname: '',
        email: '',
        password: '',
        acceptTerms: false
    },
    onSubmit: (values: RegistrationDetails) => {
        authService.signUp(values)
            .then((user) => {
                toast.success(`Hey ${user.username}. Welcome to Asoebi Africa! Login here.`)
                router.push(paths.login)
            })
    },
    validationSchema: SignUpValidationSchema
})

export const useSignUpView = () => {
    const router = useRouter()
    const formHandler = useFormik(formikSignUpConfig(router))

    return { formHandler }
}
