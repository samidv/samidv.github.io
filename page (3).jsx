"use client";
import React from "react";

function MainComponent() {
  const { data: user, loading } = useUser();
  const [activeTab, setActiveTab] = useState("servers");
  const [currentTheme, setCurrentTheme] = useState(
    user?.theme_preference || { name: "default", type: "static" }
  );
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  // Theme definitions
  const themes = {
    // Static Themes
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
    // Gradient Themes
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

  // Authentication check
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#1a1b1e] text-gray-100">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    window.location.href = `/account/signin?callbackUrl=${encodeURIComponent(
      "/home"
    )}`;
    return null;
  }

  const activeTheme = themes[currentTheme.name] || themes.default;
  const isAnimatedTheme = currentTheme.type === "animated";

  const handleThemeChange = async (themeName, type) => {
    const newTheme = { name: themeName, type };
    try {
      await fetch("/api/user/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: newTheme }),
      });
      setCurrentTheme(newTheme);
    } catch (error) {
      console.error("Failed to update theme:", error);
    }
  };

  return (
    <div
      className={`flex h-screen flex-col ${
        isAnimatedTheme ? `theme-${currentTheme.name}` : activeTheme.background
      } ${activeTheme.text}`}
    >
      {animatedStyles}

      {/* Theme Selector */}
      <div className="absolute right-4 top-4 z-50">
        <button
          onClick={() => setShowThemeSelector(!showThemeSelector)}
          className={`rounded-full p-2 ${activeTheme.secondary} hover:opacity-80`}
        >
          <i className="fas fa-palette"></i>
        </button>

        {showThemeSelector && (
          <div
            className={`absolute right-0 mt-2 w-48 rounded-lg ${activeTheme.secondary} p-2 shadow-lg`}
          >
            <div className="mb-2 border-b border-gray-700 pb-2">
              <h3 className={`mb-2 font-semibold ${activeTheme.text}`}>
                Static
              </h3>
              {Object.entries(themes)
                .filter(([_, theme]) => theme.type === "static")
                .map(([name]) => (
                  <button
                    key={name}
                    onClick={() => handleThemeChange(name, "static")}
                    className={`mb-1 block w-full rounded px-2 py-1 text-left ${
                      currentTheme.name === name ? activeTheme.accent : ""
                    } hover:opacity-80`}
                  >
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </button>
                ))}
            </div>

            <div className="mb-2 border-b border-gray-700 pb-2">
              <h3 className={`mb-2 font-semibold ${activeTheme.text}`}>
                Gradient
              </h3>
              {Object.entries(themes)
                .filter(([_, theme]) => theme.type === "gradient")
                .map(([name]) => (
                  <button
                    key={name}
                    onClick={() => handleThemeChange(name, "gradient")}
                    className={`mb-1 block w-full rounded px-2 py-1 text-left ${
                      currentTheme.name === name ? activeTheme.accent : ""
                    } hover:opacity-80`}
                  >
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </button>
                ))}
            </div>

            <div>
              <h3 className={`mb-2 font-semibold ${activeTheme.text}`}>
                Animated
              </h3>
              {["aurora", "cosmic", "northern"].map((name) => (
                <button
                  key={name}
                  onClick={() => handleThemeChange(name, "animated")}
                  className={`mb-1 block w-full rounded px-2 py-1 text-left ${
                    currentTheme.name === name ? activeTheme.accent : ""
                  } hover:opacity-80`}
                >
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "servers" && (
          <div
            className={`flex h-full flex-col items-center justify-center p-4 ${activeTheme.text}`}
          >
            <div className="mb-4 text-center">
              <i className="fas fa-server mb-4 text-4xl"></i>
              <h2 className="text-xl font-semibold">No Servers Yet</h2>
              <p className={`mt-2 ${activeTheme.textMuted}`}>
                Join or create a server to get started
              </p>
            </div>
            <button
              className={`rounded-lg ${activeTheme.accent} px-6 py-3 font-semibold hover:opacity-80`}
            >
              <i className="fas fa-plus mr-2"></i>Create a Server
            </button>
          </div>
        )}

        {activeTab === "messages" && (
          <div
            className={`flex h-full flex-col items-center justify-center p-4 ${activeTheme.text}`}
          >
            <div className="mb-4 text-center">
              <i className="fas fa-comments mb-4 text-4xl"></i>
              <h2 className="text-xl font-semibold">No Messages Yet</h2>
              <p className={`mt-2 ${activeTheme.textMuted}`}>
                Start a conversation with someone
              </p>
            </div>
            <button
              className={`rounded-lg ${activeTheme.accent} px-6 py-3 font-semibold hover:opacity-80`}
            >
              <i className="fas fa-user-plus mr-2"></i>Add Friends
            </button>
          </div>
        )}

        {activeTab === "friends" && (
          <div
            className={`flex h-full flex-col items-center justify-center p-4 ${activeTheme.text}`}
          >
            <div className="mb-4 text-center">
              <i className="fas fa-user-friends mb-4 text-4xl"></i>
              <h2 className="text-xl font-semibold">No Friends Yet</h2>
              <p className={`mt-2 ${activeTheme.textMuted}`}>
                Add friends to start chatting
              </p>
            </div>
            <button
              className={`rounded-lg ${activeTheme.accent} px-6 py-3 font-semibold hover:opacity-80`}
            >
              <i className="fas fa-user-plus mr-2"></i>Add Friends
            </button>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div
        className={`fixed bottom-0 left-0 right-0 flex h-16 items-center justify-around border-t border-gray-800 ${activeTheme.secondary} md:hidden`}
      >
        <button
          onClick={() => setActiveTab("servers")}
          className={`flex flex-col items-center ${
            activeTab === "servers" ? activeTheme.accent : activeTheme.textMuted
          }`}
        >
          <i className="fas fa-server mb-1"></i>
          <span className="text-xs">Servers</span>
        </button>
        <button
          onClick={() => setActiveTab("messages")}
          className={`flex flex-col items-center ${
            activeTab === "messages"
              ? activeTheme.accent
              : activeTheme.textMuted
          }`}
        >
          <i className="fas fa-comments mb-1"></i>
          <span className="text-xs">Messages</span>
        </button>
        <button
          onClick={() => setActiveTab("friends")}
          className={`flex flex-col items-center ${
            activeTab === "friends" ? activeTheme.accent : activeTheme.textMuted
          }`}
        >
          <i className="fas fa-user-friends mb-1"></i>
          <span className="text-xs">Friends</span>
        </button>
        <button
          onClick={() => (window.location.href = "/profile")}
          className={`flex flex-col items-center ${activeTheme.textMuted}`}
        >
          <i className="fas fa-user mb-1"></i>
          <span className="text-xs">Profile</span>
        </button>
      </div>
    </div>
  );
}

export default MainComponent;