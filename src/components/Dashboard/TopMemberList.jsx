import { Avatar, Box, Stack, Typography } from "@mui/material";

const TopMemberList = () => {
  const data = [
  ]
  return (
    <Box
      width={"100%"}
      height={400}
      padding={2}
      bgcolor={"#fff"}
      border={"1px solid rgba(0, 0, 0, 0.25)"}
      borderRadius={"10px"}
    >
      <Typography color="#111928" variant="h6" mb={2}>
        Top Performer Members
      </Typography>
      <Stack
        spacing={1}
        direction={"row"}
        display={"flex"}
        alignItems={"center"}
      >
        <Typography color="#333333" variant="h8">
          1.
        </Typography>
        <Avatar
          alt="Remy Sharp"
          src="https://cdn-icons-png.flaticon.com/512/6858/6858504.png"
        />
        <Stack>
          <Typography color="#333333" variant="h8" fontWeight={700}>
            Ajith Sharma
          </Typography>{" "}
          <Typography color="#333333" variant="h9" fontWeight={300}>
            State 1, Zone 2, District 1
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default TopMemberList;
