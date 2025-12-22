import  { useEffect, useState } from "react";
import StyledTable from "../../ui/StyledTable";
import {
    Box,
    Stack,
    Typography,
} from "@mui/material";
import { categoryMemberColumns } from "../../assets/json/TableData";
import { useNavigate, useParams } from "react-router-dom";
import { useListStore } from "../../store/listStore";
import StyledSearchbar from "../../ui/StyledSearchbar";


const CategoryMembersPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { lists, totalCount, loading, fetchCategoryMembers } = useListStore();
    const [search, setSearch] = useState("");
    const [pageNo, setPageNo] = useState(1);
    const [rowPerSize, setRowPerSize] = useState(10);
    useEffect(() => {
        if (id) {
            const filter = { pageNo, limit: rowPerSize };
            if (search) filter.search = search;
            fetchCategoryMembers(id, filter);
        }
    }, [id, pageNo, rowPerSize, search, fetchCategoryMembers]);

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
                <Typography variant="h4" color={"textSecondary"}>
                 Category Members
                </Typography>
            </Stack>

            <Box padding="15px" marginBottom={4}>
                <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    paddingBottom={"15px"}
                    alignItems={"center"}
                >
                    <StyledSearchbar
                        placeholder={"Search Members"}
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
                    <StyledTable
                        columns={categoryMemberColumns}
                        data={lists}
                        loading={loading}
                        onView={(memberId) => {
                            navigate(`/members/${memberId}`);
                        }}
                        pageNo={pageNo}
                        setPageNo={setPageNo}
                        rowPerSize={rowPerSize}
                        setRowPerSize={setRowPerSize}
                        totalCount={totalCount}
                        member
                    />
                </Box>
            </Box>
        </>
    );
};

export default CategoryMembersPage;
