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
  <div className="flex items-start mb-4 flex-col" onClick={onClick}>
    <div className="flex items-center gap-1 flex-row">
      <Icon height={20} width={20} />
      <p className="font-medium">{title}</p>
    </div>
    <p>{subtext}</p>
  </div>
);

export default ContactItem;
