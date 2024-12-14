import { FC, MouseEventHandler } from "react";

interface AddressProps {
  icon: React.ElementType;
  title: string;
  subtext: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const ContactItem: FC<AddressProps> = ({
  icon: Icon,
  title,
  subtext,
  onClick,
}) => (
  <div className="flex items-start my-3 flex-col" onClick={onClick}>
    <div className="flex items-center gap-1 flex-row">
      <Icon height={12} width={12} />
      <p className="text-xs">{title}</p>
    </div>
    <p className="text-sm">{subtext}</p>
  </div>
);

export default ContactItem;
