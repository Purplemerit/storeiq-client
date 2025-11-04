import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

// Helper: Check if string is a valid email
function isEmail(value: string): boolean {
  // Simple email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!email) {
      toast.error("Missing Email: Please enter your email.");
      return;
    }
    if (!password) {
      toast.error("Missing Password: Please enter your password.");
      return;
    }
    // If email looks like an email, validate format
    if (email.includes("@")) {
      if (!isEmail(email)) {
        toast.error("Invalid Email: Please enter a valid email address.");
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
          }),
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        // Check for invalid credentials
        if (
          data.message &&
          typeof data.message === "string" &&
          /invalid|incorrect|wrong/i.test(data.message)
        ) {
          setError("Email or password is incorrect");
          toast.error("Login Failed: Email or password is incorrect");
        } else {
          setError(data.message || "Login failed.");
          toast.error(`Login Failed: ${data.message || "Login failed."}`);
        }
      } else {
        login(data.token, data.user);
        navigate("/dashboard");
        toast.success("Logged in successfully", { icon: "✅" });
      }
    } catch (err) {
      setError("Network error. Please try again.");
      toast.error("Network Error: Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = `${
      import.meta.env.VITE_API_BASE_URL
    }/auth/google/login`;
  };

  const handleFacebookAuth = () => {
    window.location.href = `${
      import.meta.env.VITE_API_BASE_URL
    }/auth/facebook/login`;
  };

  const handleGithubAuth = () => {
    window.location.href = `${
      import.meta.env.VITE_API_BASE_URL
    }/auth/github/login`;
  };

  const handleForgotPassword = () => {
    toast("Forgot password functionality coming soon!");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="min-h-screen bg-storiq-dark flex flex-col relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-storiq-purple/40 to-storiq-blue/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-storiq-blue/30 to-storiq-purple/30 rounded-full blur-3xl"></div>
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-storiq-purple/30 to-storiq-blue/30 rounded-full blur-3xl opacity-50"></div>

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

      <div className="flex flex-1 pt-32">
        {/* Added padding-top to position form below header level */}
        {/* Left Side - Welcome Message */}
        <div className="flex-1 flex items-center justify-center px-8 z-10">
          <div className="max-w-xl">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Welcome Back.!
            </h1>

            <div className="border border-white/20 rounded-lg px-6 py-3 inline-block">
              <span className="text-white/70 italic text-lg">
                Skip the lag ?
              </span>
              <div className="border-t border-dashed border-white/30 mt-3"></div>
            </div>
          </div>
        </div>
        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center px-8 z-10">
          <div className="inline-flex flex-col justify-end items-center border shadow-[-8px_4px_5px_0_rgba(0,0,0,0.24)] backdrop-blur-[26.5px] w-[420px] h-[700px] pt-[50px] pb-[40px] px-8 rounded-[20px] border-solid border-[#AFAFAF] max-md:w-[380px] max-md:h-[650px] max-md:pt-[45px] max-md:pb-[30px] max-md:px-7 max-sm:w-[90vw] max-sm:max-w-[350px] max-sm:h-auto max-sm:min-h-[550px] max-sm:pt-8 max-sm:pb-5 max-sm:px-5">
            <div className="flex flex-col items-center gap-[50px] w-full max-md:gap-12 max-sm:gap-[40px]">
              <div className="flex flex-col items-start gap-[30px] w-full">
                <section className="flex flex-col items-start gap-3 w-full">
                  <header className="flex flex-col items-start">
                    <h1 className="text-white text-3xl font-semibold">Login</h1>
                    <p className="text-white text-sm font-medium">
                      Glad you're back.!
                    </p>
                  </header>

                  <form
                    onSubmit={handleLogin}
                    className="flex flex-col items-start gap-[18px] max-md:gap-4 max-sm:gap-[12px] w-full"
                    noValidate
                  >
                    <div className="flex flex-col gap-1 w-full">
                      <div
                        className={`flex w-full items-center gap-2.5 border px-3 py-2.5 rounded-lg border-solid ${
                          email && !isEmail(email)
                            ? "border-red-500 border-2"
                            : "border-white"
                        }`}
                      >
                        <input
                          type="text"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onBlur={(e) => {
                            if (e.target.value && !isEmail(e.target.value)) {
                              toast.error("Invalid email format");
                            }
                          }}
                          className="text-white text-base font-normal bg-transparent border-none outline-none w-full placeholder:text-white"
                          aria-label="Username"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-2.5 w-full">
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex w-full justify-between items-center border px-3 py-2.5 rounded-lg border-solid border-white">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="text-white text-base font-normal bg-transparent border-none outline-none w-full placeholder:text-white"
                            aria-label="Password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="w-[16px] h-[16px] flex-shrink-0 hover:opacity-80 transition-opacity"
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-full h-full"
                            >
                              <path
                                d="M16.0315 12.304C15.9672 12.3407 15.8964 12.3643 15.823 12.3735C15.7496 12.3827 15.6751 12.3774 15.6038 12.3578C15.5325 12.3382 15.4657 12.3047 15.4074 12.2593C15.349 12.2139 15.3002 12.1574 15.2636 12.0931L13.9277 9.75872C13.151 10.2839 12.2943 10.6795 11.3908 10.9301L11.8036 13.4065C11.8157 13.4794 11.8134 13.554 11.7968 13.626C11.7801 13.698 11.7494 13.7661 11.7064 13.8262C11.6635 13.8863 11.6091 13.9374 11.5464 13.9765C11.4836 14.0156 11.4138 14.042 11.3409 14.0541C11.3109 14.059 11.2806 14.0616 11.2502 14.0618C11.1171 14.0616 10.9884 14.0143 10.887 13.9281C10.7856 13.842 10.7179 13.7227 10.6961 13.5915L10.2904 11.16C9.43488 11.2791 8.56695 11.2791 7.71138 11.16L7.30568 13.5915C7.28385 13.723 7.21602 13.8424 7.11428 13.9286C7.01255 14.0148 6.88352 14.062 6.75021 14.0618C6.71912 14.0617 6.68808 14.0591 6.6574 14.0541C6.58448 14.042 6.51467 14.0156 6.45195 13.9765C6.38923 13.9374 6.33483 13.8863 6.29186 13.8262C6.24889 13.7661 6.2182 13.698 6.20154 13.626C6.18487 13.554 6.18256 13.4794 6.19474 13.4065L6.60958 10.9301C5.70651 10.6787 4.85022 10.2824 4.07411 9.75661L2.7424 12.0931C2.70546 12.1574 2.65621 12.2139 2.59746 12.2592C2.53871 12.3046 2.47161 12.3379 2.39998 12.3573C2.32836 12.3766 2.25361 12.3817 2.18002 12.3722C2.10643 12.3627 2.03543 12.3389 1.97107 12.3019C1.90671 12.265 1.85026 12.2157 1.80493 12.157C1.75961 12.0982 1.7263 12.0311 1.70691 11.9595C1.68751 11.8879 1.68242 11.8131 1.69191 11.7395C1.70141 11.666 1.72531 11.5949 1.76224 11.5306L3.16849 9.06965C2.67454 8.64291 2.22034 8.17223 1.81146 7.6634C1.76047 7.60647 1.72161 7.53974 1.69727 7.46729C1.67292 7.39485 1.6636 7.3182 1.66986 7.24202C1.67612 7.16585 1.69785 7.09175 1.7337 7.02425C1.76955 6.95676 1.81878 6.89727 1.87839 6.84943C1.938 6.80159 2.00673 6.76641 2.08039 6.74601C2.15405 6.72562 2.23109 6.72045 2.30681 6.73083C2.38253 6.7412 2.45535 6.7669 2.52081 6.80635C2.58627 6.8458 2.64301 6.89817 2.68755 6.96028C3.85474 8.4045 5.89661 10.1243 9.00021 10.1243C12.1038 10.1243 14.1457 8.40239 15.3129 6.96028C15.3569 6.8969 15.4135 6.84326 15.4792 6.8027C15.5448 6.76214 15.6181 6.73553 15.6945 6.72451C15.7709 6.71349 15.8487 6.71831 15.9232 6.73867C15.9976 6.75903 16.0671 6.79449 16.1272 6.84284C16.1874 6.89119 16.2369 6.9514 16.2728 7.01973C16.3087 7.08806 16.3301 7.16304 16.3358 7.24C16.3414 7.31697 16.3312 7.39428 16.3057 7.46712C16.2802 7.53996 16.24 7.60677 16.1876 7.6634C15.7787 8.17223 15.3245 8.64291 14.8305 9.06965L16.2368 11.5306C16.2745 11.5947 16.2992 11.6657 16.3093 11.7395C16.3194 11.8132 16.3147 11.8882 16.2957 11.9602C16.2766 12.0321 16.2434 12.0996 16.198 12.1586C16.1527 12.2176 16.0961 12.267 16.0315 12.304Z"
                                fill="white"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="sr-only"
                          aria-describedby="remember-me-label"
                        />
                        <div className="w-[16px] h-[16px]">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-full h-full"
                          >
                            <path
                              d="M5.0625 2.25C4.31658 2.25 3.60121 2.54632 3.07376 3.07376C2.54632 3.60121 2.25 4.31658 2.25 5.0625V12.9375C2.25 13.6834 2.54632 14.3988 3.07376 14.9262C3.60121 15.4537 4.31658 15.75 5.0625 15.75H12.9375C13.6834 15.75 14.3988 15.4537 14.9262 14.9262C15.4537 14.3988 15.75 13.6834 15.75 12.9375V5.0625C15.75 4.31658 15.4537 3.60121 14.9262 3.07376C14.3988 2.54632 13.6834 2.25 12.9375 2.25H5.0625ZM12.2108 7.71075L8.27325 11.6483C8.221 11.7006 8.15893 11.7422 8.09059 11.7706C8.02225 11.7989 7.94899 11.8135 7.875 11.8135C7.80101 11.8135 7.72775 11.7989 7.65941 11.7706C7.59107 11.7422 7.529 11.7006 7.47675 11.6483L5.78925 9.96075C5.73695 9.90845 5.69547 9.84636 5.66716 9.77803C5.63886 9.7097 5.62429 9.63646 5.62429 9.5625C5.62429 9.48854 5.63886 9.4153 5.66716 9.34697C5.69547 9.27864 5.73695 9.21655 5.78925 9.16425C5.89487 9.05863 6.03813 8.99929 6.1875 8.99929C6.26146 8.99929 6.3347 9.01386 6.40303 9.04216C6.47136 9.07047 6.53345 9.11195 6.58575 9.16425L7.875 10.4546L11.4142 6.91425C11.5199 6.80863 11.6631 6.74929 11.8125 6.74929C11.9619 6.74929 12.1051 6.80863 12.2108 6.91425C12.3164 7.01987 12.3757 7.16313 12.3757 7.3125C12.3757 7.46187 12.3164 7.60513 12.2108 7.71075Z"
                              fill="url(#paint0_linear_checkbox)"
                            />
                            <defs>
                              <linearGradient
                                id="paint0_linear_checkbox"
                                x1="9"
                                y1="2.25"
                                x2="9"
                                y2="15.75"
                                gradientUnits="userSpaceOnUse"
                              >
                                <stop stopColor="#7CC1F3" />
                                <stop offset="1" stopColor="#D27EEF" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                        <span
                          id="remember-me-label"
                          className="text-white text-sm font-medium"
                        >
                          Remember me
                        </span>
                      </label>
                    </div>

                    {error && (
                      <div className="text-red-400 text-sm text-center w-full">
                        {error}
                      </div>
                    )}

                    <div className="flex flex-col justify-center items-center gap-3 w-full">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full justify-center items-center gap-2.5 cursor-pointer px-2.5 py-2.5 rounded-lg bg-gradient-to-r from-[#7CC1F3] to-[#D27EEF] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="text-white text-base font-semibold">
                          {loading ? "Logging in..." : "Login"}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-white text-sm font-medium cursor-pointer hover:underline"
                      >
                        Forgot password ?
                      </button>
                    </div>
                  </form>
                </section>
              </div>

              {/* Social Login Buttons */}
              <section
                className="flex flex-col items-center gap-2.5 w-full"
                aria-label="Social login options"
              >
                <div
                  className="flex items-center gap-5"
                  role="separator"
                  aria-label="Alternative login methods"
                >
                  <div className="w-[130px] h-0.5 bg-[#4D4D4D]" />
                  <span className="text-[#4D4D4D] text-sm font-medium">Or</span>
                  <div className="w-[130px] h-0.5 bg-[#4D4D4D]" />
                </div>

                <div className="flex justify-center items-center gap-[18px]">
                  <button
                    onClick={handleGoogleAuth}
                    className="w-[36px] h-[36px] cursor-pointer hover:opacity-80 transition-opacity"
                    aria-label="Login with Google"
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
                    aria-label="Login with Facebook"
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
                    aria-label="Login with GitHub"
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

            <footer className="flex flex-col items-center gap-2 mt-6">
              <button
                onClick={handleSignup}
                className="text-white text-sm font-medium hover:underline cursor-pointer"
              >
                Don't have an account ? Signup
              </button>

              <nav className="flex w-full justify-between items-center px-1.5 py-1 rounded-md gap-4 max-sm:flex-col max-sm:gap-2.5 max-sm:text-center">
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
  );
};

export default Login;
