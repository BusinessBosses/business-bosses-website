import React, { ReactNode } from "react";
import { AiFillContacts, AiFillCustomerService } from "react-icons/ai";
import { FiCalendar, FiEdit, FiPackage, FiShoppingCart } from "react-icons/fi";
import SetupShop from "../views/setupshop";
import { useAppSelector } from "../../../../redux/store/store";
import { Route } from "react-router-dom";
import ManageInventory from "../../biz-center/views/ManageInventory/ManageInventory";
import MyService from "../../biz-center/views/ManageService/MyService";

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
    icon: <FiEdit size={20} />,
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
    icon: <AiFillCustomerService size={20} />,
    content: <MyService />,
  },
  {
    id: "contactus",
    title: "Contact Us",
    icon: <AiFillContacts size={20} />,
    content: <div>whnkjdnd</div>,
  },
];

export default setupItems;
