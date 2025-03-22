import { Box, Grid, Skeleton, Typography } from "@mui/material";
import React, { useState } from "react";
import UserCard from "../../ui/UserCard";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { ReactComponent as WebsiteIcon } from "../../assets/icons/AppWebsiteIcon.svg";
import CertificateBox from "../../ui/CerficateBox";
import AwardBox from "../../ui/AwardBox";
import VideoCard from "../../ui/VideoCard";
import { Facebook, Instagram, Language, LinkedIn, Twitter } from "@mui/icons-material";

const MemberProfile = ({ data, loading }) => {
  const renderSocialIcon = (platform) => {
    switch (platform) {
      case "Instagram":
        return <Instagram sx={{ color: "#f58220" }}/>;
      case "Twitter":
        return <Twitter sx={{ color: "#f58220" }} />;
      case "Linkedin":
        return <LinkedIn sx={{ color: "#f58220" }}/>;
      case "Facebook":
        return <Facebook sx={{ color: "#f58220" }}/>;
      default:
        return null;
    }
  };

  return (
    <>
      {loading ? (
        <>
          <Grid container spacing={2}>
            <Grid item md={12}>
              <Typography variant="h5" color="textTertiary" mt={1}>
                video
              </Typography>
            </Grid>
            {[...Array(3)].map((_, index) => (
              <Grid item md={4} xs={12} key={index}>
                <Skeleton variant="rectangular" width="100%" height={200} />
              </Grid>
            ))}

            {/* Certificates Section */}
            <Grid item md={12}>
              <Typography variant="h5" color="textTertiary" mt={1}>
                Certificates
              </Typography>
            </Grid>
            {[...Array(2)].map((_, index) => (
              <Grid item md={6} xs={12} key={index}>
                <Skeleton variant="rectangular" width="100%" height={150} />
              </Grid>
            ))}

            {/* Awards Section */}
            <Grid item md={12}>
              <Typography variant="h5" color="textTertiary" mt={1}>
                Awards
              </Typography>
            </Grid>
            {[...Array(2)].map((_, index) => (
              <Grid item md={6} xs={12} key={index}>
                <Skeleton variant="rectangular" width="100%" height={150} />
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <Grid container spacing={4} padding={2}>
          <Grid item md={12}>
            <UserCard user={data} />
          </Grid>
          {/* {data?.company && data?.company?.length > 0 && (
             <Grid item md={5}>
             <CompanyCard companies={data?.company} />
           </Grid>
          )} */}
         
          {data?.social && data?.social?.length > 0 && (
            <>
              <Grid item md={12}>
                <Typography variant="h5" color="textTertiary" mt={1}>
                  Social Media
                </Typography>
              </Grid>

              {data?.social?.map((media, index) => (
                <Grid item md={4} xs={12} key={index}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-start"
                    bgcolor="white"
                    borderRadius={"12px"}
                    p={2}
                  >
                    {renderSocialIcon(media?.name)}
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
                      >
                        {media?.name?.charAt(0).toUpperCase() +
                          media?.name.slice(1)}
                      </a>
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </>
          )}{" "}
          {data?.websites && data?.websites?.length > 0 && (
            <>
              <Grid item md={12}>
                <Typography variant="h5" color="textTertiary" mt={1}>
                  Websites & links
                </Typography>
              </Grid>
              {data?.websites?.map((website, index) => (
                <Grid item md={4} xs={12} key={index}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-start"
                    bgcolor="white"
                    borderRadius={"12px"}
                    p={2}
                  >
                    <Language sx={{ color: "#f58220" }} />
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
                      >
                        {website?.name}
                      </a>
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </>
          )}{" "}
          {data?.videos && data?.videos?.length > 0 && (
            <Grid item md={12}>
              <Typography variant="h5" color="textTertiary" mt={1}>
                video
              </Typography>
            </Grid>
          )}
          {data?.videos?.map((videoItem, index) => (
            <Grid item md={4} xs={12} key={index}>
              <VideoCard url={videoItem.link} />
            </Grid>
          ))}
          {data?.certificates && data?.certificates?.length > 0 && (
            <>
              <Grid item md={12}>
                <Typography variant="h5" color="textTertiary" mt={1}>
                  Certificates
                </Typography>
              </Grid>
              {data?.certificates?.map((certificate, index) => (
                <Grid item md={4} xs={12} key={index}>
                  <CertificateBox certificate={certificate} />
                </Grid>
              ))}
            </>
          )}{" "}
          {data?.awards && data?.awards?.length > 0 && (
            <>
              <Grid item md={12}>
                <Typography variant="h5" color="textTertiary" mt={1}>
                  Awards
                </Typography>
              </Grid>
              {data?.awards?.map((award, index) => (
                <Grid item md={4} xs={12} key={index}>
                  <AwardBox award={award} />
                </Grid>
              ))}
            </>
          )}
          {data?.file && data?.file.length > 0 && (
            <>
              <Grid item md={12}>
                <Typography variant="h5" color="textTertiary" mt={1}>
                  Files
                </Typography>
              </Grid>
              {data?.file?.map((file, index) => (
                <Grid item md={12} xs={12} key={index}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-start"
                    bgcolor="white"
                    borderRadius={"12px"}
                    p={2}
                  >
                    <FileCopyIcon style={{ marginRight: "8px" }} />
                    <Typography variant="h5" color="#6D6D6D" fontWeight={400}>
                      <a href={file} target="_blank" rel="noopener noreferrer">
                        {file}
                      </a>
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </>
          )}
        </Grid>
      )}
    </>
  );
};

export default MemberProfile;
