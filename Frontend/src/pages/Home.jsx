import { Box, Container, Typography, Grid, Paper, Button, Card, CardContent } from "@mui/material";
import { styled } from "@mui/material/styles";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/Schedule.module.css";

// Styled components
const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  backgroundColor: "rgba(255, 255, 255, 0.85)",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[8],
  },
}));

const IconWrapper = styled("div")(({ theme }) => ({
  margin: theme.spacing(2, 0),
  padding: theme.spacing(2),
  borderRadius: "50%",
  backgroundColor: theme.palette.primary.light,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: theme.palette.primary.contrastText,
}));

export default function Home() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const features = [
    {
      icon: <MeetingRoomIcon fontSize="large" />,
      title: "Đặt Phòng Dễ Dàng",
      description: "Chọn phòng học phù hợp với nhu cầu giảng dạy của bạn một cách nhanh chóng.",
    },
    {
      icon: <AccessTimeIcon fontSize="large" />,
      title: "Tiết Kiệm Thời Gian",
      description:
        "Quy trình đặt phòng trực tuyến giúp giảng viên tiết kiệm thời gian và công sức.",
    },
    {
      icon: <EventNoteIcon fontSize="large" />,
      title: "Quản Lý Lịch Trình",
      description: "Theo dõi và quản lý lịch đặt phòng của bạn một cách dễ dàng.",
    },
    {
      icon: <CalendarMonthIcon fontSize="large" />,
      title: "Xem Lịch Sử Đặt Phòng",
      description: "Truy cập nhanh chóng vào lịch sử đặt phòng của bạn trong quá khứ.",
    },
  ];

  return (
    <>
      <div className={styles.pageBackground}></div>
      <Container maxWidth="lg" sx={{ py: 8, position: "relative", zIndex: 1 }}>
        {/* Hero Section */}
        {/* Hero Section */}
        <Box
          sx={{
            textAlign: "center",
            mb: 8,
            p: 5,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            borderRadius: 2,
            backdropFilter: "blur(10px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative calendar icons */}
          <Box
            sx={{
              position: "absolute",
              top: -15,
              left: -15,
              opacity: 0.2,
              transform: "rotate(-15deg)",
            }}
          >
            <CalendarMonthIcon sx={{ fontSize: 80, color: "#1565C0" }} />
          </Box>

          <Box
            sx={{
              position: "absolute",
              bottom: -15,
              right: -15,
              opacity: 0.2,
              transform: "rotate(15deg)",
            }}
          >
            <EventNoteIcon sx={{ fontSize: 80, color: "#1565C0" }} />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 3,
            }}
          >
            <CalendarMonthIcon sx={{ fontSize: 48, mr: 2, color: "#1976D2" }} />
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: "700",
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Hệ Thống Đặt Phòng Học
            </Typography>
            <EventNoteIcon sx={{ fontSize: 48, ml: 2, color: "#1976D2" }} />
          </Box>

          <Box
            sx={{
              mb: 3,
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                borderBottom: "2px dashed #1976D2",
                width: "60%",
                justifyContent: "space-around",
                py: 1,
              }}
            >
              <AccessTimeIcon color="primary" />
              <MeetingRoomIcon color="primary" />
              <EventNoteIcon color="primary" />
              <AccessTimeIcon color="primary" />
            </Box>
          </Box>

          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/login")}
            startIcon={<CalendarMonthIcon />}
            endIcon={<MeetingRoomIcon />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              boxShadow: "0 4px 6px rgba(32, 107, 196, 0.4)",
              "&:hover": {
                boxShadow: "0 6px 10px rgba(32, 107, 196, 0.6)",
              },
            }}
          >
            ĐẶT NGAY
          </Button>
        </Box>

        {/* Features Section */}
        <Typography
          variant="h4"
          component="h2"
          sx={{
            textAlign: "center",
            mb: 5,
            fontWeight: 600,
            color: "#1565C0",
          }}
        >
          Tính Năng Nổi Bật
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <FeatureCard elevation={3}>
                <IconWrapper>{feature.icon}</IconWrapper>
                <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>

        {/* Quick Guide Section */}
        <Box sx={{ mt: 8, backgroundColor: "rgba(255, 255, 255, 0.7)", p: 4, borderRadius: 2 }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{ mb: 3, textAlign: "center", color: "#1565C0" }}
          >
            Hướng Dẫn Nhanh
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card sx={{ display: "flex", flexDirection: "column", height: "100%", boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Các bước đặt phòng:
                  </Typography>
                  <Box component="ol" sx={{ pl: 2 }}>
                    <li>Chọn cơ sở, tòa nhà và phòng học phù hợp</li>
                    <li>Chọn ngày và khung giờ mong muốn</li>
                    <li>Xác nhận thông tin đặt phòng</li>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ display: "flex", flexDirection: "column", height: "100%", boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Lưu ý quan trọng:
                  </Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    <li>Đặt phòng trước ít nhất 24 giờ</li>
                    <li>Kiểm tra trang web thường xuyên để cập nhật thông tin</li>
                    <li>Liên hệ hỗ trợ kỹ thuật nếu gặp vấn đề</li>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}
