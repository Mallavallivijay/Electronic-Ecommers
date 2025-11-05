import { useEffect, useState } from "react";
import {
  FaInstagram,
  FaFacebookF,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import axios from "axios";
import Logo from "../../assets/NasatronicsLogo.png";
import { MdOutlineAddIcCall } from "react-icons/md";
import { IoMailUnreadOutline } from "react-icons/io5";
const Footer = () => {
  const [social, setSocial] = useState({
    instagram: "#",
    facebook: "#",
    youtube: "#",
    whatsapp: "#",
  });

  const [profile, setProfile] = useState({
    mailId: "",
    businessName: "",
    address: "",
    contactNumber: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "http://inspirecart-dev.gruhapandittuitions.com/ecommerce/api/adminProfile/basicData"
        );
        if (res.data && res.data.data) {
          setSocial({
            instagram: res.data.data.instagram || "#",
            facebook: res.data.data.facebook || "#",
            youtube: res.data.data.youtube || "#",
            whatsapp: res.data.data.whatsapp || "#",
          });
          setProfile({
            mailId: res.data.data.mailId || "",
            businessName: res.data.data.businessName || "",
            address: res.data.data.address || "",
            contactNumber: res.data.data.contactNumber || "",
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <footer className="bg-gray-900 text-white px-6 py-10">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left: Logo & Contact */}
        <div>
          <img src={Logo} alt="NsantronicsLogo" className="h-20 w-auto mb-4" />
          <h1 className="text-lg font-semibold mb-3">
            {profile.businessName || "Nsantronics"}
          </h1>
          <p className="text-sm">
            From FPGA boards to data acquisition modules, NsAntronics delivers
            high-performance electronics designed for engineers, researchers,
            and innovators.
          </p>
        </div>

        {/* Middle: Policy */}
        <div className=" md:text-left">
          <h2 className="text-lg font-semibold mb-3">Company</h2>
          <ul className="space-y-2">
            <li>
              <a href="/terms-of-use" className="hover:underline">
                About us
              </a>
            </li>
            <li>
              <a href="/privacy-policy" className="hover:underline">
                Contact us
              </a>
            </li>
            <li>
              <a href="/return-refund-policy" className="hover:underline">
                Blog
              </a>
            </li>
            <li>
              <a href="/return-refund-policy" className="hover:underline">
                videos
              </a>
            </li>
          </ul>
        </div>

        {/* Right: Contact & Social */}
        <div className="md:text-right flex flex-col items-end space-y-2">
          {/* Contact Heading */}
          <h2 className="text-lg font-semibold">Contact</h2>

          {/* Contact details */}
          <div className="flex flex-col md:items-end text-sm space-y-1">
            <div className="flex items-center space-x-2">
              <MdOutlineAddIcCall className="text-xl" />
              <span>+1 (907) 555-0101</span>
            </div>
            <div className="flex items-center space-x-2">
              <IoMailUnreadOutline size={20} />
              <span>curtis.weaver@example.com</span>
            </div>
          </div>

          {/* Social Media Heading */}
          <h3 className="text-lg font-semibold mt-4">Social Media</h3>

          {/* Social Media Icons */}
          <div className="flex md:justify-end gap-3 mt-2">
            {social.instagram && social.instagram !== "#" && (
              <a
                href={social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black rounded-full p-2 hover:scale-110 transition-transform"
              >
                <FaInstagram />
              </a>
            )}
            {social.facebook && social.facebook !== "#" && (
              <a
                href={social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black rounded-full p-2 hover:scale-110 transition-transform"
              >
                <FaFacebookF />
              </a>
            )}
            {social.youtube && social.youtube !== "#" && (
              <a
                href={social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black rounded-full p-2 hover:scale-110 transition-transform"
              >
                <FaYoutube />
              </a>
            )}
            {social.whatsapp && social.whatsapp !== "#" && (
              <a
                href={social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black rounded-full p-2 hover:scale-110 transition-transform"
              >
                <FaWhatsapp />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-xs sm:text-sm">
        © 2077 Nsantronics. All rights reserved.
        <a href="https://rfchh.com" className="hover:underline">
          rfchh.com
        </a>
      </div>
    </footer>
  );
};

export default Footer;
