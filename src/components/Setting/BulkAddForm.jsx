import { useState, useCallback } from "react";
import { Box, Divider, Stack, Typography } from "@mui/material";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import DropZone from "../../ui/DropZone";
import { StyledButton } from "../../ui/StyledButton";
import { addCollegeBulk } from "../../api/collegeapi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BulkAddForm = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleFileUpload = (file) => {
    setFiles([file]);
    console.log("Parsed Data:", file);
  };

  const handleCancel = () => {
    setFiles([]);
  };

  const parseFile = (file, callback) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = event.target.result;

      if (file.type === "text/csv") {
        // Parse CSV file using PapaParse
        const parsedData = Papa.parse(data, { header: true });
        const filteredData = parsedData.data.filter((row) =>
          Object.values(row).some((value) => value !== null && value !== "")
        );
        callback(filteredData);
      } else if (
        file.type === "application/vnd.ms-excel" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        // Parse XLS/XLSX file using XLSX
        const workbook = XLSX.read(data, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        const filteredData = jsonData.filter((row) =>
          Object.values(row).some((value) => value !== null && value !== "")
        );
        callback(filteredData);
      }
    };

    if (file.type === "text/csv") {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (files.length > 0) {
        const file = files[0]?.file;
        if (file) {
          // Parse the file and handle the result
          parseFile(file, async (parsedData) => {
            if (parsedData && parsedData.length > 0) {
              console.log("Parsed Data:", parsedData);
              await addCollegeBulk(parsedData);
              navigate("/colleges");
            } else {
              toast("Parsed data is empty or invalid.");
            }
          });
        } else {
          toast("No file found.");
        }
      } else {
        toast("No file uploaded yet!");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bgcolor={"white"}>
      <Box padding={9}>
        <DropZone files={files} onFileUpload={handleFileUpload} />
        <Stack spacing={2} mt={4}>
          <Typography variant="h6">Instructions for bulk import:</Typography>
          <ul style={{ fontSize: "12px" }}>
            <li>Don't remove headers.</li>
            <li>Maximum of 50 entries allowed at a time.</li>
          </ul>
        </Stack>
        <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
        <Stack
          direction={"row"}
          spacing={2}
          width={"50%"}
          justifyContent={"end"}
        >
          <StyledButton
            name="Cancel"
            variant="secondary"
            style={{ width: "auto" }}
            onClick={handleCancel}
          >
            Cancel
          </StyledButton>
          <StyledButton
            name={loading ? "Saving..." : "Save"}
            variant="primary"
            style={{ width: "auto" }}
            onClick={handleSave}
          >
            Save
          </StyledButton>
        </Stack>
      </Box>
    </Box>
  );
};

export default BulkAddForm;
