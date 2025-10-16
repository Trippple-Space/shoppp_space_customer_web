import useAddressStore from "../../store/address.store"
import useUserStore from "../../store/user.store"
import { useSignOut } from "../use-sign-out"

export const useNavbarView = () => {
    const { user } = useUserStore()
    const { signOut } = useSignOut()
    const { openAddressModal } = useAddressStore()


    return { user, signOut, openAddressModal }
}