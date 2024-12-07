import React, { useEffect, useState } from "react";
import StyledTable from "../../ui/StyledTable";
import StyledSearchbar from "../../ui/StyledSearchbar";
import { Box, Stack } from "@mui/material";

import { ReactComponent as AddIcon } from "../../assets/icons/AddIcon.svg";
import { postColumns } from "../../assets/json/TableData";
import FeedApproval from "../Approve/FeedApproval";
import FeedReject from "../Approve/FeedReject";
import { useListStore } from "../../store/listStore";
import { StyledButton } from "../../ui/StyledButton";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useProductStore } from "../../store/productStore";

const MemberProducts = ({ id }) => {
  const navigate = useNavigate();
  const { fetchFeedByUser } = useListStore();
  const [pageNo, setPageNo] = useState(1);
  const[isChange, setIsChange] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [row, setRow] = useState(10);
  const{deleteProduct}=useProductStore()
  useEffect(() => {
    let filter = {};

    filter.pageNo = pageNo;
    filter.limit = row;
    fetchFeedByUser(id, filter);
  }, [pageNo, row, isChange]);
  const handleSelectionChange = (newSelectedIds) => {
    setSelectedRows(newSelectedIds);
  };
  const handleDelete = async () => {
    if (selectedRows.length > 0) {
      try {
        await Promise.all(selectedRows?.map((id) =>deleteProduct(id)));
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
      await deleteProduct(id);
      toast.success("Deleted successfully");
      setIsChange(!isChange);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {" "}
      <>
        <Stack
          direction={"row"}
          justifyContent={"end"}
          paddingBottom={"15px"}
          alignItems={"center"}
        >
          <Stack direction={"row"} spacing={2}>
            {" "}
            <StyledSearchbar placeholder={"Search by name"} />
            <StyledButton
              variant={"primary"}
              name={
                <>
                  <AddIcon />
                  Add Product
                </>
              }
              onClick={() => {
                navigate(`/products/${id}`);
              }}
            />
          </Stack>
        </Stack>{" "}
        <Box
          borderRadius={"16px"}
          bgcolor={"white"}
          p={1}
          border={"1px solid rgba(0, 0, 0, 0.12)"}
        >
          <StyledTable
            columns={postColumns}
            onSelectionChange={handleSelectionChange}
          onDelete={handleDelete}
          onDeleteRow={handleRowDelete}
            onModify={(id) => {
              navigate(`/products/${id}`, {
                state: { productId: id, isUpdate: true },
              });
            }}
            pageNo={pageNo}
            setPageNo={setPageNo}
            rowPerSize={row}
            setRowPerSize={setRow}
          />{" "}
        </Box>
      </>
    </>
  );
};

export default MemberProducts;
