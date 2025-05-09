"use client";
import React from "react";

import { useUpload } from "../utilities/runtime-helpers";

function MainComponent() {
  const { data: user, loading } = useUser();
  const [currentTheme, setCurrentTheme] = useState(
    user?.theme_preference || { name: "default", type: "static" }
  );

  // Theme definitions
  const themes = {
    default: {
      type: "static",
      background: "bg-[#1a1b1e]",
      secondary: "bg-[#1e1f22]",
      accent: "bg-[#357AFF]",
      text: "text-gray-100",
      textMuted: "text-gray-400",
    },
    dark: {
      type: "static",
      background: "bg-black",
      secondary: "bg-gray-900",
      accent: "bg-purple-600",
      text: "text-white",
      textMuted: "text-gray-400",
    },
    light: {
      type: "static",
      background: "bg-gray-100",
      secondary: "bg-white",
      accent: "bg-blue-600",
      text: "text-gray-900",
      textMuted: "text-gray-600",
    },
    sunset: {
      type: "gradient",
      background: "bg-gradient-to-br from-orange-500 to-purple-600",
      secondary: "bg-black/20",
      accent: "bg-white",
      text: "text-white",
      textMuted: "text-gray-200",
    },
    ocean: {
      type: "gradient",
      background: "bg-gradient-to-br from-blue-400 to-blue-800",
      secondary: "bg-white/10",
      accent: "bg-white",
      text: "text-white",
      textMuted: "text-blue-100",
    },
    forest: {
      type: "gradient",
      background: "bg-gradient-to-br from-green-400 to-green-800",
      secondary: "bg-black/20",
      accent: "bg-white",
      text: "text-white",
      textMuted: "text-green-100",
    },
  };

  // Add animated theme styles
  const animatedStyles = (
    <style jsx global>{`
      @keyframes aurora {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .theme-aurora {
        background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
        background-size: 400% 400%;
        animation: aurora 15s ease infinite;
      }
      @keyframes cosmic {
        0% { background-position: 0% 0%; }
        100% { background-position: 100% 100%; }
      }
      .theme-cosmic {
        background: linear-gradient(45deg, #000000, #434343);
        background-size: 200% 200%;
        animation: cosmic 10s linear infinite;
      }
      @keyframes northern {
        0% { background-position: 50% 0%; }
        100% { background-position: 50% 100%; }
      }
      .theme-northern {
        background: linear-gradient(180deg, #2c3e50, #3498db, #2980b9);
        background-size: 100% 200%;
        animation: northern 20s ease infinite;
      }
    `}</style>
  );

  // Add authentication check
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#1a1b1e] text-gray-100">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    window.location.href = `/account/signin?callbackUrl=${encodeURIComponent(
      "/profile"
    )}`;
    return null;
  }

  const [upload, { loading: uploadLoading }] = useUpload();
  const [error, setError] = useState(null);
  const [bio, setBio] = useState("Tell us about yourself...");
  const [status, setStatus] = useState("online");
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState("/avatars/default.jpg");
  const [bannerImage, setBannerImage] = useState(null);

  const activeTheme = themes[currentTheme.name] || themes.default;
  const isAnimatedTheme = currentTheme.type === "animated";

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const { url, error: uploadError } = await upload({ file });
      if (uploadError) throw new Error(uploadError);

      if (type === "profile") {
        setProfileImage(url);
      } else {
        setBannerImage(url);
      }
    } catch (err) {
      setError("Failed to upload image. Please try again.");
      console.error(err);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        const response = await fetch("/api/user/delete", { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to delete account");
        window.location.href = "/";
      } catch (err) {
        setError("Failed to delete account. Please try again.");
        console.error(err);
      }
    }
  };

  return (
    <div
      className={`min-h-screen ${
        isAnimatedTheme ? `theme-${currentTheme.name}` : activeTheme.background
      } ${activeTheme.text}`}
    >
      {animatedStyles}
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="relative mb-8 h-48 w-full overflow-hidden rounded-xl md:h-64">
          {bannerImage ? (
            <img
              src={bannerImage}
              alt="Profile banner"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className={`h-full w-full ${activeTheme.accent}`} />
          )}
          <label className="absolute bottom-4 right-4 cursor-pointer rounded-lg bg-black/50 px-4 py-2 hover:bg-black/70">
            <i className="fas fa-camera mr-2"></i>
            Change Banner
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "banner")}
              className="hidden"
            />
          </label>
        </div>

        <div className="relative mb-8 flex flex-col items-center">
          <div
            className={`relative -mt-20 h-32 w-32 overflow-hidden rounded-full border-4 ${activeTheme.background} ${activeTheme.secondary}`}
          >
            <img
              src={profileImage}
              alt="Profile"
              className="h-full w-full object-cover"
            />
            <label className="absolute bottom-0 left-0 right-0 cursor-pointer bg-black/50 py-2 text-center hover:bg-black/70">
              <i className="fas fa-camera"></i>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "profile")}
                className="hidden"
              />
            </label>
          </div>

          <div className="mt-4 flex items-center">
            <h1 className="text-2xl font-bold">{user?.name || "Username"}</h1>
            <div className="ml-2 flex space-x-2">
              <span
                className={`rounded-full ${activeTheme.accent} px-2 py-1 text-xs`}
              >
                Owner
              </span>
              <span className="rounded-full bg-green-500 px-2 py-1 text-xs">
                Early User
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className={`space-y-6 rounded-xl ${activeTheme.secondary} p-6`}>
            <div>
              <h2 className="mb-4 text-xl font-semibold">Bio</h2>
              {isEditing ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className={`w-full rounded-lg ${activeTheme.background} p-3 ${activeTheme.text}`}
                  rows="4"
                />
              ) : (
                <p className={`rounded-lg ${activeTheme.background} p-3`}>
                  {bio}
                </p>
              )}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`mt-2 ${activeTheme.accent} hover:opacity-80`}
              >
                {isEditing ? "Save" : "Edit"}
              </button>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-semibold">Status</h2>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`w-full rounded-lg ${activeTheme.background} p-3 ${activeTheme.text}`}
              >
                <option value="online">Online</option>
                <option value="idle">Idle</option>
                <option value="dnd">Do Not Disturb</option>
                <option value="invisible">Invisible</option>
              </select>
            </div>
          </div>

          <div className={`space-y-6 rounded-xl ${activeTheme.secondary} p-6`}>
            <div>
              <h2 className="mb-4 text-xl font-semibold">API Keys</h2>
              <div className={`rounded-lg ${activeTheme.background} p-3`}>
                <div className="flex items-center justify-between">
                  <code className="text-sm">sk_live_xxxxx</code>
                  <button className={`${activeTheme.accent} hover:opacity-80`}>
                    <i className="fas fa-copy"></i>
                  </button>
                </div>
              </div>
              <button className={`mt-2 ${activeTheme.accent} hover:opacity-80`}>
                Generate New Key
              </button>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-semibold">Account Settings</h2>
              <div className="space-y-4">
                <button
                  className={`w-full rounded-lg ${activeTheme.background} p-3 text-left hover:${activeTheme.accent} hover:bg-opacity-10`}
                >
                  <i className="fas fa-lock mr-2"></i>
                  Change Password
                </button>
                <button
                  className={`w-full rounded-lg ${activeTheme.background} p-3 text-left hover:${activeTheme.accent} hover:bg-opacity-10`}
                >
                  <i className="fas fa-envelope mr-2"></i>
                  Update Email
                </button>
                <button
                  className={`w-full rounded-lg ${activeTheme.background} p-3 text-left hover:${activeTheme.accent} hover:bg-opacity-10`}
                >
                  <i className="fas fa-bell mr-2"></i>
                  Notification Settings
                </button>
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-semibold text-red-500">
                Danger Zone
              </h2>
              <div className="space-y-4">
                <button className="w-full rounded-lg bg-red-500/10 p-3 text-left text-red-500 hover:bg-red-500/20">
                  <i className="fas fa-user-slash mr-2"></i>
                  Disable Account
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="w-full rounded-lg bg-red-500/10 p-3 text-left text-red-500 hover:bg-red-500/20"
                >
                  <i className="fas fa-trash-alt mr-2"></i>
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-500/10 p-4 text-red-500">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default MainComponent;