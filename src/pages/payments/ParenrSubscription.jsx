import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import StyledTable from "../../ui/StyledTable";
import { usePaymentStore } from "../../store/paymentStore";
import ParentSub from "./ParentSub";
import { useListStore } from "../../store/listStore";

const ParentSubscription = () => {
  const [pageNo, setPageNo] = useState(1);
  const [row, setRow] = useState(10);
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState(false);
  const { fetchParentSubByiD, sub, refreshMember } = usePaymentStore();
  const { fetchParentSub } = useListStore();

  useEffect(() => {
    fetchParentSub();
  }, [pageNo, row, refreshMember]);
  const parentSubColums = [
    { title: "Year", field: "academicYear" },
    { title: "Expiry Date", field: "expiryDate" },
  ];
  const handleEdit = async (id) => {
    await fetchParentSubByiD(id);
    setOpen(true);
    setUpdate(true);
  };
  const handleClose = () => {
    setOpen(false);
    setUpdate(false);
  };

  return (
    <Box
      borderRadius={"16px"}
      bgcolor={"white"}
      p={1}
      border={"1px solid rgba(0, 0, 0, 0.12)"}
    >
      <StyledTable
        columns={parentSubColums}
        pageNo={pageNo}
        menu
        onModify={handleEdit}
        setPageNo={setPageNo}
        rowPerSize={row}
        setRowPerSize={setRow}
      />{" "}
      <ParentSub
        open={open}
        onClose={(e) => handleClose(e)}
        isUpdate={update}
        sub={sub}
      />
    </Box>
  );
};

export default ParentSubscription;
