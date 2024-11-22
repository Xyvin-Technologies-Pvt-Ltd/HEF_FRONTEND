import React, { useEffect, useState } from "react";
import StyledTable from "../../ui/StyledTable";
import { Box,  Stack, Typography } from "@mui/material";
import { StyledButton } from "../../ui/StyledButton";
import StyledSearchbar from "../../ui/StyledSearchbar";
import { useNavigate } from "react-router-dom";
import { groupColumns } from "../../assets/json/TableData";
import { useGroupStore } from "../../store/groupstore";
import { toast } from "react-toastify";
import { useListStore } from "../../store/listStore";

const GroupPage = () => {
  const navigate = useNavigate();
  const {   deleteGroups } = useGroupStore();
  const { fetchGroup } = useListStore();
  const [pageNo, setPageNo] = useState(1);
  const[row,setRow] = useState(10)
  const [selectedRows, setSelectedRows] = useState([]);
  const [isChange, setIsChange] = useState(false);
  useEffect(() => {
    let filter = {};
    filter.pageNo = pageNo;
    filter.limit = row
    fetchGroup(filter);
  }, [isChange, pageNo,row]);
  const handleSelectionChange = (newSelectedIds) => {
    setSelectedRows(newSelectedIds);
  };
  const handleDelete = async () => {
    if (selectedRows.length > 0) {
      try {
        await Promise.all(selectedRows?.map((id) => deleteGroups(id)));
        toast.success("Deleted successfully");
        setIsChange(!isChange);
        setSelectedRows([]);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleRowDelete = async (id) => {
    try {
      await deleteGroups(id);
      toast.success("Deleted successfully");
      setIsChange(!isChange);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Stack
        direction={"row"}
        padding={"10px"}
        bgcolor={"#fff"}
        height={"70px"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Stack>
          <Typography variant="h4" color="textSecondary">
            Group
          </Typography>
        </Stack>
        <Stack direction={"row"} spacing={2}>
         
          <StyledButton
            variant={"primary"}
            name={"Add Group"}
            onClick={() => {
              navigate("/groups/group");
            }}
          />
        </Stack>
      </Stack>
      <Box padding={"15px"}>
        <Stack
          direction={"row"}
          justifyContent={"end"}
          paddingBottom={"15px"}
          alignItems={"center"}
        >
          <Stack direction={"row"} spacing={2}>
            <StyledSearchbar placeholder={"Search"} />
          </Stack>
        </Stack>
        <Box
          borderRadius={"16px"}
          bgcolor={"white"}
          p={1}
          border={"1px solid rgba(0, 0, 0, 0.12)"}
        >
          <StyledTable
            columns={groupColumns}
            onModify={(id) => {
              navigate("/groups/group", {
                state: { groupId: id, isUpdate: true },
              });
            }}
            onView={(rowId) => {
              navigate(`/group/${rowId}`);
            }}
            pageNo={pageNo}
            setPageNo={setPageNo}
            onSelectionChange={handleSelectionChange}
            onDelete={handleDelete}
            rowPerSize={row}
            setRowPerSize={setRow}
            onDeleteRow={handleRowDelete}
          />
        </Box>
      </Box>
    </>
  );
};

export default GroupPage;
