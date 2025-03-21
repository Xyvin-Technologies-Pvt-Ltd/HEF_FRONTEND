import React, { useEffect, useState } from "react";
import StyledTable from "../../ui/StyledTable";
import { Box, Stack, Typography } from "@mui/material";
import { StyledButton } from "../../ui/StyledButton";
import StyledSearchbar from "../../ui/StyledSearchbar";
import { useListStore } from "../../store/listStore";
import { groupColumns } from "../../assets/json/TableData";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGroupStore } from "../../store/groupStore";

const GroupPage = () => {
  const { fetchGroup } = useListStore();
  const [pageNo, setPageNo] = useState(1);
  const [search, setSearch] = useState("");
  const [row, setRow] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isChange, setIsChange] = useState(false);
  const navigate = useNavigate();
  const { deleteGroups } = useGroupStore();
  useEffect(() => {
    let filter = {};
    filter.pageNo = pageNo;
    filter.limit = row;
    if (search) {
      filter.search = search;
      setPageNo(1);
    }
    fetchGroup(filter);
  }, [pageNo, search, row, isChange]);
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
        toast.error(error.message);
      }
    }
  };
  const handleRowDelete = async (id) => {
    try {
      await deleteGroups(id);
      toast.success("Deleted successfully");
      setIsChange(!isChange);
    } catch (error) {
      toast.error(error.message);
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
            <StyledSearchbar
              placeholder={"Search"}
              onchange={(e) => setSearch(e.target.value)}
            />
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
            onSelectionChange={handleSelectionChange}
            pageNo={pageNo}
            setPageNo={setPageNo}
            onDelete={handleDelete}
            onDeleteRow={handleRowDelete}
            rowPerSize={row}
            setRowPerSize={setRow}
            onModify={(id) => {
              navigate("/groups/group", {
                state: { groupId: id, isUpdate: true },
              });
            }}
          />
        </Box>
      </Box>
    </>
  );
};

export default GroupPage;
