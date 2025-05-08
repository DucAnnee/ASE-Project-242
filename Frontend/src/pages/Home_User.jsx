import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import styled from "@emotion/styled";

// Ảnh background - sửa cách import
import anhTruong1 from "../assets/ảnh trường.png";
import anhTruong2 from "../assets/home.png";
import anhTruong3 from "../assets/lịch.png";
import anhTruong4 from "../assets/Sân.png";
import anhTruong5 from "../assets/calen.png";

const FullScreenContainer = styled(Box)`
  position: fixed;
  top: 65px; /* Thêm khoảng cách từ trên xuống để tránh menu */
  left: 0;
  width: 100%;
  height: calc(100% - 65px); /* Giảm chiều cao để tránh đè lên menu */
  z-index: -1;
`;

const BackgroundImage = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  transition: opacity 1.5s ease-in-out;
`;

export default function Home_User() {
  const [activeIndex, setActiveIndex] = useState(0);
  const backgroundImages = [anhTruong1, anhTruong2, anhTruong3, anhTruong4, anhTruong5];

  // Debug console log để kiểm tra ảnh đã được import đúng chưa
  useEffect(() => {
    console.log("Ảnh đã import:", backgroundImages);
  }, []);

  // Slideshow effect - chuyển đổi ảnh mỗi 5 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % backgroundImages.length;
        console.log("Đang chuyển sang ảnh:", newIndex);
        return newIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <FullScreenContainer>
      {backgroundImages.map((image, index) => (
        <BackgroundImage
          key={index}
          sx={{
            backgroundImage: `url(${image})`,
            opacity: activeIndex === index ? 1 : 0,
          }}
        />
      ))}
    </FullScreenContainer>
  );
}
