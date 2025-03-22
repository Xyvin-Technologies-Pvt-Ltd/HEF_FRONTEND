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
import { ReactComponent as AppBioIcon } from "../assets/icons/AppBioIcon.svg";
import { ReactComponent as WhatsappIcon } from "../assets/icons/WhatsappIcon.svg";
import Video from "../components/Member/Video";
import CertificateCard from "../ui/CertificateCard";
import AwardCard from "../ui/AwardCard";
import image from "../assets/images/image.png";
import companylogo from "../assets/images/companylogo.png";
import { StyledButton } from "../ui/StyledButton";
import { useParams } from "react-router-dom";
import {
  Email,
  Facebook,
  Group,
  Instagram,
  Language,
  LinkedIn,
  Person,
  Phone,
  Place,
  Twitter,
  Web,
} from "@mui/icons-material";
import { getSingleUser } from "../api/memberapi";
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
  const handleSaveContact = async () => {
    try {
      if (!userData || !userData.name || !userData.phone || !userData.email) {
        throw new Error(
          "Incomplete user data. Please provide name, phone, and email."
        );
      }

      const vCardContent = `BEGIN:VCARD\r\nVERSION:3.0\r\nN:${userData.name
        .split(" ")
        .reverse()
        .join(";")}\r\nFN:${userData.name}\r\nTEL;TYPE=CELL:${
        userData.phone
      }\r\nEMAIL:${userData.email}\r\nEND:VCARD`;

      const blob = new Blob([vCardContent], {
        type: "text/vcard;charset=utf-8",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${userData.name.replace(/ /g, "_")}.vcf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error creating vCard:", error);
    }
  };
  const renderSocialIcon = (platform) => {
    switch (platform) {
      case "Instagram":
        return <Instagram sx={{ color: "#f58220" }} />;
      case "Twitter":
        return <Twitter sx={{ color: "#f58220" }} />;
      case "Linkedin":
        return <LinkedIn sx={{ color: "#f58220" }} />;
      case "Facebook":
        return <Facebook sx={{ color: "#f58220" }} />;
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
                mb: 4,
              }}
            >
              <Box
                sx={{
                  borderBottom: "1px solid #eaeaea",
                  pb: 3,
                  mb: 4,
                }}
              >
                <Stack
                  direction={isMobile ? "column" : "row"}
                  spacing={isMobile ? 2 : 4}
                  alignItems="center"
                >
                  {/* Profile Image with Accent Corner */}
                  <Box
                    sx={{
                      position: "relative",
                      width: "110px",
                      height: "110px",
                    }}
                  >
                    {/* Orange Corner Accent */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: -5,
                        left: -5,
                        width: "40px",
                        height: "40px",
                        borderTop: "3px solid #f58220",
                        borderLeft: "3px solid #f58220",
                      }}
                    />

                    {/* Profile Image */}
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={userData?.image || image}
                        alt="profile"
                        width="100%"
                        height="100%"
                        style={{ objectFit: "cover" }}
                      />
                    </Box>

                    {/* Bottom Right Corner Accent */}
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: -5,
                        right: -5,
                        width: "40px",
                        height: "40px",
                        borderBottom: "3px solid #f58220",
                        borderRight: "3px solid #f58220",
                      }}
                    />
                  </Box>

                  {/* User Information */}
                  <Stack spacing={1.5} flex={1}>
                    <Typography variant="h3" color="#333" fontWeight={500}>
                      {userData?.name}
                    </Typography>

                    <Box
                      sx={{
                        height: "1px",
                        width: "40px",
                        backgroundColor: "#f58220",
                        mb: 1,
                      }}
                    />

                    <Stack direction="row" spacing={3} flexWrap="wrap">
                      {userData?.memberId && (
                        <Typography
                          variant="h6"
                          color="text.secondary"
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <Person
                            sx={{
                              fontSize: "0.9rem",
                              mr: 0.5,
                              color: "#f58220",
                            }}
                          />
                          ID: {userData?.memberId}
                        </Typography>
                      )}

                      {userData?.chapter?.name && (
                        <Typography
                          variant="h6"
                          color="text.secondary"
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <Group
                            sx={{
                              fontSize: "0.9rem",
                              mr: 0.5,
                              color: "#f58220",
                            }}
                          />
                          {userData?.chapter?.name}
                        </Typography>
                      )}
                    </Stack>
                    {userData?.designation && (
                      <Stack direction={"row"} spacing={2}>
                        <Typography variant="h7" color={"textPrimary"}>
                          Designation :
                        </Typography>
                        <Typography
                          variant="h7"
                          color={"textPrimary"}
                          fontWeight={600}
                        >
                          {userData?.designation}
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                </Stack>
              </Box>
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
                  <Stack>
                    {" "}
                    <Phone sx={{ color: "#f58220" }} />{" "}
                  </Stack>
                  <Typography variant="h7">{userData?.phone}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Stack>
                    <Email sx={{ color: "#f58220" }} />{" "}
                  </Stack>
                  <Typography variant="h7">{userData?.email}</Typography>
                </Stack>
                {userData?.address && (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Stack>
                      {" "}
                      <Place sx={{ color: "#f58220" }} />{" "}
                    </Stack>
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
              {userData?.company && userData.company.length > 0 && (
                <>
                  <Typography variant="h5" color="textTertiary" mt={4} mb={2}>
                    Company
                  </Typography>
                  <Stack spacing={2} mb={4}>
                    {userData.company.map((company, index) => (
                      <Box
                        key={company._id || index}
                        sx={{
                          backgroundColor: "rgba(0, 0, 0, 0.03)",
                          borderRadius: "8px",
                          padding: 2,
                          border: "1px solid rgba(0, 0, 0, 0.08)",
                        }}
                      >
                        <Typography variant="h6" fontWeight={600} mb={1}>
                          {company.name}
                        </Typography>

                        {company.designation && (
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            mb={2}
                          >
                            {company.designation}
                          </Typography>
                        )}

                        <Stack spacing={2}>
                          {company.phone && (
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <Stack>
                                <Phone sx={{ color: "#f58220" }} />
                              </Stack>
                              <Typography variant="body2">
                                {company.phone}
                              </Typography>
                            </Stack>
                          )}

                          {company.email && (
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <Stack>
                                <Email sx={{ color: "#f58220" }} />
                              </Stack>
                              <Typography variant="body2">
                                {company.email}
                              </Typography>
                            </Stack>
                          )}

                          {company.address && (
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <Stack>
                                <Place sx={{ color: "#f58220" }} />
                              </Stack>
                              <Typography variant="body2">
                                {company.address}
                              </Typography>
                            </Stack>
                          )}

                          {company.websites && (
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <Stack>
                                <Language sx={{ color: "#f58220" }} />
                              </Stack>
                              <Typography variant="body2">
                                {company.websites}
                              </Typography>
                            </Stack>
                          )}
                        </Stack>
                      </Box>
                    ))}
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
                  href={`https://wa.me/${userData?.phone}`}
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
                                href={
                                  media?.link?.startsWith("http")
                                    ? media.link
                                    : `https://${media?.link}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  textDecoration: "none",
                                  color: "#6D6D6D",
                                }}
                              >
                                {media?.name}
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
                          <Language sx={{ color: "#f58220" }} />{" "}
                          <Typography
                            variant="h5"
                            color="#6D6D6D"
                            fontWeight={400}
                            ml={1}
                          >
                            <a
                              href={
                                website?.link?.startsWith("http")
                                  ? website.link
                                  : `https://${website.link}`
                              }
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
