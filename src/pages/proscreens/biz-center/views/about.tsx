import React from "react";
import Assets from "../../../../assets";
import ContactItem from "../components/contactitem";

const ContactInformation = () => {
  return (
    <div className="flex flex-col gap-10 items-start py-2">
      {/* Contact Information Section */}

      <div>
        <div className="text-xl font-semibold mb-4">Contact Information</div>
        {/* Address */}
        <ContactItem
          icon={Assets.location}
          title="Virtual Address"
          subtext="#111, Biz-Centre, Business Bosses, United Kingdom"
        />
        <ContactItem
          icon={Assets.location}
          title="Virtual Address"
          subtext="#111, Biz-Centre, Business Bosses, United Kingdom"
        />
        <ContactItem
          icon={Assets.location}
          title="Virtual Address"
          subtext="#111, Biz-Centre, Business Bosses, United Kingdom"
        />
      </div>

      {/* Social Links Section */}
      <div>
        <h2 className="text-lg font-semibold ">Social Links</h2>
        <div className="flex gap-4">
          {/* Facebook */}
          <a
            href="#"
            className="p-3 bg-gray-500 rounded-full hover:bg-gray-500/75 transition"
          >
            <Assets.fbsl className="fill-white" />
          </a>
          {/* X (formerly Twitter) */}
          <a
            href="#"
            className="p-3 bg-gray-500 rounded-full hover:bg-gray-500/75 transition"
          >
            <Assets.xsl className="fill-white" />
          </a>
          {/* Instagram */}
          <a
            href="#"
            className="p-3 bg-gray-500 rounded-full hover:bg-gray-500/75 transition"
          >
            <Assets.isl className="fill-white" />
          </a>
          {/* LinkedIn */}
          <a
            href="#"
            className="p-3 bg-gray-500 rounded-full hover:bg-gray-500/75 transition"
          >
            <Assets.lsl className="fill-white" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactInformation;
