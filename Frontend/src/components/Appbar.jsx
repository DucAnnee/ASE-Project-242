import React from "react";
import {
  Toolbar,
  AppBar,
  IconButton,
  Typography,
  Box,
  Button,
  Menu,
  Tooltip,
  Avatar,
  MenuItem,
  Divider,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import hcmut_logo from "../assets/HCMUT.png";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import HistoryIcon from "@mui/icons-material/History";
import styles from "../styles/Appbar.module.css";

// Chỉ hiển thị khi đã đăng nhập
const authenticatedPages = [
  { name: "Home", path: "/home", icon: <HomeIcon /> },
  { name: "Schedule", path: "/schedule", icon: <CalendarMonthIcon /> },
  { name: "History", path: "/history", icon: <HistoryIcon /> },
  { name: "Information", path: "/information", icon: <PersonIcon /> },
];

export default function Appbar() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogOut = () => {
    logout();
    navigate("/");
    handleCloseUserMenu();
  };

  // Dữ liệu người dùng demo khi chưa có backend
  const dummyUser = {
    name: "Nguyen Vu",
    avatar: "", // URL ảnh avatar nếu có
  };

  // Xác định đã đăng nhập hay chưa dựa vào URL thay vì currentUser
  const isAuthenticated = location.pathname !== "/";

  return (
    <AppBar position="sticky" className={styles.appBar}>
      <Toolbar className={styles.toolbar}>
        {/* Logo và Navigation */}
        <Box className={styles.navigationContainer}>
          <Box
            component="img"
            src={hcmut_logo}
            alt="HCMUT LOGO"
            className={styles.logo}
            onClick={() => navigate("/")}
          />

          {/* Menu items */}
          {isAuthenticated &&
            authenticatedPages.map((page, index) => (
              <Button
                key={index}
                variant="text"
                startIcon={page.icon}
                className={`${styles.navButton} ${
                  location.pathname === page.path
                    ? styles.navButtonActive
                    : styles.navButtonInactive
                }`}
                onClick={() => navigate(page.path)}
              >
                {page.name}
              </Button>
            ))}
        </Box>

        {/* User Menu or Login/Signup Buttons */}
        {isAuthenticated ? (
          <Box>
            <Tooltip title="Account">
              <IconButton onClick={handleOpenUserMenu} className={styles.userMenuButton}>
                <Avatar
                  alt={dummyUser.name}
                  src={dummyUser.avatar}
                  className={styles.avatar}
                  sx={{
                    bgcolor: dummyUser.avatar ? "transparent" : "primary.main",
                  }}
                >
                  {!dummyUser.avatar && dummyUser.name.charAt(0)}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              className={styles.menu}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              PaperProps={{
                elevation: 3,
                className: styles.menuPaper,
              }}
            >
              <MenuItem className={`${styles.menuItem} ${styles.menuItemNoHover}`} disableRipple>
                <Avatar
                  alt={dummyUser.name}
                  src={dummyUser.avatar}
                  sx={{
                    bgcolor: dummyUser.avatar ? "transparent" : "primary.main",
                    width: 40,
                    height: 40,
                  }}
                >
                  {!dummyUser.avatar && dummyUser.name.charAt(0)}
                </Avatar>
                <Box className={styles.userInfo}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {dummyUser.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Lecturer
                  </Typography>
                </Box>
              </MenuItem>

              <Divider sx={{ my: 1 }} />

              <MenuItem onClick={handleLogOut} className={styles.menuItemLogout}>
                <LogoutIcon color="error" className={styles.menuItemIcon} />
                <Typography color="error.main">Log out</Typography>
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              className={styles.signupButton}
              onClick={() => navigate("/signup")}
              sx={{
                borderColor: "#1976d2",
                color: "#1976d2",
                "&:hover": {
                  borderColor: "#1565c0",
                  backgroundColor: "rgba(25, 118, 210, 0.04)",
                },
              }}
            >
              Sign up
            </Button>
            <Button
              variant="contained"
              className={styles.loginButton}
              onClick={() => navigate("/login")}
            >
              Log in
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
