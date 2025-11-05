import { useState, useRef, useEffect } from 'react';
import BackButton from './../../Services/backbutton';
import toast  from 'react-hot-toast';
import axiosInstance from '../../Services/axiosInstance';


const ProfileDetails = () => {
  const [profile, setProfile] = useState({
    businessName: '',
    contactNumber: '',
    mailId: '',
    address: '',
    instagram: '',
    facebook: '',
    youtube: '',
    whatsapp: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoFileName, setLogoFileName] = useState('');
  const [logoUrl, setLogoUrl] = useState(''); // Add this state
  const fileInputRef = useRef(null);
    const token= localStorage.getItem("token");
    const role= localStorage.getItem("role");


  
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get('adminProfile/basicData');
        console.log('API response:', res.data);
        if (res.data && res.data.data) {
          setProfile(res.data.data);
          toast.success('Profile fetched successfully');
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        toast.error('Failed to fetch profile');
      }
    };

    const fetchLogo = async () => {
      try {
        const res = await axiosInstance.get(
          'cloud/store-logo'
        );        
          setLogoUrl(res.data.data);
        console.log( setLogoUrl);
      } catch (err) {
        console.error('Failed to fetch logo:', err);
      }
    };
useEffect(() => {
    fetchProfile();
    fetchLogo();
  }, []);
  

  // Handle text and URL inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "contactNumber") {
      // Allow only digits, no spaces or alphabets
      const onlyDigits = value.replace(/\D/g, "");
      setProfile((prev) => ({
        ...prev,
        [name]: onlyDigits,
      }));
      return;
    }

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file input (logo) - only for preview, no API call
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoFileName(file.name);
    }
  };

  // Upload logo to API and get URL
  const handleLogoUpload = async () => {
    if (!logoFile || !logoFileName) return;
    try {
      // 1. Upload file
      const formData = new FormData();
      formData.append('file', logoFile);
      // If backend requires fileName in query, keep it; else remove from URL
      await axiosInstance.post(
        `cloud/upload_logo?fileName=${encodeURIComponent(logoFileName)}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' },
          Authorization: `Bearer ${token}` },

      );
      // Refresh logo only (no full page reload)
      await fetchLogo();
      toast.success('Logo uploaded successfully');
    } catch (error) {
      console.error('Logo upload failed:', error);
      toast.error('Failed to upload logo');
      alert('Failed to upload logo.');
    } finally {
      setShowModal(false);
      setLogoFile(null);
      setLogoFileName('');
    }
  };

  // Submit handler (profile save, does NOT send logoUrl)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Only send profile fields, NOT logoUrl
    const payload = {
      businessName: profile.businessName,
      contactNumber: profile.contactNumber,
      mailId: profile.mailId,
      address: profile.address,
      instagram: profile.instagram,
      facebook: profile.facebook,
      youtube: profile.youtube,
      whatsapp: profile.whatsapp,
    };

    try {
     await axiosInstance.post(
  'adminProfile/create',
  payload,
  {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }
);

     
      toast.success('Profile saved successfully');
    } catch (error) {
      console.error('Profile save failed:', error);
      toast.error('Failed to save profile');
    }
  };

  const inputStyle =
    'w-full bg-gray-100 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500';

  return (
    <form onSubmit={handleSubmit} className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold flex gap-2 items-center"><BackButton/>Profile</h2>
          <nav className="text-sm text-gray-500">
            <span className="text-indigo-600 cursor-pointer">Dashboard</span> &gt; Profile Setting
          </nav>
        </div>
      </div>

      {/* Logo Upload */}
      {( role!== "ADMIN" ) && (
      <div className="mb-6 max-w-screen-lg">
        <label className="block text-sm font-medium text-gray-700 mb-2">Logo <span className="text-red-500">*</span></label>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-400 overflow-hidden bg-gray-50">
            {logoUrl ? (
              <img src={logoUrl} alt="logo" className="w-full h-full object-cover" />
            ) : logoFile ? (
              <img src={URL.createObjectURL(logoFile)} alt="logo" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400 text-3xl font-bold">+</span>
            )}
          </div>
          <div className="flex flex-col">
            <button
              type="button"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              onClick={() => setShowModal(true)}
            >
              Upload Logo
            </button>
            <div className="text-xs text-gray-500 mt-1">
              PNG or JPG, max 5MB.
            </div>
          </div>
        </div>
      </div>)}

      {/* Modal for logo upload */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Upload Profile Picture</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                File Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 text-sm mb-2"
                placeholder="Enter file name"
                value={logoFileName}
                onChange={e => setLogoFileName(e.target.value)}
                required
              />
              <label className="block text-sm font-medium mb-1">Select Image:</label>
              <input
                type="file"
                accept="image/png, image/jpeg"
                ref={fileInputRef}
                onChange={handleLogoChange}
                className="block"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                onClick={() => {
                  setShowModal(false);
                  setLogoFile(null);
                  setLogoFileName('');
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                onClick={handleLogoUpload}
                disabled={!logoFile || !logoFileName}
                required
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Information */}
      <div className="bg-white p-10 rounded-md shadow border mb-10 max-w-screen-lg">
        <h3 className="text-md font-semibold mb-4">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Business Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="businessName"
              placeholder="Enter the business name"
              className={inputStyle}
              value={profile.businessName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Contact Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="contactNumber"
              placeholder="Enter contact number"
              className={inputStyle}
              value={profile.contactNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Mail ID <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="mailId"
              placeholder="Enter mail id"
              className={inputStyle}
              value={profile.mailId}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              placeholder="Enter address"
              className={inputStyle}
              value={profile.address}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="bg-white p-6 rounded-md shadow border mb-6 max-w-screen-lg">
        <h3 className="text-md font-semibold mb-4">Social Media Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="url"
            name="instagram"
            placeholder="Instagram link"
            className={inputStyle}
            value={profile.instagram}
            onChange={handleInputChange}
          />
          <input
            type="url"
            name="facebook"
            placeholder="Facebook link"
            className={inputStyle}
            value={profile.facebook}
            onChange={handleInputChange}
          />
          <input
            type="url"
            name="youtube"
            placeholder="Youtube link"
            className={inputStyle}
            value={profile.youtube}
            onChange={handleInputChange}
          />
          <input
            type="url"
            name="whatsapp"
            placeholder="Whatsapp link"
            className={inputStyle}
            value={profile.whatsapp}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="text-left">
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default ProfileDetails;
