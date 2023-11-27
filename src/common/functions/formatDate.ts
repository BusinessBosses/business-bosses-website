import moment from "moment"

const formatDate = (timestamp: number): string => {
    return moment(timestamp).fromNow()

}

export default formatDate;



