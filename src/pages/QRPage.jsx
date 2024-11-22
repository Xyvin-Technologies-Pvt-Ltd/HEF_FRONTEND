import {
  Box,
  Grid,
  LinearProgress,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { ReactComponent as AppInstagramIcon } from "../assets/icons/AppInstagramIcon.svg";
import { ReactComponent as AppPhoneIcon } from "../assets/icons/AppPhoneIcon.svg";
import { ReactComponent as AppEmailIcon } from "../assets/icons/AppEmailIcon.svg";
import { ReactComponent as AppLocationIcon } from "../assets/icons/AppLocationIcon.svg";
import { ReactComponent as AppLinkedInIcon } from "../assets/icons/AppLinkedInIcon.svg";
import { ReactComponent as AppWebsiteIcon } from "../assets/icons/AppWebsiteIcon.svg";
import { ReactComponent as AppTwitterIcon } from "../assets/icons/AppTwitterIcon.svg";
import { ReactComponent as AppFacebookIcon } from "../assets/icons/AppFacebookIcon.svg";
import { ReactComponent as AppBioIcon } from "../assets/icons/AppBioIcon.svg";
import { ReactComponent as WhatsappIcon } from "../assets/icons/WhatsappIcon.svg";
import Video from "../components/Member/Video";
import CertificateCard from "../ui/CertificateCard";
import AwardCard from "../ui/AwardCard";
import image from "../assets/images/image.png";
import companylogo from "../assets/images/companylogo.png";
import { StyledButton } from "../ui/StyledButton";
import { getSingleUser } from "../api/memberapi";
import { useParams } from "react-router-dom";
const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const QRPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const formattedId = id?.endsWith("/") ? id.slice(0, -1) : id;
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSingleUser(formattedId);
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const handleSaveContact = () => {
    const vCardData = `
BEGIN:VCARD
VERSION:3.0
FN:${userData?.name?.first} ${userData?.name?.last}
ORG:${userData?.company?.name}
TEL:${userData?.phone}
EMAIL:${userData?.email}
ADR:${userData?.address}
END:VCARD
    `;

    const blob = new Blob([vCardData], { type: "text/vcard" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${userData?.name?.first}_${userData?.name?.last}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const renderSocialIcon = (platform) => {
    switch (platform) {
      case "instagram":
        return <AppInstagramIcon />;
      case "twitter":
        return <AppTwitterIcon />;
      case "linkedin":
        return <AppLinkedInIcon />;
      case "facebook":
        return <AppFacebookIcon />;
      default:
        return null;
    }
  };

  return (
    <>
      {loading ? (
        <LinearProgress />
      ) : (
        <Grid
          container
          justifyContent="center"
          minHeight={"100vh"}
          bgcolor={isMobile ? "#fff" : "#F2F2F2"}
        >
          <Grid item xs={12} sm={8} md={6} lg={5}>
            <Box
              sx={{
                p: 4,
                bgcolor: "#FFFFFF",
                borderRadius: isMobile ? 0 : 5,
                boxShadow: isMobile ? "none" : 2,
                mt: 4,
              }}
            >
              <Stack
                direction={isMobile ? "column" : "row"}
                justifyContent={isMobile ? "center" : "start"}
                alignItems={"center"}
                spacing={isMobile ? 0 : 5}
              >
                <Stack>
                  <img
                    src={userData?.image || image}
                    alt="image"
                    width={"130px"}
                    height={"130px"}
                    style={{
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </Stack>
                <Stack direction={"column"} alignItems={isMobile && "center"}>
                  <Typography variant="h3" color="textTertiary" mt={1} mb={1}>
                    {userData?.name?.first} {userData?.name?.last}
                  </Typography>
                  {userData?.company?.name && (
                    <Stack
                      mt={2}
                      direction={"row"}
                      alignItems={"center"}
                      spacing={1}
                    >
                      <Stack>
                        <img
                          src={userData?.company?.logo || companylogo}
                          alt="image"
                          width={"36px"}
                          height={"36px"}
                          style={{ borderRadius: "50%", objectFit: "cover" }}
                        />
                      </Stack>
                      <Stack>
                        <Typography variant="h6">
                          {userData?.company?.name}
                        </Typography>
                        <Typography variant="h8">
                          {userData?.company?.designation}
                        </Typography>
                      </Stack>
                    </Stack>
                  )}
                </Stack>
                {isMobile && (
                  <Box
                    padding={2}
                    mt={4}
                    border={"1px solid rgba(0, 0, 0, 0.12)"}
                    borderRadius={"12px"}
                  >
                    <Typography variant="h8" color="textTertiary" mt={1} mb={1}>
                      {userData?.college?.collegeName}, {userData?.batch} Alumni
                    </Typography>
                  </Box>
                )}
                <Typography
                  variant="h8"
                  color="textTertiary"
                  mt={1}
                  mb={1}
                  fontWeight={600}
                ></Typography>
              </Stack>
              <Typography
                variant="h5"
                color="textTertiary"
                mt={isMobile ? 1 : 4}
                mb={1}
              >
                Personal
              </Typography>
              <Stack spacing={2} mb={4} mt={4}>
                <Stack direction="row" alignItems="center" spacing={1}>
                <Stack> <AppPhoneIcon /> </Stack>
                  <Typography variant="h7">{userData?.phone}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                <Stack><AppEmailIcon /> </Stack>
                  <Typography variant="h7">{userData?.email}</Typography>
                </Stack>
                {userData?.address && (
                  <Stack direction="row" alignItems="center" spacing={1}>
                     <Stack> <AppLocationIcon /> </Stack>
                    <Typography variant="h7">{userData?.address}</Typography>
                  </Stack>
                )}
              </Stack>
              {userData?.bio && (
                <>
                  <AppBioIcon />
                  <Stack>
                    <Typography variant="h7" color="#626262" mt={1} mb={1}>
                      {userData?.bio}
                    </Typography>
                  </Stack>
                </>
              )}
              {userData?.company && (
                <>
                  <Typography variant="h5" color="textTertiary" mt={4} mb={2}>
                    Company
                  </Typography>
                  <Stack spacing={2} mb={4} mt={4}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                    <Stack> <AppPhoneIcon /> </Stack>
                      <Typography variant="h7">
                        {userData?.company?.phone}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                    <Stack><AppLocationIcon /> </Stack>
                      <Typography variant="h7">
                        {userData?.company?.address}
                      </Typography>
                    </Stack>
                    
                  </Stack>
                </>
              )}
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={2}
                sx={{
                  position: "fixed",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zIndex: 1000,
                  backgroundColor: "white",
                  padding: 2,
                  boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <a
                  href={`https://wa.me/${userData?.company?.phone}`}
                  target="_blank"
                  style={{ textDecoration: "none" }}
                  rel="noopener noreferrer"
                >
                  <StyledButton
                    variant={"primary"}
                    name={
                      <>
                        <WhatsappIcon style={{ marginRight: "8px" }} /> SAY HAI
                      </>
                    }
                  />
                </a>
                <StyledButton
                  variant={"secondary"}
                  name={"SAVE CONTACT"}
                  onClick={handleSaveContact}
                />
              </Box>
              {userData?.social && userData?.social?.length > 0 && (
                <>
                  {" "}
                  <Typography variant="h5" color="textTertiary" mt={1} mb={2}>
                    Social Media
                  </Typography>
                  <Stack>
                    <Grid container spacing={isMobile ? 0 : 2}>
                      {" "}
                      {userData?.social?.map((media, index) => (
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          key={index}
                          paddingBottom={isMobile && 3}
                        >
                          {" "}
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="flex-start"
                            bgcolor="#F2F2F2"
                            borderRadius={"12px"}
                            p={2}
                          >
                            {renderSocialIcon(media?.name)}{" "}
                            <Typography
                              variant="h5"
                              color="#6D6D6D"
                              fontWeight={400}
                              ml={1}
                            >
                              <a
                                href={media?.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  textDecoration: "none",
                                  color: "#6D6D6D",
                                }}
                              >
                                {media?.link}
                              </a>
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Stack>
                </>
              )}{" "}
              {userData?.websites && userData?.websites?.length > 0 && (
                <>
                  <Typography
                    variant="h5"
                    color="textTertiary"
                    mt={2}
                    mb={1}
                    pt={2}
                  >
                    Websites & links
                  </Typography>{" "}
                  <Grid container spacing={3}>
                    {" "}
                    {userData?.websites?.map((website, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        {" "}
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="flex-start"
                          bgcolor="#F2F2F2"
                          borderRadius={"12px"}
                          p={2}
                        >
                          <AppWebsiteIcon />{" "}
                          <Typography
                            variant="h5"
                            color="#6D6D6D"
                            fontWeight={400}
                            ml={1}
                          >
                            <a
                              href={website?.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                textDecoration: "none",
                                color: "#6D6D6D",
                              }}
                            >
                              {website?.name}
                            </a>
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}{" "}
              {userData?.videos && userData?.videos?.length > 0 && (
                <Typography
                  variant="h5"
                  color="textTertiary"
                  mt={2}
                  mb={2}
                  pt={2}
                >
                  Video title
                </Typography>
              )}
              {isMobile ? (
                userData?.videos?.length > 0 && (
                  <Carousel
                    responsive={responsive}
                    infinite={true}
                    swipeable={true}
                    draggable={true}
                    autoPlay={true}
                    autoPlaySpeed={2000}
                    keyBoardControl={true}
                    showDots={false}
                  >
                    {userData?.videos?.map(
                      (videoItem, index) =>
                        videoItem?.link && (
                          <div key={index}>
                            <Video url={videoItem.link} />
                          </div>
                        )
                    )}
                  </Carousel>
                )
              ) : (
                <Grid container spacing={2}>
                  {userData?.videos?.map(
                    (videoItem, index) =>
                      videoItem?.link && (
                        <Grid item xs={12} sm={6} key={index}>
                          <Video url={videoItem.link} />
                        </Grid>
                      )
                  )}
                </Grid>
              )}
              {userData?.certificates && userData?.certificates?.length > 0 && (
                <>
                  <Typography
                    variant="h5"
                    color="textTertiary"
                    mt={5}
                    mb={2}
                    pt={2}
                  >
                    Certificates
                  </Typography>
                  <Grid container spacing={2}>
                    {userData?.certificates?.map((certificate, index) => (
                      <Grid item xs={12} lg={6} key={index}>
                        <CertificateCard certificate={certificate} />
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}{" "}
              {userData?.awards && userData?.awards?.length > 0 && (
                <>
                  <Typography
                    variant="h5"
                    color="textTertiary"
                    mt={1}
                    mb={1}
                    pt={2}
                  >
                    Awards
                  </Typography>
                  <Grid container spacing={2} mt={2} mb={10}>
                    {userData?.awards?.map((award, index) => (
                      <>
                        {" "}
                        <Grid item xs={6} lg={4} key={index}>
                          <AwardCard award={award} ismobile />
                        </Grid>
                      </>
                    ))}
                  </Grid>{" "}
                </>
              )}{" "}
            </Box>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default QRPage;
