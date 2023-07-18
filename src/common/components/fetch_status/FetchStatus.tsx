import React from "react";
import Loader from "../loader/Loader";
import { BsWifiOff } from "react-icons/bs";
interface Props {
  loading: boolean;
  error: boolean;
  errorMessage: string;
  onReload: VoidFunction;
}
const FetchStatus = ({ error, errorMessage, loading, onReload }: Props) => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      {loading ? (
        <div className="flex items-center justify-center">
          <Loader size="w-10 h-10" />
        </div>
      ) : null}
      {error ? (
        <div className="flex items-center flex-col justify-center">
          <p className="text-black-50 dark:text-white-50 my-10 text-sm ">
            {errorMessage ? errorMessage : "OOPS!! Something went wrong"}
          </p>
          <button
            onClick={onReload}
            className="text-white  bg-primary flex items-center gap-2 px-10 py-2 rounded-full"
          >
            <BsWifiOff size={20} />
            Reload
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default FetchStatus;
