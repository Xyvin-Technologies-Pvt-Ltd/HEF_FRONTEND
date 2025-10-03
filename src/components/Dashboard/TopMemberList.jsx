import { Avatar, Box, Select, Stack, Typography, Chip } from "@mui/material";
import DashboardSelect from "../../ui/DashboardSelect";
import { useState } from "react";

const TopMemberList = ({ userData, options = ["Monthly", "Quarterly", "Yearly"] }) => {
  const [value, setValue] = useState("Monthly");
  const handleSelectChange = (event) => {
    setValue(event.target.value);
  };
  // Pick top performer per type
  const topPerType = ["Business", "One v One Meeting", "Referral"].map((type) => {
    const membersOfType = userData?.filter((m) => m.type === type);
    return membersOfType?.[0] ? { ...membersOfType[0], type } : null;
  }).filter(Boolean);

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
          key={member?._id + member.type} // ensure unique key even if same user in multiple types
          spacing={2}
          direction="row"
          alignItems="center"
          mb={2}
        >
          <Typography color="#333" variant="body1" fontWeight={700}>
            {index + 1}.
          </Typography>
          <Avatar alt={member?.name} src={member?.avatar} />
          <Stack>
            <Typography color="#333" variant="body1" fontWeight={700}>
              {member?.name}
            </Typography>
            <Typography color="#333" variant="body2" fontWeight={300}>
              {member?.state}, {member?.zone}, {member?.district}, {member?.chapter}
            </Typography>
          </Stack>
          <Chip
            label={member.type}
            size="small"
            sx={{ ml: "auto" }}
          />
        </Stack>
      ))}
    </Box>
  );
};

export default TopMemberList;
