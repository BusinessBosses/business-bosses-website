import { Industry } from "../../../common/interfaces/industry"
import AppConstants from "../../../constants/consts"
import serviceApi from "../../../services/serviceApi"
import ForumController from "../../forum/controller/ForumController"

class CommunitiesController {
    async fetchData() {
        const industries = await serviceApi.fetch('/industry/get')
        const forums = await ForumController.fetchForums(AppConstants.BOSSUPINDUSTRYID, 0)
        return { forums, industries }
    }

    getIndustriesByCategory(industries: Industry[], categoryId: string): Industry[] {
        const filteredIndustries: Industry[] = industries.filter((ft) => ft.categoryId === categoryId);
        return filteredIndustries;
    }




}


export default new CommunitiesController()