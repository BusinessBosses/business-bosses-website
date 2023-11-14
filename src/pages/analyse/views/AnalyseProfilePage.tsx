import React, { ReactNode, useEffect, useState } from "react";
import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";
import Assets from "../../../assets";
import ComputerHeader from "../../home/views/components/ComputerHeader";
import Popup from "reactjs-popup";
import UserAvatar from "../../../common/components/avatars/UserAvatar";
import { IoIosMore } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../constants/Routes";
import { useAppSelector } from "../../../redux/store/store";
import MobileBossOfTheWeek from "../../home/views/components/BossOfTheWeek";
import Analyserows from "./components/analyserows";
import { User } from "../../../common/interfaces/user";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import serviceApi from "../../../services/serviceApi";
import TimeFormat from "../controller/AnalyseController";
import FetchStatus from "../../../common/components/fetch_status/FetchStatus";
import ComputerProfileDetails from "../../profile/views/components/ComputerProfiledetailswcr";
import { PartnerData } from "../../../common/interfaces/partnerdata";
import { PartnerDatatile } from "../../../common/interfaces/partnerdatatile";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  partnerData: PartnerData | null;
partnerDatatile: PartnerDatatile | null;
}

interface MyConnect {
  id?: string;
  timestamp?: number;
  connectedTo?: string;
}

interface ConnState {
  myConnections: MyConnect[];
  myConnecteds: MyConnect[];
  disconnections: MyConnect[];
}

