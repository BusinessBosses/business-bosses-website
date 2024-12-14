import React from "react";
import Assets from "../../../../assets";
import ContactItem from "../components/contactitem";

const ContactInformation = () => {
  return (
    <div className="flex flex-col gap-4 items-start py-2">
      {/* Contact Information Section */}

      <div>
        <div className="text-md font-semibold mb-2">Contact Information</div>
        {/* Address */}
        <ContactItem
          icon={Assets.website}
          title="Virtual Address"
          subtext="#111, Biz-Centre, Business Bosses, United Kingdom"
        />
        <hr />
        <ContactItem
          icon={Assets.email}
          title="Email"
          subtext="Email here"
          onClick={() => window.open("mailto:Email here")}
        />
        <hr />
        <ContactItem
          icon={Assets.phone}
          title="Phone"
          subtext="Phone here"
          onClick={() => window.open("tel:Phone here")}
        />
      </div>

      {/* Social Links Section */}
      <div>
        <h2 className="text-lg mb-3 font-semibold ">Social Links</h2>
        <div className="flex gap-4">
          {/* Facebook */}
          <a
            href="#"
            className="p-3 bg-gray-200 rounded-full hover:bg-gray-200/75 transition"
          >
            <Assets.fbsl height={18} width={18} />
          </a>
          {/* X (formerly Twitter) */}
          <a
            href="#"
            className="p-3 bg-gray-200 rounded-full hover:bg-gray-200/75 transition"
          >
            <Assets.xsl height={18} width={18} />
          </a>
          {/* Instagram */}
          <a
            href="#"
            className="p-3 bg-gray-200 rounded-full hover:bg-gray-200/75 transition"
          >
            <Assets.isl height={18} width={18} />
          </a>
          {/* LinkedIn */}
          <a
            href="#"
            className="p-3 bg-gray-200 rounded-full hover:bg-gray-200/75 transition"
          >
            <Assets.lsl height={18} width={18} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactInformation;
