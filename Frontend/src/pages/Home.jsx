import { Box, Container, Typography } from "@mui/material";
import printer from "../assets/printer.png";
import { useAuth } from "../contexts/AuthContext";
import AdminDashboard from "./AdminDashboard";

export default function Home() {
  const { userInfo } = useAuth();
  return (
    <>
    { userInfo && userInfo.role == 'SPSO' ? <AdminDashboard /> :
    <Container sx={{display: 'flex', height: "80vh", alignItems: 'center', justifyContent: "space-between"}}>
        <Box sx={{color: 'primary.main'}}>
            <Typography variant="h1" sx={{fontWeight: "500"}}>
                Chào mừng!
            </Typography>
            <Typography variant="h3">
                Đến với trang chủ
            </Typography>
        </Box>
        <img src={printer} height={600} width={400}></img>
    </Container>
    }
    </>
  )
  
}
