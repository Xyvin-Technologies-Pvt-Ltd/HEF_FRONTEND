import { Avatar, Box, Select, Stack, Typography } from "@mui/material";
import DashboardSelect from "../../ui/DashboardSelect";
import { useState } from "react";

const TopMemberList = ({userData}) => {
  const [value, setValue] = useState("Monthly");
  const handleSelectChange = (event) => {
    setValue(event.target.value);
  };


  return (
    <Box
      width={"100%"}
      height={400}
      padding={2}
      bgcolor={"#fff"}
      border={"1px solid rgba(0, 0, 0, 0.25)"}
      borderRadius={"10px"}
    >
      <Stack direction={"row"} justifyContent={"space-between"} mb={1}>
        <Typography color="#111928" variant="h6" mb={1}>
          Top Performer Members
        </Typography>
        <Stack>
          {/* <DashboardSelect
            options={options}
            value={value}
            onChange={handleSelectChange}
          /> */}
        </Stack>
      </Stack>

      {userData?.map((member, index) => (
        <Stack
          key={member?._id}
          spacing={2}
          direction={"row"}
          display={"flex"}
          alignItems={"center"}
          mb={2}
        >
          <Typography color="#333333" variant="body1" fontWeight={700}>
            {index + 1}.
          </Typography>
          <Avatar alt={member?.name} src={member?.avatar} />
          <Stack>
            <Typography color="#333333" variant="body1" fontWeight={700}>
              {member?.name}
            </Typography>
            <Typography color="#333333" variant="body2" fontWeight={300}>
              {member?.state}, {member?.zone}, {member?.district},{member?.chapter}
            </Typography>
          </Stack>
        </Stack>
      ))}
    </Box>
  );
};

export default TopMemberList;
