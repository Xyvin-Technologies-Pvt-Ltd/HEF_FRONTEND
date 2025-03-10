import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import StyledTable from "../../ui/StyledTable";
import { useListStore } from "../../store/listStore";
import { notificationColumns } from "../../assets/json/TableData";
import NotificationView from "../../components/Notification/NotificationView";
import { useNotificationStore } from "../../store/notificationStore";

const NotificationLog = () => {
  const [pageNo, setPageNo] = useState(1);
  const [row, setRow] = useState(10);
  const { fetchNotification } = useListStore();
  const [open, setOpen] = useState(false);
  const { fetchNotificationById, notification } = useNotificationStore();
  useEffect(() => {
    let filter = {};
    filter.pageNo = pageNo;
    filter.limit = row;
    fetchNotification(filter);
  }, [pageNo, row]);
  const handleView = async (id) => {
    await fetchNotificationById(id);
    setOpen(true);
  };
  return (
    <Box padding={"15px"}>
      <Box
        borderRadius={"16px"}
        bgcolor={"white"}
        p={1}
        border={"1px solid rgba(0, 0, 0, 0.12)"}
      >
        <StyledTable
          columns={notificationColumns}
          pageNo={pageNo}
          setPageNo={setPageNo}
          menu
          onView={handleView}
          rowPerSize={row}
          setRowPerSize={setRow}
        />
        <NotificationView
          open={open}
          onClose={() => setOpen(false)}
          data={notification}
        />
      </Box>
    </Box>
  );
};

export default NotificationLog;
