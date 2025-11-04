import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Helper: Check if any field is empty
  const isAnyFieldEmpty = () =>
    !username.trim() ||
    !emailOrPhone.trim() ||
    !password.trim() ||
    !confirmPassword.trim();

  // Helper: Email regex validation
  const isValidEmail = (email: string) => {
    // RFC 5322 Official Standard
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Helper: Password strength
  const isStrongPassword = (pwd: string) => {
    // Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(pwd);
  };

  // Helper: Passwords match
  const doPasswordsMatch = () => password === confirmPassword;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Empty field check
    if (isAnyFieldEmpty()) {
      toast.error("Please fill in all fields.");
      return;
    }

    // Email format validation
    if (!isValidEmail(emailOrPhone)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Password strength check
    if (!isStrongPassword(password)) {
      toast.error(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    // Passwords match check
    if (!doPasswordsMatch()) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            email: emailOrPhone,
            password,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Registration failed.");
      } else {
        // Auto-login after signup
        login(data.token, data.user);
        toast.success("Welcome! You have been signed up and logged in.");
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = `${
      import.meta.env.VITE_API_BASE_URL
    }/auth/google/register`;
  };

  const handleFacebookAuth = () => {
    window.location.href = `${
      import.meta.env.VITE_API_BASE_URL
    }/auth/facebook/register`;
  };

  const handleGithubAuth = () => {
    window.location.href = `${
      import.meta.env.VITE_API_BASE_URL
    }/auth/github/register`;
  };

  const handleSkipClick = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-storiq-dark flex flex-col relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-storiq-purple/30 to-storiq-blue/30 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-storiq-purple/40 to-storiq-blue/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 -right-10 w-80 h-80 bg-gradient-to-br from-storiq-blue/30 to-storiq-purple/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-48 left-1/3 w-72 h-72 bg-gradient-to-br from-storiq-blue/20 to-storiq-purple/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-10 w-96 h-96 bg-gradient-to-br from-storiq-purple/30 to-storiq-blue/30 rounded-full blur-3xl opacity-50"></div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-8 flex justify-start items-center z-50">
        <div className="bg-white rounded-full flex items-center p-1.5 space-x-4">
          <Link
            to="/"
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div
              style={{
                color: "#000",
                fontFamily: "Orbitron",
                fontSize: "24px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "24px",
                paddingLeft: "1.5rem",
              }}
            >
              STORIQ
            </div>
          </Link>
          <Button
            variant="default"
            className="bg-black text-white hover:bg-gray-800 rounded-full px-5 py-2 text-sm font-semibold"
          >
            SIGN UP
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Left Side */}
        <div className="flex-1 flex items-center justify-center px-8 z-10">
          <div className="max-w-xl">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Roll the Carpet.!
            </h1>

            <button
              onClick={handleSkipClick}
              className="border-4 border-white px-6 py-3.5 hover:bg-white hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#070707]"
            >
              <span className="text-white text-[32px] italic font-semibold hover:text-black">
                Skip the lag ?
              </span>
            </button>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="flex-1 flex items-center justify-center px-8 z-10">
          <div className="inline-flex flex-col justify-end items-center border shadow-[-8px_4px_5px_0_rgba(0,0,0,0.24)] backdrop-blur-[26.5px] w-[420px] h-[700px] pt-[60px] pb-[40px] px-8 rounded-[20px] border-solid border-[#AFAFAF] max-md:w-[380px] max-md:h-[650px] max-md:pt-[50px] max-md:pb-[30px] max-md:px-7 max-sm:w-[90vw] max-sm:max-w-[350px] max-sm:h-auto max-sm:min-h-[550px] max-sm:pt-8 max-sm:pb-5 max-sm:px-5">
            <div className="flex flex-col items-center gap-[40px] w-full max-md:gap-8 max-sm:gap-[25px]">
              <div className="flex flex-col items-start gap-3 w-full">
                <header className="flex flex-col items-start gap-3 w-full">
                  <div className="flex flex-col items-start">
                    <h1 className="text-white text-3xl font-semibold">
                      Signup
                    </h1>
                    <p className="text-white text-sm font-medium">
                      Just some details to get you in.!
                    </p>
                  </div>

                  <form
                    onSubmit={handleSignup}
                    className="flex flex-col items-start gap-[18px] max-md:gap-4 max-sm:gap-[12px] w-full"
                    noValidate
                  >
                    {/* Username Input */}
                    <div className="flex flex-col gap-1 w-full">
                      <div className="flex w-full items-center gap-2.5 border px-3 py-2.5 rounded-lg border-solid border-white">
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Username"
                          className="text-white text-base font-normal bg-transparent border-none outline-none w-full placeholder:text-white"
                          aria-label="Username"
                          required
                        />
                      </div>
                    </div>

                    {/* Email Input */}
                    <div className="flex flex-col gap-1 w-full">
                      <div
                        className={`flex w-full items-center gap-2.5 border px-3 py-2.5 rounded-lg border-solid ${
                          emailOrPhone && !isValidEmail(emailOrPhone)
                            ? "border-red-500 border-2"
                            : "border-white"
                        }`}
                      >
                        <input
                          type="email"
                          value={emailOrPhone}
                          onChange={(e) => setEmailOrPhone(e.target.value)}
                          onBlur={(e) => {
                            if (
                              e.target.value &&
                              !isValidEmail(e.target.value)
                            ) {
                              toast.error("Invalid email format");
                            }
                          }}
                          placeholder="Email / Phone"
                          className="text-white text-base font-normal bg-transparent border-none outline-none w-full placeholder:text-white"
                          aria-label="Email or Phone"
                          required
                        />
                      </div>
                    </div>

                    {/* Password & Confirm Password */}
                    <div className="flex flex-col items-start gap-2.5 w-full">
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex w-full items-center gap-2.5 border px-3 py-2.5 rounded-lg border-solid border-white">
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="text-white text-base font-normal bg-transparent border-none outline-none w-full placeholder:text-white"
                            aria-label="Password"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex w-full items-center gap-2.5 border px-3 py-2.5 rounded-lg border-solid border-white">
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                            className="text-white text-base font-normal bg-transparent border-none outline-none w-full placeholder:text-white"
                            aria-label="Confirm Password"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex flex-col justify-center items-center gap-2 w-full">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full justify-center items-center gap-2.5 px-2.5 py-2.5 rounded-lg bg-gradient-to-r from-[#7CC1F3] to-[#D27EEF] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="text-white text-base font-semibold">
                          {loading ? "Signing up..." : "Signup"}
                        </span>
                      </button>
                    </div>
                  </form>
                </header>

                {/* Social Login Buttons */}
                <section
                  className="flex flex-col items-center gap-2.5 w-full"
                  aria-label="Social login options"
                >
                  <div
                    className="flex items-center gap-4"
                    role="separator"
                    aria-label="Alternative login methods"
                  >
                    <div className="w-[130px] h-0.5 bg-[#4D4D4D]" />
                    <span className="text-[#4D4D4D] text-sm font-medium">
                      Or
                    </span>
                    <div className="w-[130px] h-0.5 bg-[#4D4D4D]" />
                  </div>

                  <div className="flex justify-center items-center gap-[14px]">
                    <button
                      onClick={handleGoogleAuth}
                      className="w-[36px] h-[36px] cursor-pointer hover:opacity-80 transition-opacity"
                      aria-label="Sign up with Google"
                      type="button"
                    >
                      <svg
                        width="36"
                        height="36"
                        viewBox="0 0 42 42"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full h-full"
                      >
                        <g clipPath="url(#clip0_google)">
                          <path
                            d="M14.6304 1.38236C10.4339 2.83815 6.81489 5.60128 4.30489 9.2659C1.79489 12.9305 0.526205 17.3035 0.685185 21.7424C0.844165 26.1813 2.42243 30.4523 5.18816 33.928C7.95389 37.4037 11.7613 39.9008 16.0511 41.0527C19.529 41.9501 23.1728 41.9895 26.6693 41.1675C29.8367 40.456 32.7651 38.9342 35.1677 36.751C37.6683 34.4093 39.4833 31.4303 40.4177 28.1344C41.433 24.5501 41.6137 20.7809 40.946 17.116H21.416V25.2174H32.7265C32.5004 26.5095 32.016 27.7427 31.3022 28.8432C30.5885 29.9438 29.66 30.889 28.5724 31.6224C27.1914 32.5363 25.6344 33.1511 24.0016 33.427C22.3641 33.7316 20.6844 33.7316 19.0469 33.427C17.3871 33.0843 15.817 32.3992 14.4368 31.4156C12.2191 29.8458 10.554 27.6157 9.67895 25.0435C8.78937 22.423 8.78937 19.5822 9.67895 16.9617C10.3018 15.1249 11.3315 13.4526 12.6911 12.0694C14.2471 10.4575 16.2169 9.30526 18.3846 8.73917C20.5523 8.17309 22.834 8.21501 24.9794 8.86033C26.6555 9.37458 28.1881 10.2735 29.455 11.4853C30.7304 10.2166 32.0035 8.94455 33.2744 7.66924C33.9307 6.98345 34.646 6.33049 35.2924 5.6283C33.3582 3.82859 31.088 2.42811 28.6118 1.50705C24.1024 -0.130328 19.1683 -0.174331 14.6304 1.38236Z"
                            fill="white"
                          />
                          <path
                            d="M14.6317 1.38005C19.1692 -0.177701 24.1033 -0.134856 28.6131 1.50146C31.0898 2.42877 33.359 3.836 35.2905 5.64239C34.6342 6.34458 33.9419 7.00083 33.2725 7.68333C31.9994 8.95427 30.7273 10.2208 29.4564 11.483C28.1895 10.2712 26.6568 9.37227 24.9808 8.85802C22.8361 8.21043 20.5544 8.16609 18.3862 8.72986C16.2179 9.29363 14.2469 10.4437 12.6892 12.054C11.3296 13.4371 10.2999 15.1095 9.67703 16.9463L2.875 11.6799C5.30971 6.85173 9.52527 3.15857 14.6317 1.38005Z"
                            fill="#E33629"
                          />
                          <path
                            d="M1.06898 16.8969C1.43431 15.0849 2.04129 13.3301 2.87366 11.6797L9.67569 16.9592C8.78611 19.5797 8.78611 22.4205 9.67569 25.0409C7.40944 26.7909 5.1421 28.5497 2.87366 30.3172C0.790563 26.1707 0.155254 21.4463 1.06898 16.8969Z"
                            fill="#F8BD00"
                          />
                          <path
                            d="M21.4175 17.1133H40.9475C41.6152 20.7782 41.4345 24.5475 40.4192 28.1317C39.4848 31.4277 37.6698 34.4066 35.1692 36.7483C32.974 35.0355 30.769 33.3358 28.5739 31.623C29.6622 30.8889 30.5911 29.9426 31.3049 28.8409C32.0187 27.7392 32.5027 26.5047 32.7279 25.2114H21.4175C21.4142 22.5142 21.4175 19.8138 21.4175 17.1133Z"
                            fill="#587DBD"
                          />
                          <path
                            d="M2.87109 30.3192C5.13953 28.5692 7.40687 26.8105 9.67312 25.043C10.5499 27.6161 12.2174 29.8464 14.4375 31.4152C15.822 32.3942 17.3955 33.0736 19.0575 33.4102C20.695 33.7147 22.3747 33.7147 24.0122 33.4102C25.645 33.1342 27.202 32.5194 28.583 31.6055C30.7781 33.3183 32.9831 35.018 35.1783 36.7308C32.776 38.9152 29.8476 40.4382 26.6798 41.1506C23.1834 41.9726 19.5396 41.9332 16.0617 41.0358C13.3111 40.3013 10.7417 39.0066 8.51484 37.2328C6.15801 35.3613 4.23293 33.003 2.87109 30.3192Z"
                            fill="#319F43"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_google">
                            <rect width="42" height="42" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </button>

                    <button
                      onClick={handleFacebookAuth}
                      className="w-[36px] h-[36px] cursor-pointer hover:opacity-80 transition-opacity"
                      aria-label="Sign up with Facebook"
                      type="button"
                    >
                      <svg
                        width="36"
                        height="36"
                        viewBox="0 0 42 42"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full h-full"
                      >
                        <g clipPath="url(#clip0_facebook)">
                          <path
                            d="M42 21C42 9.40209 32.5979 0 21 0C9.40209 0 0 9.40193 0 21C0 31.4816 7.67944 40.1696 17.7188 41.7449V27.0703H12.3867V21H17.7188V16.3734C17.7188 11.1103 20.854 8.20312 25.6507 8.20312C27.9484 8.20312 30.3516 8.61328 30.3516 8.61328V13.7812H27.7036C25.0947 13.7812 24.2812 15.4001 24.2812 17.0609V21H30.1055L29.1744 27.0703H24.2812V41.7449C34.3206 40.1696 42 31.4818 42 21Z"
                            fill="#1877F2"
                          />
                          <path
                            d="M29.1744 27.0703L30.1055 21H24.2812V17.0609C24.2812 15.3999 25.0948 13.7812 27.7036 13.7812H30.3516V8.61328C30.3516 8.61328 27.9484 8.20312 25.6507 8.20312C20.854 8.20312 17.7188 11.1103 17.7188 16.3734V21H12.3867V27.0703H17.7188V41.7449C18.8042 41.915 19.9013 42.0003 21 42C22.0987 42.0003 23.1958 41.915 24.2812 41.7449V27.0703H29.1744Z"
                            fill="white"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_facebook">
                            <rect width="42" height="42" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </button>

                    <button
                      onClick={handleGithubAuth}
                      className="w-[36px] h-[36px] cursor-pointer hover:opacity-80 transition-opacity"
                      aria-label="Sign up with GitHub"
                      type="button"
                    >
                      <svg
                        width="36"
                        height="36"
                        viewBox="0 0 42 42"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full h-full"
                      >
                        <path
                          d="M21 0C9.3975 0 0 9.3975 0 21C0 30.2925 6.01125 38.1413 14.3587 40.9238C15.4087 41.1075 15.8025 40.4775 15.8025 39.9263C15.8025 39.4275 15.7763 37.7738 15.7763 36.015C10.5 36.9863 9.135 34.7287 8.715 33.5475C8.47875 32.9437 7.455 31.08 6.5625 30.5812C5.8275 30.1875 4.7775 29.2162 6.53625 29.19C8.19 29.1637 9.37125 30.7125 9.765 31.3425C11.655 34.5187 14.6738 33.6263 15.8813 33.075C16.065 31.71 16.6162 30.7913 17.22 30.2662C12.5475 29.7412 7.665 27.93 7.665 19.8975C7.665 17.6138 8.47875 15.7237 9.8175 14.2537C9.6075 13.7287 8.8725 11.5763 10.0275 8.68875C10.0275 8.68875 11.7863 8.1375 15.8025 10.8413C17.4825 10.3688 19.2675 10.1325 21.0525 10.1325C22.8375 10.1325 24.6225 10.3688 26.3025 10.8413C30.3188 8.11125 32.0775 8.68875 32.0775 8.68875C33.2325 11.5763 32.4975 13.7287 32.2875 14.2537C33.6263 15.7237 34.44 17.5875 34.44 19.8975C34.44 27.9562 29.5312 29.7412 24.8588 30.2662C25.62 30.9225 26.2763 32.1825 26.2763 34.1512C26.2763 36.96 26.25 39.2175 26.25 39.9263C26.25 40.4775 26.6438 41.1338 27.6938 40.9238C31.8628 39.5167 35.4856 36.8375 38.0521 33.2634C40.6185 29.6892 41.9993 25.4001 42 21C42 9.3975 32.6025 0 21 0Z"
                          fill="white"
                        />
                      </svg>
                    </button>
                  </div>
                </section>
              </div>

              {/* Footer */}
              <footer className="flex flex-col items-center gap-1.5 w-full">
                <Link
                  to="/login"
                  className="text-white text-sm font-medium hover:underline cursor-pointer"
                >
                  Already Registered? Login
                </Link>

                <nav className="flex w-full justify-between items-center px-1.5 py-1 rounded-md gap-4 max-sm:flex-col max-sm:gap-2 max-sm:text-center">
                  <Link
                    to="/terms-and-conditions"
                    className="flex items-start gap-2.5 max-sm:justify-center"
                  >
                    <span className="text-white text-sm font-normal cursor-pointer hover:underline">
                      Terms & Conditions
                    </span>
                  </Link>
                  <Link
                    to="/about"
                    className="flex items-start gap-2.5 max-sm:justify-center"
                  >
                    <span className="text-white text-sm font-normal cursor-pointer hover:underline">
                      Support
                    </span>
                  </Link>
                  <Link
                    to="/about"
                    className="flex items-start gap-2.5 max-sm:justify-center"
                  >
                    <span className="text-white text-sm font-normal cursor-pointer hover:underline">
                      Customer Care
                    </span>
                  </Link>
                </nav>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
