import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import StyledTable from "../../ui/StyledTable";
import StyledSearchbar from "../../ui/StyledSearchbar";
import { StyledButton } from "../../ui/StyledButton";
import { categoryColumns } from "../../assets/json/TableData";
import AddCategory from "../../components/Category/AddCategory";
import ChangeCategoryStatus from "../../components/Category/ChangeCategoryStatus";
import { useListStore } from "../../store/listStore";
import { useCategoryStore } from "../../store/categoryStore";
import { useAdminStore } from "../../store/adminStore";
import { Add, Download } from "@mui/icons-material";
import { downloadCategory } from "../../api/categoryapi";
import { toast } from "react-toastify";

const CategoryPage = () => {
  const [pageNo, setPageNo] = useState(1);
  const [rowPerSize, setRowPerSize] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [statusDialog, setStatusDialog] = useState({
    open: false,
    id: null,
    deactivate: false,
  });
  const [isChange, setIsChange] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const { lists, totalCount, loading, fetchCategory } = useListStore();
  const { deleteCategory, trigger } = useCategoryStore();
  const { singleAdmin } = useAdminStore();

  const permissions = singleAdmin?.role?.permissions || [];
  const hasModifyPermission =
    permissions.includes("categoryManagement_modify") ||
    permissions.includes("memberManagement_modify");

  useEffect(() => {
    const filter = { pageNo, limit: rowPerSize };
    if (search) filter.search = search;
    fetchCategory(filter);
  }, [pageNo, rowPerSize, search, isChange, trigger, fetchCategory]);

  const handleSelectionChange = (ids) => {
    setSelectedRows(ids);
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const data = await downloadCategory();
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "category_list.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error("Failed to download categories");
    } finally {
      setDownloading(false);
    }
  };

  const handleModify = (id) => {
    setCategoryId(id);
    setOpenAdd(true);
  };

  const handleStatus = (id) => {
    const row = lists?.find((item) => item._id === id);
    setStatusDialog({
      open: true,
      id,
      deactivate: row?.status === true,
    });
  };

  const handleDelete = () => {
    if (selectedRows.length > 0) {
      setConfirmDeleteOpen(true);
    }
  };

  const handleRowDelete = (id) => {
    setSelectedRows([id]);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    setLoadingDelete(true);
    try {
      await Promise.all(selectedRows.map((id) => deleteCategory(id)));
      toast.success("Deleted successfully");
      setSelectedRows([]);
      setIsChange((prev) => !prev);
    } catch (error) {
      toast.error(error?.message || "Failed to delete");
    } finally {
      setLoadingDelete(false);
      setConfirmDeleteOpen(false);
    }
  };

  const resetForm = () => {
    setCategoryId(null);
    setOpenAdd(false);
  };

  return (
    <>
      <Stack
        direction={"row"}
        padding={"10px"}
        bgcolor={"#FFFFFF"}
        height={"70px"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Stack>
          <Typography variant="h4" color={"textSecondary"}>
            Category
          </Typography>
        </Stack>
        <Stack direction={"row"} spacing={2}>
          <StyledButton
            onClick={handleDownload}
            disabled={downloading}
            name={
              <>
                <Download fontSize="small" />{" "}
                {downloading ? "Downloading..." : "Download"}
              </>
            }
            variant="primary"
          />
          {hasModifyPermission && (
            <StyledButton
              name={
                <>
                  <Add fontSize="small" /> Add Category
                </>
              }
              variant="primary"
              onClick={() => setOpenAdd(true)}
            />
          )}
        </Stack>
      </Stack>

      <Box padding="15px" marginBottom={4}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          paddingBottom={"15px"}
          alignItems={"center"}
        >
          <StyledSearchbar
            placeholder={"Search"}
            onchange={(e) => {
              setSearch(e.target.value);
              setPageNo(1);
            }}
          />
        </Stack>
        <Box
          borderRadius={"16px"}
          bgcolor={"white"}
          p={1}
          border={"1px solid rgba(0, 0, 0, 0.12)"}
        >
          {hasModifyPermission ? (
            <StyledTable
              columns={categoryColumns}
              data={lists}
              loading={loading}
              onDelete={handleDelete}
              onDeleteRow={handleRowDelete}
              onSelectionChange={handleSelectionChange}
              onModify={handleModify}
              onAction={handleStatus}
              pageNo={pageNo}
              setPageNo={setPageNo}
              rowPerSize={rowPerSize}
              setRowPerSize={setRowPerSize}
              totalCount={totalCount}
              category
            />
          ) : (
            <StyledTable
              columns={categoryColumns}
              data={lists}
              loading={loading}
              onSelectionChange={handleSelectionChange}
              pageNo={pageNo}
              setPageNo={setPageNo}
              rowPerSize={rowPerSize}
              setRowPerSize={setRowPerSize}
              totalCount={totalCount}
              category
            />
          )}
        </Box>
      </Box>

      <AddCategory
        open={openAdd}
        categoryId={categoryId}
        onClose={resetForm}
        onChange={() => {
          setIsChange((prev) => !prev);
        }}
      />

      <ChangeCategoryStatus
        open={statusDialog.open}
        id={statusDialog.id}
        deactivate={statusDialog.deactivate}
        onClose={() =>
          setStatusDialog({ open: false, id: null, deactivate: false })
        }
      />

      <Dialog
        open={confirmDeleteOpen}
        PaperProps={{
          sx: { borderRadius: "12px", padding: 2 },
        }}
        onClose={() => setConfirmDeleteOpen(false)}
      >
        <DialogContent sx={{ height: "auto", width: "330px" }}>
          <Stack
            spacing={2}
            paddingTop={2}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Typography
              variant="h3"
              color={"textTertiary"}
              textAlign={"center"}
            >
              Are you sure you want to delete the category?
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <StyledButton
            name="Cancel"
            variant={"secondary"}
            disabled={loadingDelete}
            onClick={() => setConfirmDeleteOpen(false)}
          />
          <StyledButton
            name={loadingDelete ? "Deleting..." : "Confirm"}
            variant="primary"
            disabled={loadingDelete}
            onClick={confirmDelete}
          />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CategoryPage;