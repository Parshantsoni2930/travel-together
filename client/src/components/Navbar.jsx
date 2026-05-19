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

    return `https://travel-together-z3dr.onrender.com${
      img.startsWith("/") ? img : `/${img}`
    }`;
  };

  const isActive = (path) => location.pathname === path;

  const profileImage = getProfileImage();
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  const closeAndGo = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const navItems = [
    { label: "Home", path: "/home" },
    { label: "Create Trip", path: "/create-trip" },
    { label: "My Trips", path: "/my-trips" },
    { label: "Requests", path: "/requests" },
    { label: "Chats", path: "/chats" },
    { label: "AI Planner", path: "/ai-planner" },
  ];

  return (
    <>
      <nav style={navStyle}>
        <div style={brandBox} onClick={() => navigate("/home")}>
          <div style={logoBox}>
            <img
              src="/images/logo (2).png"
              alt="TBF"
              style={logoImg}
            />
          </div>

          <div>
            <h2 style={brandTitle}>Travel Buddy Finder</h2>
            <p style={brandSub}>Find trips. Meet buddies. Travel smarter.</p>
          </div>
        </div>

        {!isMobile && (
          <div style={linksBox}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  ...linkStyle,
                  ...(isActive(item.path) ? activeLink : {}),
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
            <button onClick={() => setMenuOpen(true)} style={hamburgerBtn}>
              ☰
            </button>
          )}
        </div>
      </nav>

      {isMobile && menuOpen && (
        <div style={overlayStyle} onClick={() => setMenuOpen(false)}>
          <div style={mobileMenu} onClick={(e) => e.stopPropagation()}>
            <div style={mobileTop}>
              <div style={mobileBrandBox}>
                <img
                  src="/images/logo (2).png"
                  alt="TBF"
                  style={mobileLogoImg}
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
                  }}
                >
                  <span>{item.label}</span>
                  <span>›</span>
                </button>
              ))}

              <button onClick={handleLogout} style={mobileLogout}>
                <span>Logout</span>
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
  minHeight: "92px",
  padding: "18px 42px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "24px",
  background: "rgba(5, 5, 5, 0.92)",
  borderBottom: "1px solid rgba(255,255,255,0.12)",
  boxShadow: "0 12px 35px rgba(0,0,0,0.45)",
  position: "sticky",
  top: 0,
  zIndex: 1000,
  backdropFilter: "blur(14px)",
};

const brandBox = {
  display: "flex",
  alignItems: "center",
  gap: "0px",
  cursor: "pointer",
  minWidth: "360px",
  marginLeft: "-18px",
};

const logoBox = {
  width: "70px",
  height: "70px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "visible",
  flexShrink: 0,
};

const logoImg = {
  width: "320px",
  height: "320px",
  objectFit: "contain",
  background: "transparent",
  transform: "scale(2.8)",
};

const brandTitle = {
  margin: 0,
  fontSize: "23px",
  fontWeight: "900",
  color: "#ffffff",
};

const brandSub = {
  margin: "5px 0 0",
  fontSize: "13px",
  color: "#a3a3a3",
};

const linksBox = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
  flexWrap: "wrap",
};

const linkStyle = {
  textDecoration: "none",
  color: "#d4d4d4",
  fontWeight: "800",
  fontSize: "14px",
  padding: "11px 16px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  whiteSpace: "nowrap",
};

const activeLink = {
  background: "#ffffff",
  color: "#000000",
  border: "1px solid #ffffff",
};

const rightStyle = {
  minWidth: "150px",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "12px",
};

const profileCircle = {
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  background: "#111111",
  border: "2px solid rgba(255,255,255,0.75)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  overflow: "hidden",
};

const profileImg = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const initialText = {
  color: "#ffffff",
  fontWeight: "900",
  fontSize: "20px",
};

const logoutBtn = {
  padding: "11px 17px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.18)",
  background: "#ffffff",
  color: "#000000",
  cursor: "pointer",
  fontWeight: "900",
};

const hamburgerBtn = {
  width: "46px",
  height: "46px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.16)",
  background: "#111111",
  color: "#ffffff",
  fontSize: "25px",
  cursor: "pointer",
};

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.72)",
  zIndex: 999,
  backdropFilter: "blur(5px)",
};

const mobileMenu = {
  position: "fixed",
  top: 0,
  right: 0,
  width: "86%",
  maxWidth: "390px",
  height: "100vh",
  background: "#050505",
  borderLeft: "1px solid rgba(255,255,255,0.12)",
  boxShadow: "-12px 0 35px rgba(0,0,0,0.55)",
  padding: "20px",
};

const mobileTop = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingBottom: "18px",
  borderBottom: "1px solid rgba(255,255,255,0.12)",
};

const mobileBrandBox = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const mobileLogoImg = {
  width: "52px",
  height: "52px",
  objectFit: "contain",
};

const mobileTitle = {
  margin: 0,
  fontSize: "19px",
  color: "#ffffff",
  fontWeight: "900",
};

const closeBtn = {
  width: "42px",
  height: "42px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "#111111",
  color: "#ffffff",
  fontSize: "28px",
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
  border: "1px solid rgba(255,255,255,0.12)",
  background: "#111111",
  color: "#ffffff",
  cursor: "pointer",
  fontWeight: "900",
  fontSize: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const mobileActive = {
  background: "#ffffff",
  color: "#000000",
};

const mobileLogout = {
  ...mobileLinkBtn,
  marginTop: "14px",
  background: "#ffffff",
  color: "#000000",
};

export default Navbar;