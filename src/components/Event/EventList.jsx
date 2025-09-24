import { Box, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import StyledSearchbar from "../../ui/StyledSearchbar";
import { StyledButton } from "../../ui/StyledButton";
import StyledTable from "../../ui/StyledTable";
import { eventList, userData } from "../../assets/json/TableData";
import { useNavigate } from "react-router-dom";
import { useEventStore } from "../../store/eventStore";
import { toast } from "react-toastify";
import { useListStore } from "../../store/listStore";
import { useAdminStore } from "../../store/adminStore";
import DownloadPopup from "../../components/Member/DownloadPopup";
import { generateExcel } from "../../utils/generateExcel";
import { generatePDF } from "../../utils/generatePDF";
import { getEventsDownload  } from "../../api/eventapi"; 

const EventList = () => {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [isChange, setIsChange] = useState(false);
  const [search, setSearch] = useState("");
  const [row, setRow] = useState(10);
  const { deleteEvent } = useEventStore();
  const { fetchEvent } = useListStore();
  const [pageNo, setPageNo] = useState(1);
  const { singleAdmin } = useAdminStore();
  const [downloadPopupOpen, setDownloadPopupOpen] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  useEffect(() => {
    let filter = {};
    if (search) {
      filter.search = search;
    }
    filter.pageNo = pageNo;
    filter.limit = row;
    fetchEvent(filter);
  }, [isChange, pageNo, search, row]);
  const handleSelectionChange = (newSelectedIds) => {
    setSelectedRows(newSelectedIds);
  };
  const handleDelete = async () => {
    if (selectedRows.length > 0) {
      try {
        await Promise.all(selectedRows?.map((id) => deleteEvent(id)));
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
      await deleteEvent(id);
      toast.success("Deleted successfully");
      setIsChange(!isChange);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDownloadExcel = async () => {
    setDownloadLoading(true);
    try {
      const data = await getEventsDownload({}); // Fetch all events
      const eventData = data.data;

      if (eventData?.headers && eventData?.body) {
        generateExcel(eventData.headers, eventData.body, "Events");
        toast.success("Excel file downloaded successfully!");
      } else {
        toast.error("Error downloading Excel - invalid data");
      }
    } catch (error) {
      console.error("Excel download error:", error);
      toast.error(`Error downloading Excel: ${error.message}`);
    } finally {
      setDownloadLoading(false);
      setDownloadPopupOpen(false);
    }
  };

  const handleDownloadPDF = async () => {
    setDownloadLoading(true);
    try {
      const data = await getEventsDownload({});
      console.log("event data",data)
      const eventData = data.data;
      console.log("event data",eventData);
      if (eventData?.headers && eventData?.body) {
        generatePDF(eventData.headers, eventData.body, "Events");
        toast.success("PDF file downloaded successfully!");
      } else {
        toast.error("Error downloading PDF - invalid data");
      }
    } catch (error) {
      console.error("PDF download error:", error);
      toast.error(`Error downloading PDF: ${error.message}`);
    } finally {
      setDownloadLoading(false);
      setDownloadPopupOpen(false);
    }
  };


  return (
    <Box>
      <Stack
        direction={"row"}
        justifyContent={"end"}
        paddingBottom={"15px"}
        alignItems={"center"}
      >
        <Stack direction={"row"} spacing={2} mt={2}>
          <StyledSearchbar
            placeholder={"Search"}
            onchange={(e) => {
              setSearch(e.target.value);
              setPageNo(1);
            }}
          />
          {/* Download Button */}
          <StyledButton
            variant="primary"
            name="Download"
            onClick={() => setDownloadPopupOpen(true)}
          />
        </Stack>
      </Stack>
      <Box
        borderRadius={"16px"}
        bgcolor={"white"}
        p={1}
        border={"1px solid rgba(0, 0, 0, 0.12)"}
      >
        {singleAdmin?.role?.permissions?.includes("eventManagement_modify") ? (
          <StyledTable
            columns={eventList}
            onSelectionChange={handleSelectionChange}
            onView={(id) => {
              navigate(`/events/${id}`);
            }}
            pageNo={pageNo}
            setPageNo={setPageNo}
            onDelete={handleDelete}
            onDeleteRow={handleRowDelete}
            rowPerSize={row}
            setRowPerSize={setRow}
            onModify={(id) => {
              navigate(`/events/edit/${id}`);
            }}
          />
        ) : (
          <StyledTable
            columns={eventList}
            onSelectionChange={handleSelectionChange}
            onView={(id) => {
              navigate(`/events/${id}`);
            }}
            menu
            pageNo={pageNo}
            setPageNo={setPageNo}
            onDeleteRow={handleRowDelete}
            rowPerSize={row}
            setRowPerSize={setRow}
            onModify={(id) => {
              navigate(`/events/edit/${id}`);
            }}
          />
        )}
      </Box>

      {/* Download Popup */}
      <DownloadPopup
        open={downloadPopupOpen}
        onClose={() => setDownloadPopupOpen(false)}
        onDownloadExcel={handleDownloadExcel}
        onDownloadPDF={handleDownloadPDF}
        loading={downloadLoading}
      />
    </Box>
  );
};

export default EventList;
