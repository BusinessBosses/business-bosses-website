import { toast } from "react-toastify"
import serviceApi from "../../../services/serviceApi";
import { error } from "console";

class Authentication {
    validateLogin(data: LoginStruct): boolean {
        if (!!!data.email) {
            console.log(data.email)
            console.log()
            toast.error("Invalid Email");
            return false
        } else if (!!!data.password) {
            toast.error("Invalid Password");
            return false
        } 
        return true
    }

    validateRegister(data: RegisterStruct): boolean {
        if (!!!data.username) {
            toast.error("Invalid Username");
            return false
        }
        else if (!!!data.email) {
            toast.error("Invalid Email");
            return false
        } else if (!!!data.password) {
            toast.error("Invalid Password");
            return false
        } else if (!data.terms) {
            toast.error("You must agree to our terms and conditions");
            return false
        }
        return true
    }



    async loginRequest(args: LoginStruct) {
        const response = await serviceApi.post('/auth/sign-in', args);
        return response;
    }


    async googleLoginRequest(args: { email: string, token: string }) {
        const response = await serviceApi.post('/auth/google-sign-in', args);
        return response;
    }




    async registerRequest(args: RegisterStruct) {
        const response = await serviceApi.post('/auth/web-sign-up', args);
        return response;
    }

    async verificationRequest(args: { otp: string, email: string }) {
        const response = await serviceApi.post('/auth/validate-otp', args);
        return response;
    }

    async verifyEmail(args: { otp: string, email: string }) {
        const response = await serviceApi.post('/auth/verify-email', args);
        return response;
    }

    async requestOpt(email: string) {
        const response = await serviceApi.post("/auth/request-otp", {
            email,
        });
        return response;
    }

    async resetPassword(email: string, newPassword: string) {
        const response = await serviceApi.post("/auth/reset-password", {
            email,
            newPassword,
        });
        return response;
    }


    validateOTPVerification(otp: string): boolean {
        if (otp.length < 6) {
            toast.error("Invalid OTP")
            return false
        }
        return true
    }
}


export default new Authentication()

interface LoginStruct { email?: string, password?: string, terms?: boolean }
interface RegisterStruct { email?: string, password?: string, username?: string, terms?: boolean }