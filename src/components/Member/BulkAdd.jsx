import { useState } from "react";
import { Box, Divider, Stack, Typography } from "@mui/material";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { StyledButton } from "../../ui/StyledButton";
import { addMembersBulk } from "../../api/memberapi";
import StyledUpload from "../../ui/StyledUpload";
import * as base64js from "base64-js";
const BulkAdd = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleFileUpload = (file) => {
    setFiles([file]);
  };

  const handleCancel = () => {
    setFiles([]);
  };

  const parseFile = (file, callback) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = event.target.result;

      const processData = (data) =>
        data.map((row) => {
          const result = {
            name: row.name?.trim() || "",
            phone: formatPhoneNumber(String(row.phone || "").trim()),
            chapter: row.chapter?.trim() || "",
            businessTags: formatBusinessTags(row.businessTags),
          };
          const formattedDate = formatDate(row.dateOfJoining?.trim());
          if (formattedDate) {
            result.dateOfJoining = formattedDate;
          }
          if (row.email?.trim()) {
            result.email = row.email.trim();
          }
          return result;
        });

      const formatPhoneNumber = (phone) => {
        phone = phone.replace(/[^\d]/g, "");
        if (phone.startsWith("91") && !phone.startsWith("+91")) {
          return `+${phone}`;
        } else if (!phone.startsWith("+91")) {
          return `+91${phone}`;
        }
        return phone;
      };

      const formatBusinessTags = (tags) => {
        if (typeof tags === "string") {
          return tags.split(",").map((tag) => tag.trim());
        }
        return [];
      };

      const formatDate = (date) => {
        if (date) {
          const dateParts = date.split("-");
          if (dateParts.length === 3) {
            const [day, month, year] = dateParts;
            return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
          }
        }
        return "";
      };

      if (file.type === "text/csv") {
        const parsedData = Papa.parse(data, { header: true });
        const filteredData = parsedData.data.filter((row) =>
          Object.values(row).some((value) => value !== null && value !== "")
        );
        callback(processData(filteredData));
      } else if (
        file.type === "application/vnd.ms-excel" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        const workbook = XLSX.read(data, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        const filteredData = jsonData.filter((row) =>
          Object.values(row).some((value) => value !== null && value !== "")
        );
        callback(processData(filteredData));
      }
    };

    if (file.type === "text/csv") {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  const handleSave = async () => {
    if (files.length > 0) {
      const file = files[0]?.file;
      if (file) {
        parseFile(file, async (parsedData) => {
          if (parsedData && parsedData.length > 0) {
            try {
              setLoading(true);
              await addMembersBulk(parsedData);
              navigate("/members");
            } catch (error) {
              toast.error(error.message);
              if (error?.data?.excelFile) {
                handleDownloadReport(error.data.excelFile);
              }
            } finally {
              setLoading(false);
            }
          }
        });
      } else {
        toast("No file found.");
      }
    } else {
      toast("No file uploaded yet!");
    }
  };
  const handleDownloadReport = (base64Data) => {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length)
      .fill(null)
      .map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Duplicate_PhoneNumbers.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Box
      bgcolor={"white"}
      borderRadius={"12px"}
      border={"1px solid rgba(0, 0, 0, 0.12)"}
    >
      <Box padding={9}>
        <StyledUpload files={files} onFileUpload={handleFileUpload} />
        <Stack spacing={2} mt={4}>
          <Typography variant="h6">Instructions for bulk import:</Typography>
          <ul style={{ fontSize: "12px", lineHeight: "1.8" }}>
            <li>First, download the file template.</li>
            <li>Remove the existing data without removing the headers.</li>
            <li>Don't change the headers.</li>
            <li>Add user data in the respective columns.</li>

            <li>A maximum of 50 entries is allowed at a time.</li>
          </ul>
        </Stack>
        <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
        <Stack direction={"row"} spacing={2} justifyContent={"end"}>
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

export default BulkAdd;
