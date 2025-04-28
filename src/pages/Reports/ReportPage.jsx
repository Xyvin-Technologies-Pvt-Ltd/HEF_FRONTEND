import React, { useEffect, useState } from "react";
import StyledTable from "../../ui/StyledTable";
import { Box, Stack, Typography } from "@mui/material";
import { StyledButton } from "../../ui/StyledButton";
import StyledSearchbar from "../../ui/StyledSearchbar";
import { paymentColumns, reportColumns } from "../../assets/json/TableData";
import { useListStore } from "../../store/listStore";
import { useReportStore } from "../../store/reportStore";
import ReportView from "../../components/Reports/ReportView";

const ReportPage = () => {
  const { fetchReport } = useListStore();
  const [view, setView] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [search, setSearch] = useState("");
  const [row, setRow] = useState(10);
  const { report, fetchReportById } = useReportStore();
  useEffect(() => {
    let filter = {};
    filter.pageNo = pageNo;
    filter.limit = row;
    if (search) {
      filter.search = search;
    }
    fetchReport(filter);
  }, [pageNo, search, row]);
  const handleView = async (id) => {
    await fetchReportById(id);
    setView(true);
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
            Reports
          </Typography>
        </Stack>
        <Stack direction={"row"} spacing={2}>
          {/* <StyledButton variant={"secondary"} name={"Download"} /> */}
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
              onchange={(e) => {
                setSearch(e.target.value);
                setPageNo(1);
              }}
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
            columns={reportColumns}
            menu
            onView={handleView}
            pageNo={pageNo}
            setPageNo={setPageNo}
            rowPerSize={row}
            setRowPerSize={setRow}
          />
        </Box>
        <ReportView open={view} onClose={() => setView(false)} data={report} />
      </Box>
    </>
  );
};

export default ReportPage;