const AnalyseProfilePage: React.FC<Props> = ({ partnerData, partnerDatatile }) => {
  const navigate = useNavigate();
  const profile = useAppSelector((state) => state.user);
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<boolean>(false);
  const [data, setData] = useState({
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Connected",
        data: [0, 0, 0, 0, 0, 0, 0],
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
        borderWidth: 2,
      },
      {
        label: "Connections",
        data: [0, 0, 0, 0, 0, 0, 0],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
        borderWidth: 2,
      },
      {
        label: "Disconnections",
        data: [0, 0, 0, 0, 0, 0, 0],
        fill: false,
        borderColor: "rgb(54, 162, 235)",
        tension: 0.1,
        borderWidth: 2,
      },
    ],
  });
  const [connectionState, setConnectionState] = useState<ConnState>({
    myConnections: [],
    myConnecteds: [],
    disconnections: [],
  });

  const getDurationAnalysis = (
    conn: MyConnect[],
    timestamp: number
  ): MyConnect[] => {
    return conn.filter((ft) => {
      const isWithinTime = timestamp
        ? Date.now() - ft.timestamp! <= timestamp
        : false;
      return isWithinTime;
    });
  };

  const getConnValue = (
    conn: MyConnect[],
    val: number,
    time: number
  ): number => {
    return val === 0
      ? 0
      : Math.round(getDurationAnalysis(conn, time).length / val);
  };

  const loadDataValue = (nums: number[], conn: MyConnect[]): number[] => {
    let values: number[] = [];
    for (let index = 0; index < nums.length; index++) {
      const data = getConnValue(conn, nums[index], TimeFormat.ONE_MONTH);
      values.push(data);
    }

    return values;
  };

  const loadRawConnections = async () => {
    setLoading(true);
    setErr(false);

    const response = await serviceApi.fetch("/connection/analysis");

    if (response.success) {
      setConnectionState({
        myConnections: response.data.connections,
        myConnecteds: response.data.connecteds,
        disconnections: response.data.disconnections,
      });

      setData({
        ...data,
        datasets: [
          {
            ...data.datasets[0],
            data: loadDataValue(
              [0, 8, 7, 4, 2, 1.4, 1],
              response.data.connections
            ),
          },
          {
            ...data.datasets[1],
            data: loadDataValue(
              [0, 8, 5, 4, 3, 2, 1],
              response.data.connecteds
            ),
          },
          {
            ...data.datasets[2],
            data: loadDataValue(
              [0, 10, 8, 5, 3, 2, 1],
              response.data.disconnections
            ),
          },
        ],
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    loadRawConnections();
  }, []);

  return (
    <div>
      <div className="mobile-only">
        <div
          className=" top-0 w-full z-50 "
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            borderBottom: "15px solid rgba(244, 244, 244, 1)",
          }}
        >
          <CommonPageHeader title="Analyse Profile" />
        </div>

        {loading ? (
          <FetchStatus
            error={false}
            loading={true}
            errorMessage=""
            onReload={() => {}}
          />
        ) : (
          <div className=" pt-5 bg-white px-5" style={{ height: "100vh" }}>
            <div className="text-center font-bold text-lg">Network</div>

            <div className="font-bold pt-5 text-sm">Weekly</div>

            <div className="flex items-center justify-between my-5 mx-10">
              <button onClick={() => {}} className="text-center">
                <p>
                  {
                    getDurationAnalysis(
                      connectionState.myConnections,
                      TimeFormat.ONE_WEEK
                    ).length
                  }
                </p>
                <p className="text-xs font-semibold text-[#A9A9A9]">
                  Connection
                </p>
              </button>
              <button onClick={() => {}} className="text-center">
                <p>
                  {
                    getDurationAnalysis(
                      connectionState.myConnecteds,
                      TimeFormat.ONE_WEEK
                    ).length
                  }
                </p>
                <p className="text-xs font-semibold text-[#A9A9A9]">
                  Connected
                </p>
              </button>
              <button onClick={() => {}} className="text-center">
                <p>
                  {
                    getDurationAnalysis(
                      connectionState.disconnections,
                      TimeFormat.ONE_WEEK
                    ).length
                  }
                </p>
                <p className="text-xs font-semibold text-[#A9A9A9]">
                  Disconnected
                </p>
              </button>
            </div>

            <div className="font-bold pt-5 text-sm">Monthly</div>

            <div className="flex items-center justify-between my-5 mx-10">
              <button onClick={() => {}} className="text-center">
                <p>
                  {
                    getDurationAnalysis(
                      connectionState.myConnections,
                      TimeFormat.ONE_MONTH
                    ).length
                  }
                </p>
                <p className="text-xs font-semibold text-[#A9A9A9]">
                  Connection
                </p>
              </button>
              <button onClick={() => {}} className="text-center">
                <p>
                  {
                    getDurationAnalysis(
                      connectionState.myConnecteds,
                      TimeFormat.ONE_MONTH
                    ).length
                  }
                </p>
                <p className="text-xs font-semibold text-[#A9A9A9]">
                  Connected
                </p>
              </button>
              <button onClick={() => {}} className="text-center">
                <p>
                  {
                    getDurationAnalysis(
                      connectionState.disconnections,
                      TimeFormat.ONE_MONTH
                    ).length
                  }
                </p>
                <p className="text-xs font-semibold text-[#A9A9A9]">
                  Disconnected
                </p>
              </button>
            </div>

            <div className="text-center pt-5 text-lg">
              Monthly Profile Analysis
              <div className="my-10">
                <Line
                  data={data}
                  options={{
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
              <br />
            </div>
          </div>
        )}
      </div>

      <div className="computer-only bg-[#fff]">
        <ComputerHeader partnerData={partnerData}   partnerDatatile={partnerDatatile}  />

        <div className="computer-content">
          <div
            className="firstsection ml-5 lg:ml-20 pr-5"
            style={{
              width: "25%",
              flexGrow: 0,
              overflow: "none",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            <div className="">
              <div className=" flex items-center gap-3">
                <ComputerProfileDetails data={profile.profile!} />
              </div>
            </div>
          </div>
          <div style={{ borderLeft: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
          <div
            className="computer-main-content"
            style={{ width: "50%", flexGrow: 0 }}
          >
            <div className="computer-only">
              <CommonPageHeader title="Analyse Profile" />

              <div className=" pt-5 bg-white px-5" style={{ height: "100vh" }}>
                <div className="text-center font-bold text-lg">Network</div>

                <div className="font-bold pt-5 text-base">Weekly</div>

                <div className="flex items-center justify-between my-5 mx-10">
                  <button onClick={() => {}} className="text-center">
                    <p>
                      {
                        getDurationAnalysis(
                          connectionState.myConnections,
                          TimeFormat.ONE_WEEK
                        ).length
                      }
                    </p>
                    <p className="text-xs font-semibold text-[#A9A9A9]">
                      Connection
                    </p>
                  </button>
                  <button onClick={() => {}} className="text-center">
                    <p>
                      {
                        getDurationAnalysis(
                          connectionState.myConnecteds,
                          TimeFormat.ONE_WEEK
                        ).length
                      }
                    </p>
                    <p className="text-xs font-semibold text-[#A9A9A9]">
                      Connected
                    </p>
                  </button>
                  <button onClick={() => {}} className="text-center">
                    <p>
                      {
                        getDurationAnalysis(
                          connectionState.disconnections,
                          TimeFormat.ONE_WEEK
                        ).length
                      }
                    </p>
                    <p className="text-xs font-semibold text-[#A9A9A9]">
                      Disconnected
                    </p>
                  </button>
                </div>

                <div className="font-bold pt-5 text-base">Monthly</div>

                <div className="flex items-center justify-between my-5 mx-10">
                  <button onClick={() => {}} className="text-center">
                    <p>
                      {
                        getDurationAnalysis(
                          connectionState.myConnections,
                          TimeFormat.ONE_MONTH
                        ).length
                      }
                    </p>
                    <p className="text-xs font-semibold text-[#A9A9A9]">
                      Connection
                    </p>
                  </button>
                  <button onClick={() => {}} className="text-center">
                    <p>
                      {
                        getDurationAnalysis(
                          connectionState.myConnecteds,
                          TimeFormat.ONE_MONTH
                        ).length
                      }
                    </p>
                    <p className="text-xs font-semibold text-[#A9A9A9]">
                      Connected
                    </p>
                  </button>
                  <button onClick={() => {}} className="text-center">
                    <p>
                      {
                        getDurationAnalysis(
                          connectionState.disconnections,
                          TimeFormat.ONE_MONTH
                        ).length
                      }
                    </p>
                    <p className="text-xs font-semibold text-[#A9A9A9]">
                      Disconnected
                    </p>
                  </button>
                </div>

                <div className="text-center pt-5 text-lg">
                  Monthly Profile Analysis
                  <div className="my-10">
                    <Line
                      data={data}
                      options={{
                        scales: {
                          y: {
                            beginAtZero: true,
                          },
                        },
                      }}
                    />
                  </div>
                  <br />
                </div>
              </div>
            </div>
          </div>
          <div style={{ borderRight: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
          <div
            className="lastsection pl-5 mr-5 mt-5 lg:mr-20 pr-0 mb-0"
            style={{
              width: "25%",
              flexGrow: 0,
              overflow: "none",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            <div className="rounded-xl overflow-hidden" style={{}}>
              {profile.bossup ? (
                <MobileBossOfTheWeek bossOfTheWeek={profile.bossup!} partnerData={partnerData}   partnerDatatile={partnerDatatile} />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyseProfilePage;
