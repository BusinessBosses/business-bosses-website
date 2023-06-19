import { useState } from "react";
import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";
import Tabs from "./components/Tabs";
import ConnectTile from "../../../common/components/connects/ConnectTile";

const ConnectionsPage = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  return (
    <div>
      <div className="fixed top-0 w-full z-50">
        <CommonPageHeader title="Connections" />
      </div>
      <div className="my-16" />
      <Tabs
        currentIndex={currentIndex}
        onChangeRoute={(index: number) => setCurrentIndex(index)}
      />
      <div className="px-5 -mt-5">
        <ConnectTile />
        <ConnectTile />
        <ConnectTile />
        <ConnectTile />
        <ConnectTile />
        <ConnectTile />
      </div>
    </div>
  );
};

export default ConnectionsPage;
