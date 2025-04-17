import React, { useState } from "react";
import CustomTabBarWidget from "./components/customtabbar";
import ProCustomButton from "../biz-center/components/procustombutton";
import { Modal } from "@mui/material";
import CustomEditText from "../biz-center/components/customedittext";
import CustomTextWidget from "../biz-center/components/customtextwidget";

const Tasks = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  function scrollToSection(index: number): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="bg-white rounded-xl min-h-screen">
      <div className="mx-auto px-4 py-4 gap-5 flex flex-col md:container">
        <div className="flex">
          <div className="w-full">
            <CustomTabBarWidget<string>
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              scrollToSection={scrollToSection}
              proprimaryColor="#000000"
              backgroundColor={["#FF0000", "#00FF00", "#0000FF", "#FFFF00"]}
              listofitems={["All", "To Do", "In-Progress", "Completed"]}
              itemToString={(item) => item}
            />
          </div>

          <div className="w-96">
            <ProCustomButton
              text={"Add Tasks"}
              onPressed={() => setShowModal(true)}
            />
          </div>
          {showModal && (
            <Modal
              open={showModal}
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10"
            >
              <div className="bg-white w-1/3 p-8 rounded-3xl shadow-lg">
                <div className="justify-between flex items-start mb-10">
                  <div className="">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Add New Task
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Fill in the details below to create a new task
                    </p>
                  </div>
                  <div className="">
                    <button
                      onClick={() => setShowModal(false)}
                      className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <CustomEditText
                    border="border border-backgroundcolor rounded-lg"
                    backgroundColor="bg-gray-50"
                    caption={"Task Name"}
                    hintText={"Enter Task Name Here"}
                    value={""}
                    onChange={function (value: string): void {
                      throw new Error("Function not implemented.");
                    }}
                  />
                  <CustomEditText
                    border="border border-backgroundcolor rounded-lg"
                    backgroundColor="bg-gray-50"
                    caption={"Task Description"}
                    hintText={"Enter Task Goals"}
                    value={""}
                    onChange={function (value: string): void {
                      throw new Error("Function not implemented.");
                    }}
                  />
                  <CustomEditText
                    isCurrencyField={true}
                    border="border border-backgroundcolor rounded-lg"
                    backgroundColor="bg-gray-50"
                    caption={"Task Expenses"}
                    hintText={"0.00"}
                    value={""}
                    onChange={function (value: string): void {
                      throw new Error("Function not implemented.");
                    }}
                  />
                  <div className="flex gap-4 w-full">
                    <div className="flex-1">
                      <CustomTextWidget
                        border="border border-backgroundcolor rounded-lg"
                        backgroundColor="bg-gray-50"
                        caption={"Start Date"}
                        iconName={""}
                      />
                    </div>
                    <div className="flex-1">
                      <CustomTextWidget
                        border="border border-backgroundcolor rounded-lg"
                        backgroundColor="bg-gray-50"
                        caption={"End Date"}
                        iconName={""}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 pt-6">
                    <ProCustomButton
                      text={"Cancel"}
                      textColor="text-black"
                      color="bg-gray-100"
                      onPressed={function (): void {
                        throw new Error("Function not implemented.");
                      }}
                    />
                    <ProCustomButton
                      text={"Create Task"}
                      onPressed={function (): void {
                        throw new Error("Function not implemented.");
                      }}
                    />
                  </div>
                </div>
              </div>
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
