

"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { styled, useTheme } from "@mui/material/styles";
import Table from "@mui/material/Table";
import Grid from "@mui/material/Grid";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  TextField,
  Typography,
  TablePagination,
  Box,
  InputAdornment,
  Pagination,
  PaginationItem,
  Dialog,
  DialogTitle,
  DialogContent,
  Badge,
  Chip,
  Card,
  Button,
  DialogActions,
  useMediaQuery,
  Divider,
  CircularProgress,

} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { useSession } from "next-auth/react";
import { decryptDataforResponse } from "../../../api/services/auth/Encrptdecrpt";
import ChildCard from "@/app/components/shared/ChildCard";


import { getDigitalLibraryAction } from "@/app/actions/digitalLibraryAction/getDigitalLibraryAction";
import Breadcrumb from "@/app/dashboard/staff/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
 


const BCrumb = [
  {
    to: "/dashboard",
    title: "Home",
    icon: "ic:baseline-home"

  },
  {
    title: "Digital Library",
  },
];


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontSize: 16,
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function DigitalLibrary({ onDataFetched }: any) {
  const [data, setData] = useState([]);
  const [rows, setRows] = useState<any[]>([]);
  const isDataFetched = useRef(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down("lg"));
  const mobileContainerRef = useRef<HTMLDivElement>(null);  // For mobile


  useEffect(() => {
    const fetchPlacementData = async () => {
      if (isDataFetched.current) return;

      try {
        setLoading(true);
        const response = await getDigitalLibraryAction();

        if (response.status === "success") {
          let splitValue = String(session?.user?.token).split("NEXT2121ANG");
          const decryptedData = decryptDataforResponse(
            response.ApiData,
            splitValue[1]
          );

          const parsed = JSON.parse(decryptedData);

          // console.log("Fetched Data digital library:", parsed);

          setRows(parsed);
          setParsedData(parsed);

          onDataFetched(parsed);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
        isDataFetched.current = true;
      }
    };

    fetchPlacementData();
  }, [onDataFetched, session]);

  // PDF View
  const [isOpen, setIsOpen] = useState(false);
  const openPopup = (event: any) => {
    event.preventDefault();

    setIsOpen(true);
  };
  const closePopup = () => setIsOpen(false);

  //Page event
  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const [selectedCategory, setSelectedCategory] = useState("");

  //search box filter
  const filteredRows = useMemo(() => {
    if (!rows.length) return [];

    return rows.filter((row) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch = Object.values(row).some((value) =>
        value ? String(value).toLowerCase().includes(searchText) : false
      );

      const matchesCategory =
        !selectedCategory ||
        (row.subject && row.subject.includes(selectedCategory));

      return matchesSearch && matchesCategory;
    });
  }, [rows, search, selectedCategory]);

  useEffect(() => {
    setPage(0);
    setRows(parsedData);
  }, [search, selectedCategory, parsedData]);

  //category count & chip color
  const categoryCounts: { [key: string]: number } = {};
  const categoryColors: { [key: string]: string } = {};

  categoryCounts["ALL"] = parsedData.length || rows.length;
  categoryColors["ALL"] = "primary";

  const color = ["primary", "secondary", "success", "error", "warning", "info"];
  let colorIndex = 1;

  if (parsedData && Array.isArray(parsedData)) {
    parsedData.forEach((row) => {
      if (row.subject) {
        const match = row.subject.match(/\(((.*?))\)$/);
        const category = match ? match[1].trim() : row.subject.trim();
        if (category) {
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
          if (!categoryColors[category]) {
            categoryColors[category] = color[colorIndex % color.length];
            colorIndex++;
          }
        }
      }
    });
  }


  const [updateKey, setUpdateKey] = useState(0);

  const handleChipClick = (category: string) => {
    if (category === "ALL") {
      setSelectedCategory("");
    } else {
      setSelectedCategory((prevCategory) =>
        prevCategory === category ? "" : category
      );
      setUpdateKey((prevKey) => prevKey + 1); // Forces re-render
    }
  };



  //sorting and pagination

  const sortedCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 23); // limit to show number of categories

  const [gotoPage, setGotoPage] = useState("");
  const handleGotoPage = () => {
    let newPage = parseInt(gotoPage, 10) - 1;
    if (
      newPage >= 0 &&
      newPage < Math.ceil(filteredRows.length / rowsPerPage)
    ) {
      setPage(newPage);
    } else {
      setPage(0);
    }
  };


  return (


    <>
    <Breadcrumb title="Digital Library" items={BCrumb} titleIcon="mdi:library" />

    {loading ? (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    ) : isCompact ? (
       <Box >
          <Box p={2}>
            <Grid container spacing={2}>
              {sortedCategories.map(([category, count]) => (
                <Grid key={category} sx={{lg:{gap:10}}}>
                  <Badge
                    max={100000}
                    badgeContent={count}
                    
                    color={
                      categoryColors[category] as
                      | "primary"
                      | "secondary"
                      | "success"
                      | "error"
                      | "warning"
                      | "info"
                      | "default"
                    }
                  >
                    <Chip
                      label={category}
                      onClick={() => handleChipClick(category)}
                      sx={{
                        px: 3,
                        minWidth: "100px",
                        height: "35px",
                        backgroundColor:
                          selectedCategory === category
                            ? `${categoryColors[category]}.main`
                            : `${categoryColors[category]}.light`,
                        color:
                          selectedCategory === category ? "white" : "",
                        fontWeight: "bold",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: categoryColors[category]
                            ? `${categoryColors[category]}.dark`
                            : "grey",
                          color: "white",
                        },
                      }}
                    />
                  </Badge>
                </Grid>
              ))}
            </Grid>
          </Box>

          <ChildCard>
            <Grid container justifyContent="flex-end" marginBottom={2}>
              <TextField
                label="Search"
                variant="outlined"
                sx={{ width: 300, mr: 0 }}
                value={search}
                onChange={(e) => setSearch(e.target.value.trim())}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>


            {filteredRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <React.Fragment key={index}>
                  <Box sx={{ display: "flex", alignItems: "center", margin: "10px 0", width: "98%", padding: "7px" }}>
                    <Card sx={{
                      cursor: "default",
                      borderLeft: `2px solid ${theme.palette.primary.main}`,
                      display: "flex",
                      flexDirection: "column",
                      boxShadow: "none",
                      borderRadius: 0,
                      padding: 1,
                      wordBreak: "break-word",
                    }}>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography>{row.srNo}</Typography>

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography><b>Author:</b> {row.author}</Typography>
                          <Typography><b>Year:</b> {row.year}</Typography>
                        </Box>

                        <Typography><b>Subject:</b>{row.subject}</Typography>

                        <Typography><b>Topic:</b>{row.topic}</Typography>

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography><b>Supervisor:</b>{row.supervisor}</Typography>
                          <Typography><b>Type:</b>{row.type}</Typography>
                        </Box>

                        <Box><b>File:</b>
                          <a
                            href={"Buddy Programme.pdf"}
                            onClick={openPopup}
                            className="text-blue-500 underline cursor-pointer"
                          >
                            View
                          </a>
                        </Box>

                      </Box>
                    </Card>
                  </Box>
                  {index !== sortedCategories.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            <Dialog
              open={isOpen}
              onClose={() => setIsOpen(false)}
              PaperProps={{ sx: { width: "100%", height: "90%" } }}
              maxWidth="lg"
            >
              <DialogTitle
                sx={{
                  textAlign: "center",
                }}
              >
                View
              </DialogTitle>
              <DialogContent dividers sx={{ padding: 0 }}>
                <iframe
                  src={"/Buddy Programme.pdf"}
                  // src={"selectedFile"}
                  width="100%"
                  height="900px"
                  style={{ border: "none" }}
                  title="PDF Viewer"
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setIsOpen(false)}
                  color="primary"
                  variant="contained"
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>


            <Grid container justifyContent="flex-start" mx={1} my={2}>
              <Typography>
                Showing :{" "}
                {filteredRows.length === 0 ? 0 : page * rowsPerPage + 1} -{" "}
                {Math.min((page + 1) * rowsPerPage, filteredRows.length)}{" "}
                Records {filteredRows.length}
              </Typography>
            </Grid>

            <Grid container justifyContent="flex-end" my={-2}>
              <TablePagination
                rowsPerPageOptions={[10, 15, 20]}
                component="div"
                count={filteredRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Grid>

            <Grid container justifyContent={{ lg: "flex-end" }} alignItems="end" my={6}>
              <Grid>
                <TextField
                  label="GoPage"
                  placeholder="Go to Page"
                  variant="outlined"
                  size="small"
                  value={gotoPage}
                  onChange={(e) => setGotoPage(e.target.value.trim())}
                  type="number"
                  inputProps={{
                    min: 1,
                    max: Math.ceil(filteredRows.length / rowsPerPage),
                  }}
                  sx={{ width: 100, borderRadius: 4 }}
                />
                <Button
                  variant="contained"
                  sx={{ ml: 1 }}
                  onClick={handleGotoPage}
                >
                  Go
                </Button>
              </Grid>
            </Grid>

            <Grid container justifyContent="center" my={3}>
              <Pagination
                count={Math.ceil(filteredRows.length / rowsPerPage)}
                page={page + 1}
                onChange={(event, value) => setPage(value - 1)}
                color="primary"
                showFirstButton
                showLastButton
                renderItem={(item) => <PaginationItem {...item} />}
              />
            </Grid>

          </ChildCard>
        </Box>
    ) : (
      <Card >
            <div>
              <Box p={2}>
                <Grid container >
                  {sortedCategories.map(([category, count]) => (
                    <Grid key={category}>
                      <Badge
                        max={100000}
                        badgeContent={count}
                        color={
                          categoryColors[category] as
                          | "primary"
                          | "secondary"
                          | "success"
                          | "error"
                          | "warning"
                          | "info"
                          | "default"
                        }
                      >
                        <Chip
                          label={category}
                          onClick={() => handleChipClick(category)}
                          sx={{
                            px: 3,
                            minWidth: "100px",
                            height: "35px",
                            backgroundColor:
                              selectedCategory === category
                                ? `${categoryColors[category]}.main`
                                : `${categoryColors[category]}.light`,
                            color:
                              selectedCategory === category ? "white" : "",
                            fontWeight: "bold",
                            cursor: "pointer",
                            "&:hover": {
                              backgroundColor: categoryColors[category]
                                ? `${categoryColors[category]}.dark`
                                : "grey",
                              color: "white",
                            },
                          }}
                        />
                      </Badge>
                    </Grid>
                  ))}
                </Grid>
              </Box>
              <ChildCard>
                <Grid container justifyContent="flex-end" marginBottom={2}>
                  <TextField
                    label="Search"
                    variant="outlined"
                    sx={{ width: 300, mr: 0 }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value.trim())}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: "max" }} aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>SrNo</StyledTableCell>
                        <StyledTableCell>Subject / Call No</StyledTableCell>
                        <StyledTableCell>Topic</StyledTableCell>
                        <StyledTableCell>Author</StyledTableCell>
                        <StyledTableCell>Supervisor</StyledTableCell>
                        <StyledTableCell>Year</StyledTableCell>
                        <StyledTableCell>Type</StyledTableCell>
                        <StyledTableCell>File</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredRows
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => (
                          <StyledTableRow key={index}>
                            <StyledTableCell>{row.srNo}</StyledTableCell>
                            <StyledTableCell>{row.subject}</StyledTableCell>
                            <StyledTableCell>{row.topic}</StyledTableCell>
                            <StyledTableCell>{row.author}</StyledTableCell>
                            <StyledTableCell>{row.supervisor}</StyledTableCell>
                            <StyledTableCell>{row.year}</StyledTableCell>
                            <StyledTableCell>{row.type}</StyledTableCell>
                            <StyledTableCell>
                              <a
                                href={"Buddy Programme.pdf"}
                                onClick={openPopup}
                                className="text-blue-500 underline cursor-pointer"
                              >
                                View
                              </a>
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Dialog
                  open={isOpen}
                  onClose={() => setIsOpen(false)}
                  PaperProps={{ sx: { width: "100%", height: "90%" } }}
                  maxWidth="lg"
                >
                  <DialogTitle
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    View
                  </DialogTitle>
                  <DialogContent dividers sx={{ padding: 0 }}>
                    <iframe
                      src={"/Buddy Programme.pdf"}
                      // src={"selectedFile"}
                      width="100%"
                      height="900px"
                      style={{ border: "none" }}
                      title="PDF Viewer"
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() => setIsOpen(false)}
                      color="primary"
                      variant="contained"
                    >
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>

                <Grid container justifyContent="flex-start" mx={1} my={2}>
                  <Typography>
                    Showing :{" "}
                    {filteredRows.length === 0 ? 0 : page * rowsPerPage + 1} -{" "}
                    {Math.min((page + 1) * rowsPerPage, filteredRows.length)}{" "}
                    Records {filteredRows.length}
                  </Typography>
                </Grid>

                <Grid container justifyContent="flex-end" my={-4}>
                  <TablePagination
                    rowsPerPageOptions={[10, 15, 20]}
                    component="div"
                    count={filteredRows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Grid>

                <Grid container justifyContent="flex-end" alignItems="end" my={4}>
                  <Grid>
                    <TextField
                      label="GoPage"
                      placeholder="Go to Page"
                      variant="outlined"
                      size="small"
                      value={gotoPage}
                      onChange={(e) => setGotoPage(e.target.value.trim())}
                      type="number"
                      inputProps={{
                        min: 1,
                        max: Math.ceil(filteredRows.length / rowsPerPage),
                      }}
                      sx={{ width: 100, borderRadius: 4 }}
                    />
                    <Button
                      variant="contained"
                      sx={{ ml: 1 }}
                      onClick={handleGotoPage}
                    >
                      Go
                    </Button>
                  </Grid>
                </Grid>

                <Grid container justifyContent="center" my={3}>
                  <Pagination
                    count={Math.ceil(filteredRows.length / rowsPerPage)}
                    page={page + 1}
                    onChange={(event, value) => setPage(value - 1)}
                    color="primary"
                    showFirstButton
                    showLastButton
                    renderItem={(item) => <PaginationItem {...item} />}
                  />
                </Grid>
              </ChildCard>
            </div>
          </Card>
    )}
  </>
    
  );

}