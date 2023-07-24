import React, { ReactNode, useState } from "react";
import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";
import Assets from "../../../assets";
import {
  AiFillMinusCircle,
  AiOutlineCamera,
  AiOutlineClose,
  AiOutlinePlus,
} from "react-icons/ai";
import FilledInput from "../../../common/components/inputs/FilledInput";
import FilledSelect from "../../../common/components/inputs/FilledSelect";
import { CountryDropdown } from "react-country-region-selector";
import FilledTextarea from "../../../common/components/inputs/FilledTextarea";
import { IoIosArrowForward, IoIosMore } from "react-icons/io";
import FilledButton from "../../../common/components/buttons/FilledButton";
import { BsFillPlusCircleFill } from "react-icons/bs";
import UserAvatar from "../../../common/components/avatars/UserAvatar";
import RoutesPath from "../../../constants/Routes";
import ComputerBossOfTheWeek from "../../home/views/components/ComputerBossOfTheWeek";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import Popup from "reactjs-popup";
import ComputerHeader from "../../home/views/components/ComputerHeader";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const [expansionState, setExpansionState] = useState({
    additionalInfo: false,
    achievments: false,
    products: false,
  });
  return (
    <div>
      <div className="mobile-only">
        <div className=" min-h-screen h-full">
          <div className=" fixed top-0 w-full z-50">
            <CommonPageHeader title="Edit Profile" />
          </div>
          <div className="w-full h-3 mt-16 bg-[#f4f4f4]"></div>
          <div className="py-5">
            <div className="flex items-center justify-center ">
              <div className="bg-[#F4F4F4] p-8 rounded-full relative">
                <Assets.User />
                <button className="bg-primary absolute bottom-1 right-1 p-1 rounded-full text-white">
                  <AiOutlineCamera />
                </button>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="px-5">
                <FilledInput onchange={() => { }} label="Username" />
                <FilledInput onchange={() => { }} label="Email" />
                <FilledSelect
                  data={["10 - 15", "18 - 30", "24 - 56"]}
                  onchange={() => { }}
                  label="Age Range"
                />
                <FilledSelect
                  data={["Male", "Female"]}
                  onchange={() => { }}
                  label="Gender"
                />
                <div className="my-5">
                  <label className="text-[#333333] text-sm font-[700]">
                    Location
                  </label>
                  <CountryDropdown
                    classes="bg-[#F4F4F4] outline-none border-none rounded-lg block w-full p-3"
                    value=""
                    onChange={(val) => { }}
                  />
                </div>
                <FilledTextarea onchange={() => { }} label="Bio" />
                <div className="my-5">
                  <label className="text-[#333333] text-sm font-[700]">Title</label>
                  <div className="flex items-center justify-between bg-[#f4f4f4] p-3">
                    <p>Software engineer</p>
                    <IoIosArrowForward />
                  </div>
                </div>
              </div>
              <div
                onClick={() =>
                  setExpansionState({
                    ...expansionState,
                    additionalInfo: !expansionState.additionalInfo,
                  })
                }
                className="my-5 bg-[#f4f4f4] p-3 flex items-center justify-between"
              >
                <p>Additional Information (Optional)</p>
                {!expansionState.additionalInfo ? (
                  <BsFillPlusCircleFill />
                ) : (
                  <AiFillMinusCircle />
                )}
              </div>
              <div
                className={`${expansionState.additionalInfo ? "block" : "hidden"
                  } px-5`}
              >
                <FilledInput onchange={() => { }} label="Company Name" />
                <div className="my-5">
                  <label className="text-[#333333] text-sm font-[700]">
                    Industry
                  </label>
                  <div className="flex items-center justify-between bg-[#f4f4f4] p-3">
                    <p>Business Bosses</p>
                    <IoIosArrowForward />
                  </div>
                </div>
                <FilledInput onchange={() => { }} label="Website" />
                <FilledInput onchange={() => { }} label="Instagram" />
                <FilledInput onchange={() => { }} label="Twitter" />
              </div>

              <div className="my-5">
                <div
                  onClick={() =>
                    setExpansionState({
                      ...expansionState,
                      achievments: !expansionState.achievments,
                    })
                  }
                  className="my-5 bg-[#f4f4f4] p-3 flex items-center justify-between"
                >
                  <h3 className=" font-bold">Achievements</h3>
                  {!expansionState.achievments ? (
                    <BsFillPlusCircleFill />
                  ) : (
                    <AiFillMinusCircle />
                  )}
                </div>
                <div
                  className={`${expansionState.achievments ? "block" : "hidden"
                    } px-5`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[#333333]">Add Accomplishments</p>
                    <button className="bg-[rgba(0,0,0,.1)] p-2 my-2 rounded-full">
                      <AiOutlinePlus />
                    </button>
                  </div>
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="relative my-5">
                      <div className="flex items-center gap-3  bg-[rgba(0,0,0,.1)] p-2 rounded-lg">
                        <img src={Assets.Trophy} alt="" />
                        <p>Tech crunch distrupt</p>
                      </div>
                      <button className="absolute top-0 right-0 bg-red-500 p-1 rounded-full">
                        <AiOutlineClose size={10} color="white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="my-5">
                <div
                  onClick={() =>
                    setExpansionState({
                      ...expansionState,
                      products: !expansionState.products,
                    })
                  }
                  className="my-5 bg-[#f4f4f4] p-3 flex items-center justify-between"
                >
                  <h3 className=" font-bold">Products</h3>
                  {!expansionState.products ? (
                    <BsFillPlusCircleFill />
                  ) : (
                    <AiFillMinusCircle />
                  )}
                </div>
                <div
                  className={`${expansionState.products ? "block" : "hidden"} px-5`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[#333333]">Add Product</p>
                    <button className="bg-[rgba(0,0,0,.1)] p-2 my-2 rounded-full">
                      <AiOutlinePlus />
                    </button>
                  </div>
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="relative my-5">
                      <div className="flex items-center gap-3  bg-[rgba(0,0,0,.1)] p-2 rounded-lg">
                        <img src={Assets.Product} alt="" />
                        <p>Tech crunch distrupt</p>
                      </div>
                      <button className="absolute top-0 right-0 bg-red-500 p-1 rounded-full">
                        <AiOutlineClose size={10} color="white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <FilledButton onClick={() => { }} text="Save" className="w-full p-3" />
            </form>
          </div>
        </div>
      </div>


      <div className="computer-only">
        <ComputerHeader />
        <div className="computer-content">
          <div className="firstsection ml-0 mr-5 ml-5 lg:ml-20" style={{
            width: '30%',
            flexGrow: 0,
            overflow: 'none',
            position: 'sticky',
            top: 0,
            zIndex: 1,
            height: '100%'
          }}>
            <div className="" >


              <div className="flex items-center " onClick={() => navigate(RoutesPath.myProfile)}>

                <UserAvatar
                  imageSize="h-24 w-24"
                  imageURL="https://cdn.pixabay.com/photo/2023/06/12/07/15/spider-8057853__340.jpg"
                />
                <div className="ml-4">
                  <p className="text-xl font-semibold">Isaac Akin</p>
                  <p className="text-lg font-medium">Consultant</p>
                  <p className="font-medium">Digital Blogger</p>
                  <p className="text-sm font-light text-[#A9A9A9]">United Kingdom</p>
                </div>

                <div className="flex-grow" />
                <Popup
                  trigger={
                    <div>
                      <IoIosMore size={20} />
                    </div>
                  }
                  position="left top"
                  on="click"
                  closeOnDocumentClick
                  contentStyle={{ padding: "0px", border: "none" }}
                // arrow={false}
                >
                  {
                    (((close: any) => (
                      <div className=" bg-white shadow rounded-lg p-5 space-y-3 items-start justify-start flex flex-col">
                        <button
                          onClick={() => {
                            close();
                          }}
                          className="menu-item"
                        >
                          Hide
                        </button>
                        <button
                          onClick={() => {
                            close();
                          }}
                          className="menu-item"
                        >
                          Report
                        </button>
                      </div>
                    )) as unknown) as ReactNode
                  }
                </Popup>


              </div>
            </div>



          </div>

          <div style={{ borderLeft: '1.2px solid rgba(0, 0, 0, 0.1)' }}></div>
          <div className="computer-main-content" style={{ paddingTop: 80, width: '40%', flexGrow: 0 }} >
            <div className=" min-h-screen h-full">

              <div className="bg-white p-5 flex items-center justify-between">
                <button onClick={() => navigate(-1)}>
                  <BiArrowBack size={20} />
                </button>
                <p className="text-xl font-medium" style={{ paddingTop: 0 }}>{"Edit Profile"}</p>
                <div />
              </div>
              <div className="py-5">
                <div className="flex items-center justify-center ">
                  <div className="bg-[#F4F4F4] p-10 rounded-full relative">
                  <Assets.User style={{ width: "100px", height: "100px" }} />

                    <button className="bg-primary absolute bottom-1 right-1 p-1 rounded-full text-white">
                      <AiOutlineCamera size={30}/>
                    </button>
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  <div className="px-5 ">
                    <FilledInput onchange={() => { }} label="Username" />
                    <FilledInput onchange={() => { }} label="Email" />
                    <FilledSelect
                      data={["10 - 15", "18 - 30", "24 - 56"]}
                      onchange={() => { }}
                      label="Age Range"
                    />
                    <FilledSelect
                      data={["Male", "Female"]}
                      onchange={() => { }}
                      label="Gender"
                    />
                    <div className="my-5">
                      <label className="text-[#333333] text-sm font-[700]">
                        Location
                      </label>
                      <CountryDropdown
                        classes="bg-[#F4F4F4] outline-none border-none rounded-lg block w-full p-5"
                        value=""
                        onChange={(val) => { }}
                      />
                    </div>
                    <FilledTextarea onchange={() => { }} label="Bio" />
                    <div className="my-5">
                      <label className="text-[#333333] text-sm font-[700]">Title</label>
                      <div className="flex items-center rounded-lg justify-between bg-[#f4f4f4] p-5">
                        <p>Software engineer</p>
                        <IoIosArrowForward />
                      </div>
                    </div>
                  </div>
                  <div
                    onClick={() =>
                      setExpansionState({
                        ...expansionState,
                        additionalInfo: !expansionState.additionalInfo,
                      })
                    }
                    className="my-5 bg-[#ffffff] pt-5 pl-5 pr-5 flex items-center justify-between font-bold" style={{borderTop: '1.2px solid rgba(0, 0, 0, 0.1)',}}
                  >
                    <p>Additional Information (Optional)</p>
                    {!expansionState.additionalInfo ? (
                      <BsFillPlusCircleFill />
                    ) : (
                      <AiFillMinusCircle />
                    )}
                  </div>
                  <div
                    className={`${expansionState.additionalInfo ? "block" : "hidden"
                      } px-5`}
                  >
                    <FilledInput onchange={() => { }} label="Company Name" />
                    <div className="my-5">
                      <label className="text-[#333333] text-sm font-[700]">
                        Industry
                      </label>
                      <div className="flex items-center rounded-lg justify-between bg-[#f4f4f4] p-5">
                        <p>Business Bosses</p>
                        <IoIosArrowForward />
                      </div>
                    </div>
                    <FilledInput onchange={() => { }} label="Website" />
                    <FilledInput onchange={() => { }} label="Instagram" />
                    <FilledInput onchange={() => { }} label="Twitter" />
                  </div>

                  <div className="my-5">
                    <div
                      onClick={() =>
                        setExpansionState({
                          ...expansionState,
                          achievments: !expansionState.achievments,
                        })
                      }
                      className="my-5 bg-[#ffffff] pt-5 pl-5 pr-5 flex items-center justify-between font-bold" style={{borderTop: '1.2px solid rgba(0, 0, 0, 0.1)'}}
                    >
                      <h3 className=" font-bold">Achievements</h3>
                      {!expansionState.achievments ? (
                        <BsFillPlusCircleFill />
                      ) : (
                        <AiFillMinusCircle />
                      )}
                    </div>
                    <div
                      className={`${expansionState.achievments ? "block" : "hidden"
                        } px-5`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-[#333333]">Add Accomplishments</p>
                        <button className="bg-[rgba(0,0,0,.1)] p-2 my-2 rounded-full">
                          <AiOutlinePlus />
                        </button>
                      </div>
                      {[1, 2, 3, 4, 5].map((item) => (
                        <div key={item} className="relative my-5">
                          <div className="flex items-center gap-3  bg-[rgba(0,0,0,.1)] p-2 rounded-lg">
                            <img src={Assets.Trophy} alt="" />
                            <p>Tech crunch distrupt</p>
                          </div>
                          <button className="absolute top-0 right-0 bg-red-500 p-1 rounded-full">
                            <AiOutlineClose size={10} color="white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="my-5">
                    <div
                      onClick={() =>
                        setExpansionState({
                          ...expansionState,
                          products: !expansionState.products,
                        })
                      }
                      className="my-5 bg-[#ffffff] pt-5 pl-5 pr-5 flex items-center justify-between font-bold"style={{borderTop: '1.2px solid rgba(0, 0, 0, 0.1)'}}
                    >
                      <h3 className=" font-bold">Products</h3>
                      {!expansionState.products ? (
                        <BsFillPlusCircleFill />
                      ) : (
                        <AiFillMinusCircle />
                      )}
                    </div>
                    <div
                      className={`${expansionState.products ? "block" : "hidden"} px-5`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-[#333333]">Add Product</p>
                        <button className="bg-[rgba(0,0,0,.1)] p-2 my-2 rounded-full">
                          <AiOutlinePlus />
                        </button>
                      </div>
                      {[1, 2, 3, 4, 5].map((item) => (
                        <div key={item} className="relative my-5">
                          <div className="flex items-center gap-3  bg-[rgba(0,0,0,.1)] p-2 rounded-lg">
                            <img src={Assets.Product} alt="" />
                            <p>Tech crunch distrupt</p>
                          </div>
                          <button className="absolute top-0 right-0 bg-red-500 p-1 rounded-full">
                            <AiOutlineClose size={10} color="white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-5" style={{borderTop: '1.2px solid rgba(0, 0, 0, 0.1)'}}>
                    <FilledButton onClick={() => { }} text="Save" className="w-full p-4" /></div>
                </form>
              </div>
            </div>

          </div>
          <div style={{ borderRight: '1.2px solid rgba(0, 0, 0, 0.1)' }}></div>
          <div className="lastsection ml-5 mr-5 mb-40 lg:mr-20" style={{
            width: '30%',
            flexGrow: 0,
            overflow: 'none',
            position: 'sticky',
            top: 0,
            zIndex: 1,
          }}>
            <div className="" >
              <ComputerBossOfTheWeek />
              <div className="bg-[#F4F4F4] flex items-center justify-between p-2 rounded-lg mt-2">
                <small className="text-xs text-[#545151]">Boss Up by</small>
                <p className="text-[#545151] text-sm">
                  Business Bosses Company Limited
                </p>
                <MdOutlineKeyboardArrowRight className="text-[#726F6F]" />

              </div>

            </div>


          </div>

        </div>
      </div>


    </div>

  );
};

export default EditProfilePage;
