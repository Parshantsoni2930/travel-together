import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getReceivedRequests,
  getSentRequests,
} from "../services/requestService";
import { getMessages } from "../services/messageService";
import toast from "react-hot-toast";

const Chats = () => {
  const [chatUsers, setChatUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);

        const receivedData =
          await getReceivedRequests();

        const sentData =
          await getSentRequests();

        const receivedAccepted = (
          receivedData.requests || []
        )
          .filter(
            (req) =>
              req.status === "accepted" &&
              req.sender
          )
          .map((req) => ({
            _id: req.sender._id,
            name: req.sender.name,
            email: req.sender.email,
            profileImage:
              req.sender.profileImage,
          }));

        const sentAccepted = (
          sentData.requests || []
        )
          .filter(
            (req) =>
              req.status === "accepted" &&
              req.receiver
          )
          .map((req) => ({
            _id: req.receiver._id,
            name: req.receiver.name,
            email: req.receiver.email,
            profileImage:
              req.receiver.profileImage,
          }));

        const combined = [
          ...receivedAccepted,
          ...sentAccepted,
        ];

        const uniqueUsers = combined.filter(
          (user, index, self) =>
            index ===
            self.findIndex(
              (u) => u._id === user._id
            )
        );

        const usersWithMessages =
          await Promise.all(
            uniqueUsers.map(async (user) => {
              try {
                const res =
                  await getMessages(
                    user._id
                  );

                const msgs =
                  res.messages || [];

                const last =
                  msgs[msgs.length - 1];

                return {
                  ...user,
                  lastMessage: last
                    ? last.text
                    : "No messages yet",
                };
              } catch {
                return {
                  ...user,
                  lastMessage:
                    "No messages yet",
                };
              }
            })
          );

        setChatUsers(usersWithMessages);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Error loading chats"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const getImageUrl = (img) => {
    if (!img) return null;

    if (img.startsWith("http"))
      return img;

    return `https://travel-together-z3dr.onrender.com${
      img.startsWith("/")
        ? img
        : `/${img}`
    }`;
  };

  return (
    <div style={pageStyle}>
      <div style={heroSection}>
        <div style={heroOverlay}></div>

        <div style={heroContent}>
          <span style={heroBadge}>
            Connect • Chat • Travel
          </span>

          <h1 style={heroTitle}>
            Travel Chats
          </h1>

          <p style={heroText}>
            Talk with accepted travel
            buddies and plan your next
            journey together.
          </p>
        </div>

        <div style={statsGlass}>
          <span style={statsLabel}>
            Active Chats
          </span>

          <h2 style={statsValue}>
            {chatUsers.length}
          </h2>
        </div>
      </div>

      <div style={containerStyle}>
        {loading ? (
          <div style={emptyBox}>
            <h3 style={emptyTitle}>
              Loading chats...
            </h3>
          </div>
        ) : chatUsers.length === 0 ? (
          <div style={emptyBox}>
            <h3 style={emptyTitle}>
              No chats available 😅
            </h3>

            <p style={emptyText}>
              Accepted trip buddies will
              appear here.
            </p>

            <button
              onClick={() =>
                navigate("/home")
              }
              style={exploreBtn}
            >
              Explore Trips
            </button>
          </div>
        ) : (
          <div style={chatList}>
            {chatUsers.map((user) => {
              const imgUrl =
                getImageUrl(
                  user?.profileImage
                );

              const initial = user?.name
                ? user.name
                    .charAt(0)
                    .toUpperCase()
                : "U";

              return (
                <div
                  key={user._id}
                  onClick={() => {
                    if (user?._id) {
                      navigate(
                        `/chat/${user._id}`
                      );
                    }
                  }}
                  style={chatCard}
                >
                  <div style={avatar}>
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={
                          user?.name ||
                          "User"
                        }
                        style={avatarImg}
                      />
                    ) : (
                      <span
                        style={
                          avatarText
                        }
                      >
                        {initial}
                      </span>
                    )}
                  </div>

                  <div style={chatInfo}>
                    <div style={chatTop}>
                      <h3 style={userName}>
                        {user?.name ||
                          "Unknown User"}
                      </h3>

                      <span
                        style={
                          statusDot
                        }
                      >
                        ● Online
                      </span>
                    </div>

                    <p style={lastMsg}>
                      {user?.lastMessage ||
                        "No messages yet"}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      if (user?._id) {
                        navigate(
                          `/user/${user._id}`
                        );
                      }
                    }}
                    style={profileBtn}
                  >
                    Profile
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

/* styles same as yours */

export default Chats;