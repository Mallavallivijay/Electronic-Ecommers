import { useState , useEffect } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import axiosInstance from '../Services/axiosInstance';
import { toast } from "react-hot-toast";
import backgroundImage from "../../assets/background image.png";
 
// import UserNavbar from '../Common/UserNavbar';
 
const OtpVerification = () => {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  // eslint-disable-next-line no-unused-vars
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [showPageLoader, setShowPageLoader] = useState(true);
 
 
  const navigate = useNavigate();
  const location = useLocation();
  const phoneNumber = location.state?.phoneNumber || '';
 
  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
 
    // Focus next input
    if (element.value && element.nextSibling) {
      element.nextSibling.focus();
    }
  };
 
  const handleKeyDown = (e, index) => {
    const newOtp = [...otp];
   
    // Handle backspace
    if (e.key === 'Backspace') {
      if (otp[index] === '') {
        // If current box is empty, move to previous box
        if (index > 0) {
          const prevInput = e.target.previousSibling;
          if (prevInput) {
            prevInput.focus();
            newOtp[index - 1] = '';
            setOtp(newOtp);
          }
        }
      } else {
        // Clear current box
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
   
    // Handle arrow keys
    // if (e.key === 'ArrowLeft' && index > 0) {
    //   e.target.previousSibling.focus();
    // }
    // if (e.key === 'ArrowRight' && index < 5) {
    //   e.target.nextSibling.focus();
    // }
  };
 
  const clearOtp = () => {
    setOtp(new Array(6).fill(''));
    // Focus first input
    const firstInput = document.querySelector('input[placeholder="0"]');
    if (firstInput) firstInput.focus();
  };
 
  useEffect(() => {
  const timer = setTimeout(() => {
    setShowPageLoader(false);
  }, 1000); // Adjust duration as needed
 
  return () => clearTimeout(timer);
}, []);
 
  const handleVerify = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length === 6) {
      try {
        const response = await axiosInstance.post(
          "userAuthentication/verify-user-otp",
          {
            phoneNumber: phoneNumber,
            otp: enteredOtp,
          }
        );
        if (response.status === 200) {
          toast.success("OTP verified successfully!");
          const { token, role, id,userName } = response.data.data;
                  localStorage.setItem("phoneNumber", userName);
                  localStorage.setItem("id", id);
                  localStorage.setItem("role", role);
                  localStorage.setItem("token",token);
          setIsOtpVerified(true);
          if (role === "MANAGER") {
            navigate("/manager/dashboard");
          }
         else{
            navigate("/customer/dashboard");
         }
        } else {
          toast.error("OTP verification failed.");
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || "OTP verification failed.";
        toast.error(errorMessage);
      }
    }
  };

 const resendOtp = () => {
  console.log("Resend OTP clicked");
  setOtp(new Array(6).fill("")); 

  axiosInstance.post("authentication/forgot-password", {
    phoneNumber: phoneNumber, 
  })
    .then(response => {
      console.log("Resend OTP response:", response.data);
      toast.success(response.data.message || "OTP resent successfully!");
    })
    .catch(error => {
      const errorMessage = error.response
        ? error.response.data.message
        : "Network Error";
      toast.error(errorMessage);
      console.error("Resend OTP error:", errorMessage);
    });
};
 

 
 
 
 
  return (
    <>
      {/* <UserNavbar /> */}
 
      <div    style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                minHeight: "100vh",
              }} className="  flex items-center justify-center px-4 py-10 pt-20 gap-2">
       
        <div className="bg-white rounded-md shadow-md w-full max-w-md p-16 mt-8">
            <>              
              <h2 className="text-lg font-semibold text-center">Verify with OTP</h2>
              <p className="text-sm text-gray-600 text-center">sent to your mobile number</p>
              <div className="flex justify-center gap-2 my-4">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    className="w-10 h-10 text-center border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                 
                  />
                ))}
              </div>
              <div className="flex flex-col gap-2 mt-4" >
                 <p className="text-xs text-purple-700 cursor-pointer text-center" onClick={resendOtp}>RESEND OTP</p>
                 <div className="flex gap-2">
                <button
                  className="flex-1 bg-purple-700 text-white py-2 rounded"
                  onClick={handleVerify}
                >
                  Verify
                </button>
                <button
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded"
                  onClick={clearOtp}
                  type="button"
                >
                  Clear
                </button>
                </div>
              </div>
            </>
          </div>
      </div>
    </>
  );
};
 
export default OtpVerification;