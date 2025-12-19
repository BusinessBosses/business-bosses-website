import React from "react";
import { Mail, Calendar, MapPin } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Privacy Policy
          </h1>
          <div className="flex items-center justify-center text-slate-600 mb-6">
            <Calendar className="w-5 h-5 mr-2" />
            <span className="text-lg">Last updated: August 25, 2025</span>
          </div>
          <div className="w-24 h-1 bg-[#F21C29] mx-auto rounded-full"></div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl p-8 sm:p-12">
          {/* Introduction */}
          <section className="mb-12">
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              This Privacy Policy describes Our policies and procedures on the
              collection, use and disclosure of Your information when You use
              the Service and tells You about Your privacy rights and how the
              law protects You.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed">
              We use Your Personal data to provide and improve the Service. By
              using the Service, You agree to the collection and use of
              information in accordance with this Privacy Policy. This Privacy
              Policy has been created with the help of the Free Privacy Policy
              Generator.
            </p>
          </section>

          {/* Interpretation and Definitions */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 border-b-2  border-gray-100 pb-4">
              Interpretation and Definitions
            </h2>

            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-slate-800 mb-4">
                Interpretation
              </h3>
              <p className="text-slate-700 leading-relaxed">
                The words of which the initial letter is capitalized have
                meanings defined under the following conditions. The following
                definitions shall have the same meaning regardless of whether
                they appear in singular or in plural.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-slate-800 mb-6">
                Definitions
              </h3>
              <p className="text-slate-700 leading-relaxed mb-6">
                For the purposes of this Privacy Policy:
              </p>

              <div className="space-y-6">
                {[
                  {
                    term: "Account",
                    definition:
                      "means a unique account created for You to access our Service or parts of our Service.",
                  },
                  {
                    term: "Affiliate",
                    definition:
                      'means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.',
                  },
                  {
                    term: "Application",
                    definition:
                      "refers to Business Bosses App, the software program provided by the Company.",
                  },
                  {
                    term: "Company",
                    definition:
                      '(referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Business Bosses Limited, United Kingdom.',
                  },
                  {
                    term: "Country",
                    definition: "refers to: United Kingdom",
                  },
                  {
                    term: "Device",
                    definition:
                      "means any device that can access the Service such as a computer, a cellphone or a digital tablet.",
                  },
                  {
                    term: "Personal Data",
                    definition:
                      "is any information that relates to an identified or identifiable individual.",
                  },
                  {
                    term: "Service",
                    definition: "refers to the Application.",
                  },
                  {
                    term: "Service Provider",
                    definition:
                      "means any natural or legal person who processes the data on behalf of the Company. It refers to third-party companies or individuals employed by the Company to facilitate the Service, to provide the Service on behalf of the Company, to perform services related to the Service or to assist the Company in analyzing how the Service is used.",
                  },
                  {
                    term: "Third-party Social Media Service",
                    definition:
                      "refers to any website or any social network website through which a User can log in or create an account to use the Service.",
                  },
                  {
                    term: "Usage Data",
                    definition:
                      "refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit).",
                  },
                  {
                    term: "You",
                    definition:
                      "means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-slate-50 rounded-lg p-6  border-[#F21C29]"
                  >
                    <div className="font-semibold text-slate-900 mb-2">
                      {item.term}
                    </div>
                    <div className="text-slate-700 leading-relaxed">
                      {item.definition}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Collecting and Using Your Personal Data */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 border-b-2  border-gray-100 pb-4">
              Collecting and Using Your Personal Data
            </h2>

            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-slate-800 mb-6">
                Types of Data Collected
              </h3>

              <div className="mb-8">
                <h4 className="text-xl font-semibold text-slate-800 mb-4">
                  Personal Data
                </h4>
                <p className="text-slate-700 leading-relaxed mb-4">
                  While using Our Service, We may ask You to provide Us with
                  certain personally identifiable information that can be used
                  to contact or identify You. Personally identifiable
                  information may include, but is not limited to:
                </p>
                <div className="bg-slate-50 rounded-lg p-6">
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-[#F21C29] rounded-full mr-3"></div>
                      Email address
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-[#F21C29] rounded-full mr-3"></div>
                      First name and last name
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-[#F21C29] rounded-full mr-3"></div>
                      Phone number
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-[#F21C29] rounded-full mr-3"></div>
                      Address, State, Province, ZIP/Postal code, City
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-[#F21C29] rounded-full mr-3"></div>
                      Usage Data
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-xl font-semibold text-slate-800 mb-4">
                  Usage Data
                </h4>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Usage Data is collected automatically when using the Service.
                </p>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Usage Data may include information such as Your Device's
                  Internet Protocol address (e.g. IP address), browser type,
                  browser version, the pages of our Service that You visit, the
                  time and date of Your visit, the time spent on those pages,
                  unique device identifiers and other diagnostic data.
                </p>
                <p className="text-slate-700 leading-relaxed mb-4">
                  When You access the Service by or through a mobile device, We
                  may collect certain information automatically, including, but
                  not limited to, the type of mobile device You use, Your mobile
                  device unique ID, the IP address of Your mobile device, Your
                  mobile operating system, the type of mobile Internet browser
                  You use, unique device identifiers and other diagnostic data.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  We may also collect information that Your browser sends
                  whenever You visit our Service or when You access the Service
                  by or through a mobile device.
                </p>
              </div>

              <div className="mb-8">
                <h4 className="text-xl font-semibold text-slate-800 mb-4">
                  Information from Third-Party Social Media Services
                </h4>
                <p className="text-slate-700 leading-relaxed mb-4">
                  The Company allows You to create an account and log in to use
                  the Service through the following Third-party Social Media
                  Services:
                </p>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {[
                      "Google",
                      "Facebook",
                      "Instagram",
                      "Twitter",
                      "LinkedIn",
                    ].map((service) => (
                      <div
                        key={service}
                        className="bg-white rounded-lg p-3 text-center shadow-sm border border-[#F21C29]"
                      >
                        <span className="text-slate-800 font-medium">
                          {service}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed mb-4">
                  If You decide to register through or otherwise grant us access
                  to a Third-Party Social Media Service, We may collect Personal
                  data that is already associated with Your Third-Party Social
                  Media Service's account, such as Your name, Your email
                  address, Your activities or Your contact list associated with
                  that account.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  You may also have the option of sharing additional information
                  with the Company through Your Third-Party Social Media
                  Service's account. If You choose to provide such information
                  and Personal Data, during registration or otherwise, You are
                  giving the Company permission to use, share, and store it in a
                  manner consistent with this Privacy Policy.
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-slate-800 mb-6">
                Use of Your Personal Data
              </h3>
              <p className="text-slate-700 leading-relaxed mb-6">
                The Company may use Personal Data for the following purposes:
              </p>

              <div className="space-y-4">
                {[
                  "To provide and maintain our Service, including to monitor the usage of our Service.",
                  "To manage Your Account: to manage Your registration as a user of the Service. The Personal Data You provide can give You access to different functionalities of the Service that are available to You as a registered user.",
                  "For the performance of a contract: the development, compliance and undertaking of the purchase contract for the products, items or services You have purchased or of any other contract with Us through the Service.",
                  "To contact You: To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication, such as a mobile application's push notifications regarding updates or informative communications related to the functionalities, products or contracted services, including the security updates, when necessary or reasonable for their implementation.",
                  "To provide You with news, special offers and general information about other goods, services and events which we offer that are similar to those that you have already purchased or enquired about unless You have opted not to receive such information.",
                  "To manage Your requests: To attend and manage Your requests to Us.",
                  "For business transfers: We may use Your information to evaluate or conduct a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of Our assets, whether as a going concern or as part of bankruptcy, liquidation, or similar proceeding, in which Personal Data held by Us about our Service users is among the assets transferred.",
                  "For other purposes: We may use Your information for other purposes, such as data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve our Service, products, services, marketing and your experience.",
                ].map((purpose, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-[#F21C29] text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{purpose}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
                <h4 className="text-lg font-semibold text-slate-800 mb-3">
                  Information Sharing
                </h4>
                <p className="text-slate-700 leading-relaxed mb-4">
                  We may share Your personal information in the following
                  situations:
                </p>
                <ul className="space-y-2 text-slate-700">
                  <li>
                    <strong>With Service Providers:</strong> We may share Your
                    personal information with Service Providers to monitor and
                    analyze the use of our Service, to contact You.
                  </li>
                  <li>
                    <strong>For business transfers:</strong> We may share or
                    transfer Your personal information in connection with, or
                    during negotiations of, any merger, sale of Company assets,
                    financing, or acquisition of all or a portion of Our
                    business to another company.
                  </li>
                  <li>
                    <strong>With Affiliates:</strong> We may share Your
                    information with Our affiliates, in which case we will
                    require those affiliates to honor this Privacy Policy.
                  </li>
                  <li>
                    <strong>With business partners:</strong> We may share Your
                    information with Our business partners to offer You certain
                    products, services or promotions.
                  </li>
                  <li>
                    <strong>With other users:</strong> when You share personal
                    information or otherwise interact in the public areas with
                    other users, such information may be viewed by all users and
                    may be publicly distributed outside.
                  </li>
                  <li>
                    <strong>With Your consent:</strong> We may disclose Your
                    personal information for any other purpose with Your
                    consent.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Retention */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 border-b-2  border-gray-100 pb-4">
              Retention of Your Personal Data
            </h2>
            <div className="bg-slate-50 rounded-lg p-6">
              <p className="text-slate-700 leading-relaxed mb-4">
                The Company will retain Your Personal Data only for as long as
                is necessary for the purposes set out in this Privacy Policy. We
                will retain and use Your Personal Data to the extent necessary
                to comply with our legal obligations (for example, if we are
                required to retain your data to comply with applicable laws),
                resolve disputes, and enforce our legal agreements and policies.
              </p>
              <p className="text-slate-700 leading-relaxed">
                The Company will also retain Usage Data for internal analysis
                purposes. Usage Data is generally retained for a shorter period
                of time, except when this data is used to strengthen the
                security or to improve the functionality of Our Service, or We
                are legally obligated to retain this data for longer time
                periods.
              </p>
            </div>
          </section>

          {/* Data Transfer */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 border-b-2  border-gray-100 pb-4">
              Transfer of Your Personal Data
            </h2>
            <div className="space-y-4">
              <p className="text-slate-700 leading-relaxed">
                Your information, including Personal Data, is processed at the
                Company's operating offices and in any other places where the
                parties involved in the processing are located. It means that
                this information may be transferred to — and maintained on —
                computers located outside of Your state, province, country or
                other governmental jurisdiction where the data protection laws
                may differ than those from Your jurisdiction.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Your consent to this Privacy Policy followed by Your submission
                of such information represents Your agreement to that transfer.
              </p>
              <p className="text-slate-700 leading-relaxed">
                The Company will take all steps reasonably necessary to ensure
                that Your data is treated securely and in accordance with this
                Privacy Policy and no transfer of Your Personal Data will take
                place to an organization or a country unless there are adequate
                controls in place including the security of Your data and other
                personal information.
              </p>
            </div>
          </section>

          {/* Delete Personal Data */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 border-b-2  border-gray-100 pb-4">
              Delete Your Personal Data
            </h2>
            <div className="bg-green-50 rounded-lg p-6">
              <p className="text-slate-700 leading-relaxed mb-4">
                You have the right to delete or request that We assist in
                deleting the Personal Data that We have collected about You.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                Our Service may give You the ability to delete certain
                information about You from within the Service.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                You may update, amend, or delete Your information at any time by
                signing in to Your Account, if you have one, and visiting the
                account settings section that allows you to manage Your personal
                information. You may also contact Us to request access to,
                correct, or delete any personal information that You have
                provided to Us.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Please note, however, that We may need to retain certain
                information when we have a legal obligation or lawful basis to
                do so.
              </p>
            </div>
          </section>

          {/* Disclosure */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 border-b-2  border-gray-100 pb-4">
              Disclosure of Your Personal Data
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-slate-800 mb-4">
                  Business Transactions
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  If the Company is involved in a merger, acquisition or asset
                  sale, Your Personal Data may be transferred. We will provide
                  notice before Your Personal Data is transferred and becomes
                  subject to a different Privacy Policy.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-slate-800 mb-4">
                  Law Enforcement
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Under certain circumstances, the Company may be required to
                  disclose Your Personal Data if required to do so by law or in
                  response to valid requests by public authorities (e.g. a court
                  or a government agency).
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-slate-800 mb-4">
                  Other Legal Requirements
                </h3>
                <p className="text-slate-700 leading-relaxed mb-4">
                  The Company may disclose Your Personal Data in the good faith
                  belief that such action is necessary to:
                </p>
                <ul className="space-y-2 text-slate-700 ml-6">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-[#F21C29] rounded-full mr-3"></div>
                    Comply with a legal obligation
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-[#F21C29] rounded-full mr-3"></div>
                    Protect and defend the rights or property of the Company
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-[#F21C29] rounded-full mr-3"></div>
                    Prevent or investigate possible wrongdoing in connection
                    with the Service
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-[#F21C29] rounded-full mr-3"></div>
                    Protect the personal safety of Users of the Service or the
                    public
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-[#F21C29] rounded-full mr-3"></div>
                    Protect against legal liability
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Security */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 border-b-2  border-gray-100 pb-4">
              Security of Your Personal Data
            </h2>
            <div className="bg-red-50 border border-[#F21C29]/20 rounded-lg p-6">
              <p className="text-slate-700 leading-relaxed">
                The security of Your Personal Data is important to Us, but
                remember that no method of transmission over the Internet, or
                method of electronic storage is 100% secure. While We strive to
                use commercially acceptable means to protect Your Personal Data,
                We cannot guarantee its absolute security.
              </p>
            </div>
          </section>

          {/* Children's Privacy */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 border-b-2  border-gray-100 pb-4">
              Children's Privacy
            </h2>
            <div className="bg-orange-50 rounded-lg p-6">
              <p className="text-slate-700 leading-relaxed mb-4">
                Our Service does not address anyone under the age of 13. We do
                not knowingly collect personally identifiable information from
                anyone under the age of 13. If You are a parent or guardian and
                You are aware that Your child has provided Us with Personal
                Data, please contact Us.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                If We become aware that We have collected Personal Data from
                anyone under the age of 13 without verification of parental
                consent, We take steps to remove that information from Our
                servers.
              </p>
              <p className="text-slate-700 leading-relaxed">
                If We need to rely on consent as a legal basis for processing
                Your information and Your country requires consent from a
                parent, We may require Your parent's consent before We collect
                and use that information.
              </p>
            </div>
          </section>

          {/* Links to Other Websites */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 border-b-2  border-gray-100 pb-4">
              Links to Other Websites
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Our Service may contain links to other websites that are not
              operated by Us. If You click on a third party link, You will be
              directed to that third party's site. We strongly advise You to
              review the Privacy Policy of every site You visit.
            </p>
            <p className="text-slate-700 leading-relaxed">
              We have no control over and assume no responsibility for the
              content, privacy policies or practices of any third party sites or
              services.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 border-b-2  border-gray-100 pb-4">
              Changes to this Privacy Policy
            </h2>
            <div className="bg-red-50 rounded-lg p-6 border border-[#F21C29]/10">
              <p className="text-slate-700 leading-relaxed mb-4">
                We may update Our Privacy Policy from time to time. We will
                notify You of any changes by posting the new Privacy Policy on
                this page.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                We will let You know via email and/or a prominent notice on Our
                Service, prior to the change becoming effective and update the
                "Last updated" date at the top of this Privacy Policy.
              </p>
              <p className="text-slate-700 leading-relaxed">
                You are advised to review this Privacy Policy periodically for
                any changes. Changes to this Privacy Policy are effective when
                they are posted on this page.
              </p>
            </div>
          </section>

          {/* Contact Us */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 border-b-2  border-gray-100 pb-4">
              Contact Us
            </h2>
            <div className="bg-white border rounded-lg p-8 text-primary ">
              <p className="text-lg mb-6 text-slate-700">
                If you have any questions about this Privacy Policy, You can
                contact us:
              </p>
              <div className="flex items-center space-x-3">
                <Mail className="w-6 h-6" />
                <a
                  href="mailto:support@businessbosses.co.uk"
                  className="text-lg font-medium hover:text-red-100 transition-colors duration-200 underline decoration-2 underline-offset-4"
                >
                  support@businessbosses.co.uk
                </a>
              </div>
              <div className="flex items-center space-x-3 mt-4">
                <MapPin className="w-6 h-6" />
                <span className="text-lg">
                  Business Bosses Limited, United Kingdom
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-slate-600">
          <p>&copy; 2025 Business Bosses Limited. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
