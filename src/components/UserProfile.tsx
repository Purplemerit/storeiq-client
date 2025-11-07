import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
  Settings as SettingsIcon,
  LogOut,
  User as UserIcon,
  ChevronDown,
} from "lucide-react";
import { toast } from "react-hot-toast";

const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    toast.success("You have been logged out.");
    navigate("/login");
    setIsOpen(false);
  };

  const handleSettings = () => {
    navigate("/dashboard/settings");
    setIsOpen(false);
  };

  if (!user) return null;

  // Get initials from email or username
  const getInitials = () => {
    if (user.username) {
      return user.username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  return (
    <div className="flex items-center gap-3">
      {/* Settings Icon Button - Desktop Only */}
      <button
        onClick={handleSettings}
        className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-storiq-card-bg border border-storiq-border hover:border-storiq-purple/50 hover:bg-storiq-purple/10 transition-all duration-200 group"
        title="Settings"
      >
        <SettingsIcon
          size={20}
          className="text-white/70 group-hover:text-storiq-purple group-hover:rotate-90 transition-all duration-300"
        />
      </button>

      {/* User Profile Dropdown */}
      <div className="relative" ref={dropdownRef}>
        {/* User Profile Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 px-3 py-2 rounded-full bg-storiq-card-bg border border-storiq-border hover:border-storiq-purple/50 transition-all duration-200 group"
        >
          {/* Profile Picture or Avatar */}
          <div className="relative">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.username || user.email}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-storiq-purple/20 group-hover:ring-storiq-purple/50 transition-all"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-storiq-purple to-purple-700 flex items-center justify-center text-white font-semibold text-sm ring-2 ring-storiq-purple/20 group-hover:ring-storiq-purple/50 transition-all">
                {getInitials()}
              </div>
            )}
          </div>

          {/* User Info - Hidden on mobile */}
          <div className="hidden md:flex flex-col items-start">
            <span className="text-white text-sm font-medium">
              {user.username || user.email?.split("@")[0] || "User"}
            </span>
            <span className="text-white/50 text-xs">
              {user.email?.length > 20
                ? user.email.slice(0, 20) + "..."
                : user.email}
            </span>
          </div>

          {/* Chevron Icon - Hidden on mobile */}
          <ChevronDown
            size={16}
            className={`hidden md:block text-white/70 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-storiq-card-bg border border-storiq-border rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* User Info Header - Shows on mobile dropdown */}
            <div className="md:hidden px-4 py-3 border-b border-storiq-border">
              <p className="text-white text-sm font-medium truncate">
                {user.username || user.email?.split("@")[0] || "User"}
              </p>
              <p className="text-white/50 text-xs truncate">{user.email}</p>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button
                onClick={handleSettings}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-white/80 hover:text-white hover:bg-storiq-purple/20 transition-colors"
              >
                <SettingsIcon size={18} />
                <span className="text-sm font-medium">Settings</span>
              </button>

              <button
                onClick={() => {
                  navigate("/dashboard/settings");
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-white/80 hover:text-white hover:bg-storiq-purple/20 transition-colors"
              >
                <UserIcon size={18} />
                <span className="text-sm font-medium">Account</span>
              </button>
            </div>

            {/* Logout Button */}
            <div className="border-t border-storiq-border py-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={18} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
