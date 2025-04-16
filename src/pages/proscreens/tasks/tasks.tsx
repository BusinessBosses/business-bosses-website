import React, { useState } from "react";
import CustomTabBarWidget from "./components/customtabbar";
import ProCustomButton from "../biz-center/components/procustombutton";
import { Modal } from "@mui/material";

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
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-100"
            >
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-bold mb-4">Add New Task</h2>
                <button
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
