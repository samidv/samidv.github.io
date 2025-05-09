"use client";
import React from "react";

import { useUpload } from "../utilities/runtime-helpers";

function MainComponent() {
  const { data: user, loading } = useUser();

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
      "/server/settings"
    )}`;
    return null;
  }

  const [serverName, setServerName] = useState("Gaming Hub");
  const [roles, setRoles] = useState([
    { id: 1, name: "Admin", color: "#FF0000", permissions: ["all"] },
    {
      id: 2,
      name: "Moderator",
      color: "#00FF00",
      permissions: ["kick", "ban"],
    },
    { id: 3, name: "Member", color: "#0000FF", permissions: ["chat"] },
  ]);
  const [members] = useState([
    { id: 1, name: "John Doe", role: "Admin", status: "online" },
    { id: 2, name: "Jane Smith", role: "Moderator", status: "offline" },
    { id: 3, name: "Bob Johnson", role: "Member", status: "idle" },
  ]);
  const [channels] = useState([
    { id: 1, name: "general", type: "text" },
    { id: 2, name: "voice-chat", type: "voice" },
    { id: 3, name: "announcements", type: "announcement" },
  ]);
  const [bannedUsers] = useState([
    { id: 1, name: "Troll User", reason: "Spam", date: "2025-01-15" },
  ]);
  const [serverIcon, setServerIcon] = useState("/server-icon.png");
  const [isVerified, setIsVerified] = useState(true);
  const [error, setError] = useState(null);
  const [upload, { loading: uploadLoading }] = useUpload();
  const [activeSection, setActiveSection] = useState("overview");

  const handleIconUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const { url, error: uploadError } = await upload({ file });
      if (uploadError) throw new Error(uploadError);
      setServerIcon(url);
    } catch (err) {
      setError("Failed to upload server icon");
      console.error(err);
    }
  };

  const handleDeleteServer = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this server? This action cannot be undone."
      )
    ) {
      // Server deletion logic would go here
    }
  };

  const sections = {
    overview: (
      <div className="space-y-6">
        <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <div className="relative h-24 w-24">
            <img
              src={serverIcon}
              alt="Server icon"
              className="h-full w-full rounded-full object-cover"
            />
            <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-[#357AFF] p-2 text-white hover:bg-[#2E69DE]">
              <i className="fas fa-camera"></i>
              <input
                type="file"
                accept="image/*"
                onChange={handleIconUpload}
                className="hidden"
              />
            </label>
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
              className="w-full rounded-lg bg-[#1a1b1e] p-3 text-xl text-gray-100"
            />
            {isVerified && (
              <div className="mt-2 flex items-center">
                <i className="fas fa-check-circle mr-2 text-[#357AFF]"></i>
                <span className="text-sm text-gray-400">Verified Server</span>
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    roles: (
      <div className="space-y-4">
        {roles.map((role) => (
          <div
            key={role.id}
            className="flex items-center justify-between rounded-lg bg-[#1a1b1e] p-4"
          >
            <div className="flex items-center">
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: role.color }}
              ></div>
              <span className="ml-3">{role.name}</span>
            </div>
            <div className="flex space-x-2">
              <button className="rounded-lg bg-[#357AFF]/10 p-2 text-[#357AFF] hover:bg-[#357AFF]/20">
                <i className="fas fa-edit"></i>
              </button>
              <button className="rounded-lg bg-red-500/10 p-2 text-red-500 hover:bg-red-500/20">
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
        <button className="w-full rounded-lg bg-[#357AFF] p-3 text-white hover:bg-[#2E69DE]">
          <i className="fas fa-plus mr-2"></i>Create New Role
        </button>
      </div>
    ),
    members: (
      <div className="space-y-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between rounded-lg bg-[#1a1b1e] p-4"
          >
            <div className="flex items-center">
              <div className="relative">
                <img
                  src="/avatars/default.jpg"
                  alt={member.name}
                  className="h-10 w-10 rounded-full"
                />
                <div
                  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#2b2d31] ${
                    member.status === "online"
                      ? "bg-green-500"
                      : member.status === "idle"
                      ? "bg-yellow-500"
                      : "bg-gray-500"
                  }`}
                ></div>
              </div>
              <div className="ml-3">
                <div>{member.name}</div>
                <div className="text-sm text-gray-400">{member.role}</div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="rounded-lg bg-yellow-500/10 p-2 text-yellow-500 hover:bg-yellow-500/20">
                <i className="fas fa-user-slash"></i>
              </button>
              <button className="rounded-lg bg-red-500/10 p-2 text-red-500 hover:bg-red-500/20">
                <i className="fas fa-ban"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    ),
    channels: (
      <div className="space-y-4">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className="flex items-center justify-between rounded-lg bg-[#1a1b1e] p-4"
          >
            <div className="flex items-center">
              <i
                className={`fas fa-${
                  channel.type === "voice"
                    ? "microphone"
                    : channel.type === "announcement"
                    ? "bullhorn"
                    : "hashtag"
                } text-gray-400`}
              ></i>
              <span className="ml-3">{channel.name}</span>
            </div>
            <div className="flex space-x-2">
              <button className="rounded-lg bg-[#357AFF]/10 p-2 text-[#357AFF] hover:bg-[#357AFF]/20">
                <i className="fas fa-cog"></i>
              </button>
              <button className="rounded-lg bg-red-500/10 p-2 text-red-500 hover:bg-red-500/20">
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
        <button className="w-full rounded-lg bg-[#357AFF] p-3 text-white hover:bg-[#2E69DE]">
          <i className="fas fa-plus mr-2"></i>Create New Channel
        </button>
      </div>
    ),
    bans: (
      <div className="space-y-4">
        {bannedUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between rounded-lg bg-[#1a1b1e] p-4"
          >
            <div>
              <div>{user.name}</div>
              <div className="text-sm text-gray-400">Banned on {user.date}</div>
              <div className="text-sm text-gray-400">Reason: {user.reason}</div>
            </div>
            <button className="rounded-lg bg-[#357AFF]/10 p-2 text-[#357AFF] hover:bg-[#357AFF]/20">
              <i className="fas fa-user-check"></i>
            </button>
          </div>
        ))}
      </div>
    ),
  };

  return (
    <div className="min-h-screen bg-[#2b2d31] text-gray-100">
      <div className="mx-auto max-w-6xl p-4">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Server Settings</h1>
          <button
            onClick={handleDeleteServer}
            className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Delete Server
          </button>
        </div>

        <div className="grid gap-8 md:grid-cols-[240px,1fr]">
          <div className="space-y-2">
            {Object.entries({
              overview: "Overview",
              roles: "Roles",
              members: "Members",
              channels: "Channels",
              bans: "Bans",
            }).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`w-full rounded-lg p-3 text-left ${
                  activeSection === key
                    ? "bg-[#357AFF] text-white"
                    : "hover:bg-[#1a1b1e]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="rounded-lg bg-[#2b2d31] p-6">
            {sections[activeSection]}
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