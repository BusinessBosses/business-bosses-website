
import serviceApi from "../../../../services/serviceApi"

class ShopController {
    async fetchShop(user: string) {
        const response = await serviceApi.fetch(`/shops/`+user);
        return response
    }

    async fetchProducts(user: string) {
        const response = await serviceApi.fetch(`/goods/user-products/`+user);
        return response
    }

    async fetchServices(user: string) {
        const response = await serviceApi.fetch(`/services/user-services/`+user);
        return response
    }
}

export default new ShopController()

