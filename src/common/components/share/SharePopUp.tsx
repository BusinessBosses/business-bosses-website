import { ReactNode } from "react";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import Popup from "reactjs-popup";

const SharePopUp = ({
  open,
  url,
  onClose,
}: {
  open: boolean;
  url: string;
  onClose: VoidFunction;
}) => {
  return (
    <Popup
      overlayStyle={{
        background: "rgba(0,0,0,.5)",
      }}
      modal
      onClose={onClose}
      open={open}
    >
      {
        (((close: any) => (
          <div className="bg-white shadow-lg p-8 rounded-lg  flex items-center gap-3">
            <FacebookShareButton url={url}>
              <FacebookIcon size={32} round={true} />
            </FacebookShareButton>
            <TwitterShareButton url={url}>
              <TwitterIcon size={32} round={true} />
            </TwitterShareButton>
            <LinkedinShareButton url={url}>
              <LinkedinIcon size={32} round={true} />
            </LinkedinShareButton>
            <WhatsappShareButton url={url}>
              <WhatsappIcon size={32} round={true} />
            </WhatsappShareButton>
            <TelegramShareButton url={url}>
              <TelegramIcon size={32} round={true} />
            </TelegramShareButton>
          </div>
        )) as unknown) as ReactNode
      }
    </Popup>
  );
};

export default SharePopUp;
