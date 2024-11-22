import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  Box,
  Divider,
  Stack,
  TablePagination,
  IconButton,
  Checkbox,
  Menu,
  MenuItem,
  Typography,
  Skeleton,
} from "@mui/material";
import { ReactComponent as ViewIcon } from "../assets/icons/ViewIcon.svg";
import { ReactComponent as LeftIcon } from "../assets/icons/LeftIcon.svg";
import { ReactComponent as RightIcon } from "../assets/icons/RightIcon.svg";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { StyledButton } from "./StyledButton";
import moment from "moment";

const StyledTableCell = styled(TableCell)`
  &.${tableCellClasses.head} {
    background-color: #fff;
    color: rgba(0, 0, 0, 0.87);
    font-size: 14px;
    padding: 16px;

    text-align: center;
    font-weight: 600;
  }
  &.${tableCellClasses.body} {
    font-size: 14px;
    background-color: #fff;
    padding: 16px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.87);
    text-align: center;
  }
`;

const StyledTableRow = styled(TableRow)`
  &:last-child td,
  &:last-child th {
    border: 0;
  }
  cursor: ${({ showEdit }) => (showEdit ? "pointer" : "default")};
  &:hover {
    background-color: ${({ showEdit }) => (showEdit ? "#f0f0f0" : "inherit")};
  }
`;

