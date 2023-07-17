import axios from "axios";
import { toast } from "react-toastify";
import { ServerUrl } from "../config/config";
import { StorageEnum } from "../common/emums/StorageEmuns";

const axiosClient = axios;
const isDev = process.env.NODE_ENV === "development";


class ServiceApi {
    url = ServerUrl;



    // APPEND URL TO API URL
    appendToURL(url: string) {
        return `${this.url}${url}`;
    }

    // GET API REQUEST

    async fetch(path: string,) {
        try {
            const response = await axios.get(this.appendToURL(path), {
                headers: {
                    // Authorization: `bearer ${localStorage.getItem(StorageEnum.AccessToken)}`
                    Authorization: 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI4ODQ0MTQ0My04N2YxLTQ5ZGEtOGEwZi0yMTIzOGE4ZmU3ZTYiLCJhY2Nlc3MiOiJhdXRoIiwicm9sZSI6InVzZXIiLCJpYXQiOjE2ODk1MzMwODMsImV4cCI6MTcyMTA5MDY4M30.A0uwOmzkj9U0VugnWQfWIopbYqtBvuGx3jb1qaLIwuY'
                }
            });
            // console.log(response.data)
            if (response.data.success) {
                return response.data
            } else {
                toast.error("OOPS!! Something Went Wrong", { autoClose: 2000 })
                return { err: true, success: false }
            }
        } catch (err: any) {
            return this.handleErrors(err);
        }
    }

    // POST API REQUEST
    async post(path: string, payload: any) {
        try {
            const response = await axios.post(this.appendToURL(path), payload, {
                headers: {
                    Authorization: `bearer ${localStorage.getItem(StorageEnum.AccessToken)}`
                }
            })
            return response.data
        } catch (error) {
            return this.handleErrors(error)
        }
    }

    // PUT API REQUEST
    async update(url: string, payload = {}, resolve = false, is_attached = false) {
        try {
            const response = await axiosClient.put(
                this.appendToURL(url),
                payload,
                this.setupHeaders(is_attached)
            );

            return !resolve ? response.data : { ...response.data };
        } catch (err: any) {
            this.handleErrors(err);
            return { err: true, message: err.message }

        }
    }

    // DELETE API REQUEST
    async remove(url: string, payload = {}, resolve = false) {
        try {
            const response = await axiosClient.delete(this.appendToURL(url), {
                data: payload,
                ...this.setupHeaders(),
            });

            return !resolve ? response : { ...response };
        } catch (err) {
            return this.handleErrors(err);
        }
    }

    // SETUP HEADERS FOR SCENARIOS LIKE IMAGE UPLOAD
    setupHeaders(is_attached = false) {
        return is_attached
            ? {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `bearer ${localStorage.getItem(StorageEnum.AccessToken)}`

                },
            }
            : {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `bearer ${localStorage.getItem(StorageEnum.AccessToken)}`

                },
            };
    }

    // HANDLE API REQUEST ERRORS
    handleErrors(err: any) {
        if (err.response?.data?.error) {
            toast.error(` ${err.response?.data?.error}`, { autoClose: 3000 });
            console.error("API ERROR:", err);
            return { success: false, message: err.response?.data?.error };
        } else {
            if (err.response?.data) {

                toast.error(` ${err.response.data.message}`, { autoClose: 3000 });
                console.error("API ERROR:", err.response.data);
                return { success: false, message: err.response.data.message };
            } else {
                toast.error(` ${err.message}`, { autoClose: 3000 });
                console.error("API ERROR:", err);
                return { success: false, message: err.message };
            }
        }

    }


}

export default new ServiceApi();