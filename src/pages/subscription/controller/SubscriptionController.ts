import serviceApi from "../../../services/serviceApi"

class SubscriptionController {
    async createSubscriptionIntent(args: PaymentIntentStruct) {
        const response = await serviceApi.post('/subscription', args)
        return response;
    }
}



export interface PaymentIntentStruct {
    price: string,
    plan: string
}



export default new SubscriptionController()