import React, { ReactNode } from "react";
import { AiFillContacts, AiFillCustomerService } from "react-icons/ai";
import { FiCalendar, FiEdit, FiPackage, FiShoppingCart } from "react-icons/fi";
import SetupShop from "../views/setupshop";
import { useAppSelector } from "../../../../redux/store/store";

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
    content: <div>hygjhg</div>,
  },
  {
    id: "manageproductinventory",
    title: "Manage Product Inventory",
    icon: <FiPackage size={20} />,
    content: <div>whnkjdnd</div>,
  },
  {
    id: "myservices",
    title: "My Services",
    icon: <AiFillCustomerService size={20} />,
    content: <div>whnkjdnd</div>,
  },
  {
    id: "contactus",
    title: "Contact Us",
    icon: <AiFillContacts size={20} />,
    content: <div>whnkjdnd</div>,
  },
];

export default setupItems;
