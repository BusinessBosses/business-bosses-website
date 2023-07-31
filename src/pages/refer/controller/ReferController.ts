import serviceApi from "../../../services/serviceApi";

class ReferController {
    static async getReferableUsers(referredUserId: string) {
        const response = await serviceApi.fetch(`/connection/connecteds/referals/${referredUserId}`);
        return response
    }

    static async referConnections(args: ReferStruct) {
        const response = await serviceApi.post('/referal/refer', args);
        return response;
    }
}


export default ReferController;


interface ReferStruct {
    referredUserUid: string,
    referBy: string,
    referTo: string[]
}