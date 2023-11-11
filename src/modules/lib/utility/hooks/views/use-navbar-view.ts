import useUserStore from "../../store/user.store"

export const useNavbarView = () => {
    const {user} = useUserStore()

    return {user}
}