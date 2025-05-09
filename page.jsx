"use client";
import React from "react";

function MainComponent() {
  const { data: user } = useUser();
  const [currentTheme, setCurrentTheme] = useState({
    name: "default",
    type: "static",
  });
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  // Theme definitions
  const themes = {
    // Static Themes
    default: {
      type: "static",
      background: "bg-[#1a1b1e]",
      secondary: "bg-[#1e1f22]",
      accent: "bg-[#357AFF]",
      text: "text-white",
      textMuted: "text-gray-300",
    },
    dark: {
      type: "static",
      background: "bg-black",
      secondary: "bg-gray-900",
      accent: "bg-purple-600",
      text: "text-white",
      textMuted: "text-gray-300",
    },
    light: {
      type: "static",
      background: "bg-gray-100",
      secondary: "bg-white",
      accent: "bg-blue-600",
      text: "text-gray-900",
      textMuted: "text-gray-700",
    },
    // Gradient Themes
    sunset: {
      type: "gradient",
      background: "bg-gradient-to-br from-orange-500 to-purple-600",
      secondary: "bg-black/40",
      accent: "bg-white",
      text: "text-white",
      textMuted: "text-gray-200",
    },
    ocean: {
      type: "gradient",
      background: "bg-gradient-to-br from-blue-400 to-blue-800",
      secondary: "bg-black/30",
      accent: "bg-white",
      text: "text-white",
      textMuted: "text-blue-50",
    },
    forest: {
      type: "gradient",
      background: "bg-gradient-to-br from-green-400 to-green-800",
      secondary: "bg-black/40",
      accent: "bg-white",
      text: "text-white",
      textMuted: "text-green-50",
    },
    // Animated Themes
    aurora: {
      type: "animated",
      secondary: "bg-black/40",
      accent: "bg-white",
      text: "text-white",
      textMuted: "text-gray-100",
    },
    cosmic: {
      type: "animated",
      secondary: "bg-black/40",
      accent: "bg-white",
      text: "text-white",
      textMuted: "text-gray-100",
    },
    northern: {
      type: "animated",
      secondary: "bg-black/40",
      accent: "bg-white",
      text: "text-white",
      textMuted: "text-blue-50",
    },
    // Particle Themes
    starfield: {
      type: "particle",
      background: "bg-black",
      secondary: "bg-black/40",
      accent: "bg-white",
      text: "text-white",
      textMuted: "text-gray-300",
    },
    bubbles: {
      type: "particle",
      background: "bg-blue-900",
      secondary: "bg-black/40",
      accent: "bg-white",
      text: "text-white",
      textMuted: "text-blue-200",
    },
    confetti: {
      type: "particle",
      background: "bg-purple-900",
      secondary: "bg-black/40",
      accent: "bg-white",
      text: "text-white",
      textMuted: "text-purple-200",
    },
  };

  // Add animated and particle theme styles
  const themeStyles = (
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

      /* Particle Effects */
      .particle {
        position: absolute;
        pointer-events: none;
        z-index: 0;
      }

      /* Starfield */
      @keyframes twinkle {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }

      .theme-starfield {
        overflow: hidden;
        background: black;
      }

      .theme-starfield .particle {
        width: 2px;
        height: 2px;
        background: white;
        border-radius: 50%;
        animation: twinkle 1s infinite;
      }

      /* Bubbles */
      @keyframes float {
        0% { transform: translateY(100vh) scale(0); }
        100% { transform: translateY(-100px) scale(1); }
      }

      .theme-bubbles {
        overflow: hidden;
        background: linear-gradient(to bottom, #1a365d, #2d3748);
      }

      .theme-bubbles .particle {
        width: 20px;
        height: 20px;
        background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
        border-radius: 50%;
        animation: float 8s infinite;
      }

      /* Confetti */
      @keyframes confettiFall {
        0% { transform: translateY(-100px) rotate(0deg); }
        100% { transform: translateY(100vh) rotate(360deg); }
      }

      .theme-confetti {
        overflow: hidden;
        background: linear-gradient(to bottom, #4a1d96, #6b21a8);
      }

      .theme-confetti .particle {
        width: 10px;
        height: 10px;
        background: white;
        clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
        animation: confettiFall 5s linear infinite;
      }
    `}</style>
  );

  const activeTheme = themes[currentTheme.name];
  const isAnimatedTheme = currentTheme.type === "animated";
  const isParticleTheme = currentTheme.type === "particle";

  // Particle effect management
  useEffect(() => {
    if (!isParticleTheme) return;

    const container = document.querySelector(".particle-container");
    if (!container) return;

    const particles = [];
    const particleCount =
      currentTheme.name === "starfield"
        ? 100
        : currentTheme.name === "bubbles"
        ? 30
        : 50; // confetti

    // Clear existing particles
    container.innerHTML = "";

    // Create new particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";

      // Set random positions
      const x = Math.random() * 100;
      const delay = Math.random() * 5;

      particle.style.left = `${x}%`;
      particle.style.animationDelay = `${delay}s`;

      if (currentTheme.name === "starfield") {
        particle.style.animationDuration = `${1 + Math.random() * 2}s`;
      } else if (currentTheme.name === "bubbles") {
        particle.style.animationDuration = `${8 + Math.random() * 4}s`;
        particle.style.width = particle.style.height = `${
          10 + Math.random() * 20
        }px`;
      } else if (currentTheme.name === "confetti") {
        particle.style.animationDuration = `${3 + Math.random() * 3}s`;
        particle.style.backgroundColor = `hsl(${
          Math.random() * 360
        }, 70%, 50%)`;
      }

      container.appendChild(particle);
      particles.push(particle);
    }

    return () => {
      container.innerHTML = "";
    };
  }, [currentTheme.name, isParticleTheme]);

  const handleThemeChange = (themeName, type) => {
    setCurrentTheme({ name: themeName, type });
    setShowThemeSelector(false);
  };

  // Theme category icons - add particle icon
  const themeIcons = {
    static: "fas fa-circle",
    gradient: "fas fa-gradient",
    animated: "fas fa-sparkles",
    particle: "fas fa-stars",
  };

  return (
    <div
      className={`min-h-screen relative ${
        isAnimatedTheme
          ? `theme-${currentTheme.name}`
          : isParticleTheme
          ? `theme-${currentTheme.name}`
          : activeTheme.background
      }`}
    >
      {themeStyles}

      {/* Particle container */}
      {isParticleTheme && (
        <div className="particle-container absolute inset-0 overflow-hidden" />
      )}

      {/* Theme Selector Button */}
      <div className="fixed bottom-4 right-4 z-50 md:top-4 md:bottom-auto">
        <button
          onClick={() => setShowThemeSelector(!showThemeSelector)}
          className={`rounded-full p-3 ${activeTheme.secondary} backdrop-blur-sm hover:opacity-80`}
        >
          <i className={`fas fa-palette ${activeTheme.text}`}></i>
        </button>

        {/* Theme Selection Modal */}
        {showThemeSelector && (
          <div className="fixed bottom-16 right-4 md:top-16 md:bottom-auto">
            <div
              className={`w-64 rounded-lg ${activeTheme.secondary} backdrop-blur-sm p-4 shadow-lg`}
            >
              {/* Static Themes */}
              <div className="mb-4">
                <h3
                  className={`mb-2 flex items-center gap-2 font-semibold ${activeTheme.text}`}
                >
                  <i className={`${themeIcons.static} text-sm`}></i>
                  Static
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(themes)
                    .filter(([_, theme]) => theme.type === "static")
                    .map(([name, theme]) => (
                      <button
                        key={name}
                        onClick={() => handleThemeChange(name, "static")}
                        className={`h-8 w-full rounded-md ${theme.background} ${
                          currentTheme.name === name ? "ring-2 ring-white" : ""
                        }`}
                        title={name.charAt(0).toUpperCase() + name.slice(1)}
                      />
                    ))}
                </div>
              </div>

              {/* Gradient Themes */}
              <div className="mb-4">
                <h3
                  className={`mb-2 flex items-center gap-2 font-semibold ${activeTheme.text}`}
                >
                  <i className={`${themeIcons.gradient} text-sm`}></i>
                  Gradient
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(themes)
                    .filter(([_, theme]) => theme.type === "gradient")
                    .map(([name, theme]) => (
                      <button
                        key={name}
                        onClick={() => handleThemeChange(name, "gradient")}
                        className={`h-8 w-full rounded-md ${theme.background} ${
                          currentTheme.name === name ? "ring-2 ring-white" : ""
                        }`}
                        title={name.charAt(0).toUpperCase() + name.slice(1)}
                      />
                    ))}
                </div>
              </div>

              {/* Animated Themes */}
              <div>
                <h3
                  className={`mb-2 flex items-center gap-2 font-semibold ${activeTheme.text}`}
                >
                  <i className={`${themeIcons.animated} text-sm`}></i>
                  Animated
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {["aurora", "cosmic", "northern"].map((name) => (
                    <button
                      key={name}
                      onClick={() => handleThemeChange(name, "animated")}
                      className={`h-8 w-full rounded-md theme-${name} ${
                        currentTheme.name === name ? "ring-2 ring-white" : ""
                      }`}
                      title={name.charAt(0).toUpperCase() + name.slice(1)}
                    />
                  ))}
                </div>
              </div>

              {/* Particle Themes */}
              <div className="mb-4">
                <h3
                  className={`mb-2 flex items-center gap-2 font-semibold ${activeTheme.text}`}
                >
                  <i className={`${themeIcons.particle} text-sm`}></i>
                  Particle
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {["starfield", "bubbles", "confetti"].map((name) => (
                    <button
                      key={name}
                      onClick={() => handleThemeChange(name, "particle")}
                      className={`h-8 w-full rounded-md theme-${name} ${
                        currentTheme.name === name ? "ring-2 ring-white" : ""
                      }`}
                      title={name.charAt(0).toUpperCase() + name.slice(1)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <nav
        className={`fixed top-0 z-10 w-full ${activeTheme.secondary} px-4 py-4 backdrop-blur-md`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center">
            <i className={`fas fa-comments text-2xl ${activeTheme.accent}`}></i>
            <span className={`ml-2 text-xl font-bold ${activeTheme.text}`}>
              Reverie
            </span>
          </div>
          <div className="flex items-center gap-4">
            {!user ? (
              <>
                <a
                  href="/account/signin"
                  className={`rounded-lg px-4 py-2 ${activeTheme.text} hover:${activeTheme.accent} hover:bg-opacity-10`}
                >
                  Sign In
                </a>
                <a
                  href="/account/signup"
                  className={`rounded-lg ${activeTheme.accent} px-4 py-2 text-white hover:opacity-80`}
                >
                  Sign Up
                </a>
              </>
            ) : (
              <a
                href="/home"
                className={`rounded-lg ${activeTheme.accent} px-4 py-2 text-white hover:opacity-80`}
              >
                Open App
              </a>
            )}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 pt-24">
        <section className="py-16 md:py-24">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div className="space-y-8">
              <h1
                className={`text-4xl font-bold ${activeTheme.text} md:text-5xl lg:text-6xl`}
              >
                Your Digital Space for Connection
              </h1>
              <p className={`text-lg ${activeTheme.textMuted} md:text-xl`}>
                Welcome to Reverie, where communities thrive and conversations
                come alive. Create your own space, join vibrant communities, and
                connect with friends in real-time.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href="/account/signup"
                  className={`rounded-lg ${activeTheme.accent} px-6 py-3 text-center text-white hover:opacity-80`}
                >
                  Get Started Free
                </a>
                <a
                  href="/account/signin"
                  className={`rounded-lg border ${activeTheme.text} px-6 py-3 text-center hover:${activeTheme.accent} hover:bg-opacity-10`}
                >
                  Sign In
                </a>
              </div>
            </div>
            <div className="relative">
              <div
                className={`aspect-square rounded-2xl ${activeTheme.accent} p-8`}
              >
                <i className="fas fa-comments text-6xl text-white opacity-80"></i>
              </div>
              <div
                className={`absolute -bottom-4 -left-4 aspect-square w-24 rounded-xl ${activeTheme.secondary}`}
              ></div>
              <div
                className={`absolute -right-4 -top-4 aspect-square w-24 rounded-xl ${activeTheme.secondary}`}
              ></div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <h2
            className={`mb-12 text-center text-3xl font-bold ${activeTheme.text} md:text-4xl`}
          >
            Everything You Need to Build Your Community
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div
              className={`rounded-xl ${activeTheme.secondary} p-6 shadow-lg`}
            >
              <i
                className={`fas fa-users mb-4 text-2xl ${activeTheme.accent}`}
              ></i>
              <h3 className={`mb-2 text-xl font-bold ${activeTheme.text}`}>
                Community Servers
              </h3>
              <p className={activeTheme.textMuted}>
                Create and customize your own servers. Invite friends, set
                roles, and build your perfect space.
              </p>
            </div>
            <div
              className={`rounded-xl ${activeTheme.secondary} p-6 shadow-lg`}
            >
              <i
                className={`fas fa-comment-alt mb-4 text-2xl ${activeTheme.accent}`}
              ></i>
              <h3 className={`mb-2 text-xl font-bold ${activeTheme.text}`}>
                Rich Messaging
              </h3>
              <p className={activeTheme.textMuted}>
                Express yourself with text, emojis, reactions, and more. Share
                moments and stay connected.
              </p>
            </div>
            <div
              className={`rounded-xl ${activeTheme.secondary} p-6 shadow-lg`}
            >
              <i
                className={`fas fa-user-friends mb-4 text-2xl ${activeTheme.accent}`}
              ></i>
              <h3 className={`mb-2 text-xl font-bold ${activeTheme.text}`}>
                Friend System
              </h3>
              <p className={activeTheme.textMuted}>
                Add friends, see who's online, and start private conversations
                anytime, anywhere.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default MainComponent;