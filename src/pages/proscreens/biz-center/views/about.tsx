import React from "react";
import Assets from "../../../../assets";
import ContactItem from "../components/contactitem";
import { Shop } from "../../../../common/interfaces/Shop";

interface ContactInformationProps {
  shop: Shop; // Define the prop type
}

const ContactInformation: React.FC<ContactInformationProps> = ({ shop }) => {
  // Helper functions to construct social media URLs
  const buildSocialLink = (base: string, path: string | undefined) =>
    path ? `${base}${path}` : "#";

  return (
    <div className="flex flex-col gap-4 items-start py-2">
      {/* Contact Information Section */}
      <div>
        <div className="text-md font-semibold mb-2">Contact Information</div>
        {/* Address */}
        <ContactItem
          icon={Assets.website}
          title="Virtual Address"
          subtext={`#${shop?.appId}, Biz-Centre, Business Bosses, United Kingdom`}
        />
        <hr />
        <ContactItem
          icon={Assets.email}
          title="Email"
          subtext={shop?.email!}
          onClick={() => window.open(`mailto:${shop.email}`)}
        />
        <hr />
        <ContactItem
          icon={Assets.phone}
          title="Phone"
          subtext={shop?.phone!}
          onClick={() => window.open(`tel:${shop.phone}`)}
        />
      </div>

      {/* Social Links Section */}
      <div>
        <h2 className="text-lg mb-3 font-semibold">Social Links</h2>
        <div className="flex gap-4">
          {/* Facebook */}
          {shop?.facebook && (
            <a
              href={buildSocialLink("https://facebook.com/", shop.facebook)}
              aria-label="Facebook"
              className="p-3 bg-gray-200 rounded-full hover:bg-gray-200/75 transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Assets.fbsl height={18} width={18} />
            </a>
          )}
          {/* X (formerly Twitter) */}
          {shop?.twitter && (
            <a
              href={buildSocialLink("https://twitter.com/", shop.twitter)}
              aria-label="Twitter"
              className="p-3 bg-gray-200 rounded-full hover:bg-gray-200/75 transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Assets.xsl height={18} width={18} />
            </a>
          )}
          {/* Instagram */}
          {shop?.instagram && (
            <a
              href={buildSocialLink("https://instagram.com/", shop.instagram)}
              aria-label="Instagram"
              className="p-3 bg-gray-200 rounded-full hover:bg-gray-200/75 transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Assets.isl height={18} width={18} />
            </a>
          )}
          {/* LinkedIn */}
          {shop?.linkedin && (
            <a
              href={buildSocialLink("https://linkedin.com/in/", shop.linkedin)}
              aria-label="LinkedIn"
              className="p-3 bg-gray-200 rounded-full hover:bg-gray-200/75 transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Assets.lsl height={18} width={18} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactInformation;