const EventTable = ({
  columns,
  onSelectionChange,
  onView,
  onDelete,
  onModify,
  onAction,
  menu,
  data,
  news,
  onDeleteRow,
  member,
  payment,
  college,
}) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [rowId, setRowId] = useState(null);

  const handleSelectAllClick = (event) => {
    const isChecked = event.target.checked;
    const newSelectedIds = isChecked ? data.map((row) => row._id) : [];
    setSelectedIds(newSelectedIds);
    onSelectionChange(newSelectedIds);
  };
  const handleRowCheckboxChange = (event, id) => {
    const isChecked = event.target.checked;
    const newSelectedIds = isChecked
      ? [...selectedIds, id]
      : selectedIds.filter((selectedId) => selectedId !== id);
    setSelectedIds(newSelectedIds);
    onSelectionChange(newSelectedIds);
  };
  const handleRowDelete = (id) => {
    onDeleteRow(id);
    handleMenuClose();
  };
  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setRowId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setRowId(null);
  };

  const handleView = (rowId) => {
    onView(rowId);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete();
    setSelectedIds([]);
    handleMenuClose();
  };
  const handleAction = () => {
    onAction(rowId);
    handleMenuClose();
  };

  const handleModify = () => {
    onModify(rowId);
    handleMenuClose();
  };

  const handleRowClick = (id) => {
    onView(id);
  };
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  const isSelected = (id) => selectedIds.includes(id);

  const getStatusVariant = (status) => {
    if (typeof status === "boolean") {
      return status ? "green" : "red";
    }
    switch (status) {
      case "pending":
        return "#FF9F00";
      case "rejected":
        return "#C62828";
      case "active":
        return "#4CAF50";
      case "deleted":
        return "#9E9E9E";
      case "cancelled":
        return "#FF5722";
      case "published":
        return "#3F51B5";
      case "unpublished":
        return "#9C27B0";
      case "created":
        return "#FFC107";

      default:
        return "#607D8B";
    }
  };
  const formatIndianDate = (date) => {
    return moment(date).format("DD-MM-YYYY");
  };
  const formatTime = (time) => {
    return moment(time).format("h:mm A");
  };
  return (
    <Box bgcolor={"white"} borderRadius={"16px"}>
      <TableContainer sx={{ border: "none" }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell padding="checkbox">
                <Checkbox
                  checked={
                    data &&
                    data.length > 0 &&
                    selectedIds.length === data.length
                  }
                  onChange={handleSelectAllClick}
                />
              </StyledTableCell>
              {columns.map((column) => (
                <StyledTableCell
                  key={column.field}
                  padding={column.padding || "normal"}
                >
                  {column.title}
                </StyledTableCell>
              ))}
              <StyledTableCell padding="normal"></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Display skeletons while loading

              Array.from(new Array(5)).map((_, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell padding="checkbox">
                    <Skeleton variant="rectangular" width={24} height={24} />
                  </StyledTableCell>

                  {columns.map((column) => (
                    <StyledTableCell key={column.field}>
                      <Skeleton variant="text" width="100%" height={20} />
                    </StyledTableCell>
                  ))}

                  <StyledTableCell>
                    <Box display="flex" alignItems="center">
                      <Skeleton variant="circular" width={24} height={24} />

                      <Skeleton
                        variant="circular"
                        width={24}
                        height={24}
                        sx={{ marginLeft: 1 }}
                      />
                    </Box>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : !data || data.length === 0 ? (
              <StyledTableRow>
                <StyledTableCell colSpan={columns.length + 2}>
                  <Typography variant="h7" textAlign="center">
                    No data
                  </Typography>
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              data.map((row) => (
                <StyledTableRow
                  role="checkbox"
                  key={row._id}
                  selected={isSelected(row._id)}
                >
                  <StyledTableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected(row._id)}
                      onChange={(event) =>
                        handleRowCheckboxChange(event, row._id)
                      }
                    />
                  </StyledTableCell>
                  {columns.map((column) => (
                    <StyledTableCell
                      key={column.field}
                      padding={column.padding || "normal"}
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleRowClick(row._id)}
                    >
                      {[
                        "renewal",
                        "paymentdate",
                        "date",
                        "createdAt",
                        "startDate",
                        "endDate",
                      ].includes(column.field) ? (
                        formatIndianDate(row[column.field])
                      ) : [
                          "startTime",
                          "endtime",
                          "time",
                          "updatedAt",
                        ].includes(column.field) ? (
                        formatTime(row[column.field])
                      ) : [
                          "banner_image_url",
                          "image",
                          "event image",
                          "speaker_image",
                          "media",
                        ].includes(column.field) ? (
                        <>
                          <img
                            src={row[column.field]}
                            alt={column.title}
                            style={{ width: "50px", height: "50px" }}
                          />{" "}
                        </>
                      ) : column.field === "status" ||
                        column.field === "activate" ? (
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <span
                            style={{
                              backgroundColor: getStatusVariant(
                                row[column.field]
                              ),
                              padding: "3px 8px",
                              borderRadius: "100px",
                              color: "#fff",
                            }}
                          >
                            {row[column.field] === true ||
                            row[column.field] === "activated"
                              ? "active"
                              : row[column.field] === false ||
                                row[column.field] === "deactivated"
                              ? "inactive"
                              : row[column.field]}
                          </span>
                        </Box>
                      ) : (
                        row[column.field]
                      )}
                    </StyledTableCell>
                  ))}

                  <StyledTableCell padding="normal">
                    <Box display="flex" alignItems="center">
                      {onView && (
                        <IconButton
                          aria-controls="simple-view"
                          aria-haspopup="true"
                          onClick={() => handleView(row._id)}
                        >
                          <ViewIcon />
                        </IconButton>
                      )}{" "}
                      {!menu &&
                        row.status !== "rejected" &&
                        row.status !== "approved" && (
                          <IconButton
                            aria-controls="simple-menu"
                            aria-haspopup="true"
                            onClick={(event) => handleMenuOpen(event, row._id)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        )}
                      <Menu
                        id="row-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl) && rowId === row._id}
                        onClose={handleMenuClose}
                      >
                        {news
                          ? [
                              <>
                                <MenuItem onClick={handleModify}>Edit</MenuItem>
                                <MenuItem onClick={handleAction}>
                                  Publish/Unpublish
                                </MenuItem>
                                <MenuItem
                                  onClick={() => handleRowDelete(row._id)}
                                  style={{ color: "red" }}
                                >
                                  Remove
                                </MenuItem>
                              </>,
                            ]
                          : member
                          ? [
                              <>
                                <MenuItem onClick={handleView}>
                                  View Details
                                </MenuItem>
                                <MenuItem onClick={handleModify}>Edit</MenuItem>
                                <MenuItem
                                  onClick={() => handleRowDelete(row._id)}
                                  style={{ color: "red" }}
                                >
                                  Delete
                                </MenuItem>
                              </>,
                            ]
                          : payment
                          ? [
                              <>
                                <MenuItem onClick={handleModify}>
                                  Approve
                                </MenuItem>
                                <MenuItem onClick={handleAction}>
                                  Reject
                                </MenuItem>
                              </>,
                            ]
                          : college
                          ? [
                              <>
                                <MenuItem onClick={handleView}>
                                  View Details
                                </MenuItem>
                                <MenuItem onClick={handleAction}>
                                  Add Member
                                </MenuItem>
                                <MenuItem onClick={handleModify}>Edit</MenuItem>
                                <MenuItem
                                  onClick={() => handleRowDelete(row._id)}
                                  style={{ color: "red" }}
                                >
                                  Delete
                                </MenuItem>
                              </>,
                            ]
                          : [
                              <>
                                {" "}
                                <MenuItem onClick={handleModify}>Edit</MenuItem>
                                <MenuItem
                                  onClick={() => handleRowDelete(row._id)}
                                  style={{ color: "red" }}
                                >
                                  Remove
                                </MenuItem>
                              </>,
                            ]}
                      </Menu>
                    </Box>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Divider />
        <Stack
          // padding={2}
          component="div"
          direction={"row"}
          justifyContent={selectedIds.length > 0 ? "space-between" : "flex-end"}
          alignItems="center"
        >
          {selectedIds.length > 0 && (
            <Stack direction="row" alignItems="center">
              <Typography paddingRight={3}>
                {`${selectedIds.length} item${
                  selectedIds.length > 1 ? "s" : ""
                } selected`}
              </Typography>
              <StyledButton
                variant="primary"
                name="Delete"
                onClick={() => handleDelete(selectedIds)}
              />
            </Stack>
          )}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center">
              <TablePagination
                component="div"
                count={data ? data.length : 0}
                rowsPerPage={10}
                page={0}
                onPageChange={() => {}}
                ActionsComponent={({ onPageChange }) => (
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    marginLeft={2}
                  >
                    <LeftIcon />
                    <RightIcon />
                  </Stack>
                )}
              />
            </Box>
          </Stack>
        </Stack>
      </TableContainer>
    </Box>
  );
};

export default EventTable;
