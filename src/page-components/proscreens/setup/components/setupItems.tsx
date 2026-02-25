import React, { ReactNode } from "react";
import { AiFillContacts, AiFillCustomerService } from "react-icons/ai";
import { FiAtSign, FiBriefcase, FiCalendar, FiEdit, FiFastForward, FiPackage, FiShoppingCart } from "react-icons/fi";
import SetupShop from "../views/setupshop";
import { useAppSelector } from "../../../../redux/store/store";
import { Route } from "react-router-dom";
import ManageInventory from "../../biz-center/views/ManageInventory/ManageInventory";
import MyService from "../../biz-center/views/ManageService/MyService";
import Assets from "../../../../assets";

export interface SetupItemType {
  id: string;
  title: string;
  icon: ReactNode;
  content: ReactNode;
}

const setupItems: SetupItemType[] = [
  {
    id: "editbizcenter",
    title: "Edit Biz-Center",
    icon: <FiEdit size={18} />,
    content: <div>hgjhg</div>,
  },
  {
    id: "manageproductinventory",
    title: "Manage Product Inventory",
    icon: <FiPackage size={20} />,
    content: <ManageInventory />,
  },
  {
    id: "myservices",
    title: "My Services",
    icon: <FiBriefcase size={19}/>,
    content: <MyService />,
  },
  {
    id: "contactus",
    title: "Contact Us",
    icon: <FiAtSign size={19} />,
    content: <div>whnkjdnd</div>,
  },
];

export default setupItems;
