import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth <= 900);
    checkScreen();

    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setImageError(false);
      }
    };

    loadUser();
    window.addEventListener("userUpdated", loadUser);

    return () => window.removeEventListener("userUpdated", loadUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const getProfileImage = () => {
    const img =
      user?.profileImage ||
      user?.profilePic ||
      user?.photo ||
      user?.avatar ||
      user?.image;

    if (!img) return null;
    if (img.startsWith("http")) return img;

    return ` https://travel-together-z3dr.onrender.com${img.startsWith("/") ? img : `/${img}`}`;
  };

  const isActive = (path) => location.pathname === path;

  const profileImage = getProfileImage();
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  const closeAndGo = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const navItems = [
    { label: "🏠 Home", path: "/home" },
    { label: "➕ Create Trip", path: "/create-trip" },
    { label: "🧳 My Trips", path: "/my-trips" },
    { label: "👥 Requests", path: "/requests" },
    { label: "💬 Chats", path: "/chats" },
    { label: "✨ AI Planner", path: "/ai-planner", ai: true },
  ];

  return (
    <>
      <nav style={navStyle}>
        <div style={brandBox} onClick={() => navigate("/home")}>
          <img
            src="/images/logo.png"
            alt="Travel Buddy Finder"
            style={logoStyle}
          />

          <div>
            <h2 style={brandTitle}>Travel Buddy Finder</h2>
            <p style={brandSub}>
              Find trips, explore places, and connect with buddies.
            </p>
          </div>
        </div>

        {!isMobile && (
          <div style={linksBox}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  ...(item.ai ? aiLinkStyle : linkStyle),
                  ...(isActive(item.path)
                    ? item.ai
                      ? activeAiLink
                      : activeLink
                    : {}),
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}

        <div style={rightStyle}>
          <div onClick={() => navigate("/profile")} style={profileCircle}>
            {profileImage && !imageError ? (
              <img
                src={profileImage}
                alt="profile"
                style={profileImg}
                onError={() => setImageError(true)}
              />
            ) : (
              <span style={initialText}>{userInitial}</span>
            )}
          </div>

          {!isMobile && (
            <button onClick={handleLogout} style={logoutBtn}>
              Logout
            </button>
          )}

          {isMobile && (
            <button
              onClick={() => setMenuOpen(true)}
              style={hamburgerBtn}
              aria-label="Open menu"
            >
              ☰
            </button>
          )}
        </div>
      </nav>

      {isMobile && menuOpen && (
        <div style={overlayStyle} onClick={() => setMenuOpen(false)}>
          <div style={mobileMenu} onClick={(e) => e.stopPropagation()}>
            <div style={mobileTop}>
              <div style={brandBox}>
                <img
                  src="/images/logo.png"
                  alt="Travel Buddy Finder"
                  style={mobileLogo}
                />

                <div>
                  <h2 style={mobileTitle}>Travel Buddy Finder</h2>
                  <p style={brandSub}>Find trips & buddies.</p>
                </div>
              </div>

              <button onClick={() => setMenuOpen(false)} style={closeBtn}>
                ×
              </button>
            </div>

            <div style={mobileLinks}>
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => closeAndGo(item.path)}
                  style={{
                    ...mobileLinkBtn,
                    ...(isActive(item.path) ? mobileActive : {}),
                    ...(item.ai ? mobileAi : {}),
                  }}
                >
                  <span>{item.label}</span>
                  <span>›</span>
                </button>
              ))}

              <button onClick={handleLogout} style={mobileLogout}>
                <span>↪ Logout</span>
                <span>›</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const navStyle = {
  width: "100%",
  boxSizing: "border-box",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "24px",
  padding: "18px 42px",
  minHeight: "95px",
  background:
    "linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,41,59,0.96))",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 10px 35px rgba(0,0,0,0.35)",
  position: "sticky",
  top: 0,
  zIndex: 1000,
  backdropFilter: "blur(10px)",
};

const brandBox = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  cursor: "pointer",
  minWidth: "260px",
};

