import React, { useState } from "react";
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
} from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import hcmut_logo from "../assets/HCMUT.png";

const pages = [
  { name: "Schedule", path: "/schedule" },
  { name: "History", path: "/history" },
];

export default function Appbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { logout, userInfo } = useAuth();
  const [isCustomer] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogOut = () => {
    logout();
    navigate("/login");
  };
  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "rgba(255,255,255,0.2)",
        backdropFilter: "blur(10px)",
      }}>
      <Toolbar
        className="flex justify-between items-center px-6"
        sx={{
          display: "display",
          justifyContent: "center",
          alignItems: "center",
          paddingX: 2,
        }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
          {/* Logo and Title */}
          <Box
            component="img"
            src={hcmut_logo}
            alt="HCMUT LOGO"
            sx={{
              height: 50,
              cursor: "pointer",
              marginLeft: 3,
              marginRight: 5,
            }}
            onClick={() => navigate("/")}
          />

          {/* Navigation Buttons */}

          <Box sx={{ display: "flex", gap: 5 }}>
            {!userInfo || userInfo.role == "Student" ? (
              <>
                {pages.map((page, index) => (
                  <Button
                    key={index}
                    variant="text"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "18px",
                      color: "primary.dark",
                      backgroundColor: "transparent",
                      textTransform: "none",
                      borderRadius: "16px",
                      paddingX: "24px",
                      paddingY: "2px",
                      border:
                        location.pathname == page.path
                          ? "2px solid"
                          : "2px solid transparent",
                      "&:hover": {
                        border: "2px solid",
                        borderColor: "primary.dark",
                      },
                    }}
                    onClick={() => navigate(page.path)}>
                    {page.name}
                  </Button>
                ))}
              </>
            ) : (
              <></>
            )}
          </Box>
        </Box>

        {/* User Menu */}
        {userInfo ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              alignItems: "center",
            }}>
            <Typography sx={{ color: "primary.dark" }}>
              {userInfo.fname ?? userInfo.name}
            </Typography>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} className="p-0">
                <Avatar alt="User" />
              </IconButton>
            </Tooltip>

            <Menu
              sx={{ mt: "45px" }}
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
              onClose={handleCloseUserMenu}>
              {/* <MenuItem
                  key={"dashboard"}
                  onClick={() => {
                    handleCloseUserMenu();
                    { userInfo.role == 'SPSO' ? navigate("/admindashboard") : navigate("/dashboard") }
                  }}>
                  <Typography sx={{ textAlign: "center" }}>Dashboard</Typography>
                </MenuItem> */}
              {userInfo.role == "SPSO" ? (
                <>
                  <MenuItem
                    key={"printerlogs"}
                    onClick={() => {
                      handleCloseUserMenu();
                      navigate("/print");
                    }}>
                    <Typography sx={{ textAlign: "center" }}>
                      In tài liệu
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    key={"printerlogs"}
                    onClick={() => {
                      handleCloseUserMenu();
                      navigate("/buy");
                    }}>
                    <Typography sx={{ textAlign: "center" }}>
                      Mua trang
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    key={"printerlogs"}
                    onClick={() => {
                      handleCloseUserMenu();
                      navigate("/printerlogs");
                    }}>
                    <Typography sx={{ textAlign: "center" }}>
                      Report hệ thống
                    </Typography>
                  </MenuItem>
                </>
              ) : (
                <></>
              )}
              <MenuItem key={"logout"} onClick={handleLogOut}>
                <Typography sx={{ textAlign: "center" }}>Đăng xuất</Typography>
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Button
            variant="contained"
            sx={{
              color: "white",
              backgroundColor: "primary.main",
              borderRadius: "14px",
              marginRight: 3,
              "&:hover": { backgroundColor: "primary.dark", color: "white" },
            }}
            onClick={() => navigate("/login")}>
            Đăng nhập
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
