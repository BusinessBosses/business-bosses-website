import serviceApi from "../../../services/serviceApi"

class MarketController {
    async fetchMarkets(page: number) {
        const response = await serviceApi.fetch(`/markets/all?size=20&page=${page}`);
        return response
    }
}



export default new MarketController()