const logoStyle = {
  width: "70px",
  height: "62px",
  borderRadius: "14px",
  objectFit: "cover",
  background: "#020617",
};

const brandTitle = {
  margin: 0,
  fontSize: "24px",
  fontWeight: "900",
  color: "#ffffff",
};

const brandSub = {
  margin: "4px 0 0",
  fontSize: "13px",
  color: "#cbd5e1",
};

const linksBox = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "14px",
  flexWrap: "wrap",
};


const linkStyle = {
  textDecoration: "none",
  color: "#e5e7eb",
  fontWeight: "800",
  fontSize: "15px",
  padding: "12px 18px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  whiteSpace: "nowrap",
  transition: "0.3s",
};

const activeLink = {
  background: "linear-gradient(135deg, #4f46e5, #ec4899)",
  color: "#fff",
  border: "1px solid transparent",
  boxShadow: "0 6px 18px rgba(236,72,153,0.35)",
};

const aiLinkStyle = {
  ...linkStyle,
  color: "#fbbf24",
  border: "1px solid rgba(251,191,36,0.35)",
};

const activeAiLink = {
  background: "linear-gradient(135deg, #4f46e5, #ec4899)",
  color: "#fff",
};

const rightStyle = {
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: "14px",
  minWidth: "160px",
};

const profileCircle = {
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #4f46e5, #ec4899)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  border: "2px solid rgba(255,255,255,0.85)",
  overflow: "hidden",
};

const profileImg = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const initialText = {
  color: "#fff",
  fontWeight: "900",
  fontSize: "21px",
};

const logoutBtn = {
  padding: "11px 17px",
  borderRadius: "999px",
  border: "none",
  background: "linear-gradient(135deg, #ef4444, #f97316)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "900",
};

const hamburgerBtn = {
  width: "46px",
  height: "46px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.16)",
  background: "rgba(255,255,255,0.08)",
  color: "#fff",
  fontSize: "25px",
  cursor: "pointer",
};

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(2,6,23,0.65)",
  zIndex: 999,
  backdropFilter: "blur(4px)",
};

const mobileMenu = {
  position: "fixed",
  top: 0,
  right: 0,
  width: "86%",
  maxWidth: "390px",
  height: "100vh",
  background:
    "linear-gradient(135deg, rgba(15,23,42,0.98), rgba(2,6,23,0.98))",
  borderLeft: "1px solid rgba(255,255,255,0.12)",
  boxShadow: "-12px 0 35px rgba(0,0,0,0.45)",
  padding: "20px",
};

const mobileTop = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingBottom: "18px",
  borderBottom: "1px solid rgba(255,255,255,0.12)",
};

const mobileLogo = {
  width: "64px",
  height: "58px",
  borderRadius: "14px",
  objectFit: "cover",
};

const mobileTitle = {
  margin: 0,
  fontSize: "19px",
  color: "#fff",
  fontWeight: "900",
};

const closeBtn = {
  width: "42px",
  height: "42px",
  borderRadius: "12px",
  border: "none",
  background: "rgba(255,255,255,0.08)",
  color: "#fff",
  fontSize: "30px",
  cursor: "pointer",
};

const mobileLinks = {
  marginTop: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const mobileLinkBtn = {
  width: "100%",
  padding: "15px 16px",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.06)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "900",
  fontSize: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const mobileActive = {
  background: "linear-gradient(135deg, rgba(79,70,229,0.7), rgba(236,72,153,0.55))",
  border: "1px solid rgba(255,255,255,0.18)",
};

const mobileAi = {
  color: "#fbbf24",
};

const mobileLogout = {
  ...mobileLinkBtn,
  marginTop: "14px",
  color: "#ff6b6b",
  border: "1px solid rgba(239,68,68,0.35)",
};

export default Navbar;