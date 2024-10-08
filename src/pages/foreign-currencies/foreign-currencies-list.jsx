/* eslint-disable prettier/prettier */
import { useMemo, useState, Fragment, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Chip, Divider, Stack, Button, Table, TableCell, TableBody, TableHead, TableRow, TableContainer, Tooltip, Typography, Box, Grid, Autocomplete, TextField } from '@mui/material';

// third-party
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

// project-import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import { DebouncedInput, HeaderSort, TablePagination } from 'components/third-party/react-table';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';
import OrderModalDelete from 'sections/facilities/OrderModalDelete';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

// assets
import { Add, Edit, Eye, Trash, Location } from 'iconsax-react';

// custom
import Loader from 'components/Loader';
import { useNavigate } from 'react-router-dom';
import { getMaterials, getSemiFinished } from 'services/stockServices';
import SemiFinishedCreateModal from 'sections/stock/SemiFinishedCreateModal';
import { GetAllForeign } from 'services/foreignCurrenciesService';
import ForeignCurrenciesCreateModal from 'sections/foreign-currencies/ForeignCurrenciesCreateModal';

// ==============================|| REACT TABLE - LIST ||============================== //
const fallbackData = [];
function ReactTable({ data, columns, pagination, setPagination, setSorting, sorting, globalFilter, setGlobalFilter, setStockModal, year, setYear }) {

    const navigate = useNavigate();

    const table = useReactTable({
        data: data?.data || fallbackData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        pageCount: data?.meta?.pagination?.pageCount || 1,
        autoResetPageIndex: false,
        state: {
            sorting,
            globalFilter,
            pagination
        },
        debugTable: true
    });

    let headers = [];
    columns.map(
        (columns) =>
            // @ts-ignore
            columns.accessorKey &&
            headers.push({
                label: typeof columns.header === 'string' ? columns.header : '#',
                // @ts-ignore
                key: columns.accessorKey
            })
    );

    const years = () => {
        let currentDate = new Date().getFullYear()
        let list = []

        for (let index = 2022; index <= currentDate; index++) {
            list.push(`${index}`)
        }
        return list
    }

    return (
        <>
            <MainCard content={false}>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ padding: 3, overflowX: 'auto' }}>
                    <DebouncedInput
                        value={globalFilter ?? ''}
                        onFilterChange={(value) => setGlobalFilter(String(value))}
                        placeholder={`Search ${data?.data?.length} records...`}
                    />
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Grid item marginBottom={2} marginTop={2} xs={4}>
                            <Autocomplete
                                disableClearable
                                fullWidth
                                id="basic-autocomplete-label"
                                options={years()}
                                // getOptionLabel={(option) => `${option?.name}` || ''}
                                value={years().find((itm) => itm === year.toString()) || null}
                                ListboxProps={{ style: { maxHeight: 150 } }}
                                style={{ width: '170px' }}
                                onChange={(e, value) => setYear(value.toString())}
                                renderInput={(params) => <TextField label="Yıl" {...params} />}
                            />
                        </Grid>
                        <Button variant="contained" startIcon={<Add />} onClick={() => { setStockModal(true) }} size="large">
                            Stok Ekle
                        </Button>
                    </Stack>
                </Stack>
                <ScrollX>
                    <Stack>

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => {
                                                if (header.column.columnDef.meta !== undefined && header.column.getCanSort()) {
                                                    Object.assign(header.column.columnDef.meta, {
                                                        className: header.column.columnDef.meta.className + ' cursor-pointer prevent-select'
                                                    });
                                                }
                                                return (
                                                    <TableCell
                                                        key={header.id}
                                                        {...header.column.columnDef.meta}
                                                        onClick={header.column.getToggleSortingHandler()}
                                                        {...(header.column.getCanSort() &&
                                                            header.column.columnDef.meta === undefined && {
                                                            className: 'cursor-pointer prevent-select'
                                                        })}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        {header.isPlaceholder ? null : (
                                                            <Stack direction="row" spacing={1} alignItems="center">
                                                                <Box>{flexRender(header.column.columnDef.header, header.getContext())}</Box>
                                                                {header.column.getCanSort() && <HeaderSort column={header.column} />}
                                                            </Stack>
                                                        )}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    ))}
                                </TableHead>
                                <TableBody>
                                    {table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            // onClick={() => {
                                            //     navigate(`/customers/detail/1`)
                                            // }}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <>
                            <Divider />
                            <Box sx={{ p: 2 }}>
                                <TablePagination
                                    {...{
                                        setPageSize: table.setPageSize,
                                        setPageIndex: table.setPageIndex,
                                        getState: table.getState,
                                        getPageCount: table.getPageCount,
                                        initialPageSize: pagination.pageSize
                                    }}
                                />
                            </Box>
                        </>
                    </Stack>
                </ScrollX>
            </MainCard>
        </>
    );
}
// ==============================|| CUSTOMER LIST ||============================== //

export default function ForeignCurrenciesList() {
    const theme = useTheme();
    const navigate = useNavigate()

    const [sorting, setSorting] = useState([{ id: 'id', desc: true }]);
    const [globalFilter, setGlobalFilter] = useState('');

    const [customerDeleteId, setCustomerDeleteId] = useState('');
    const [isDeleted, setIsDeleted] = useState(false)
    const [orderModalDelete, setOrderModalDelete] = useState(false);
    const [stockModal, setStockModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [selectedStock, setSelectedStock] = useState(undefined)
    const [year, setYear] = useState(new Date().getFullYear())

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10
    });

    const [data, setData] = useState(() => []);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        GetAllForeign({ page: pagination.pageIndex, size: pagination.pageSize, year: year }).then((res) => { setData(res); setLoading(false); })
    }, [pagination.pageIndex, pagination.pageSize, sorting, globalFilter, year]);

    useEffect(() => {
        setPagination({ ...pagination, pageIndex: 0 })
    }, [globalFilter])

    useEffect(() => {
        if (isEdit) {
            setIsEdit(false)
            setLoading(true)
            GetAllForeign({ page: pagination.pageIndex, size: pagination.pageSize, year: year }).then((res) => { setData(res); setLoading(false); })
        }
    }, [isEdit])

    const handleClose = () => {
        setOrderModalDelete(!orderModalDelete);
    };

    const returnMonthName = (number) => {
        const turkishMonths = [
            {
                id: 1,
                name: "Ocak",
                shortName: "Oca"
            },
            {
                id: 2,
                name: "Şubat",
                shortName: "Şub"
            },
            {
                id: 3,
                name: "Mart",
                shortName: "Mar"
            },
            {
                id: 4,
                name: "Nisan",
                shortName: "Nis"
            },
            {
                id: 5,
                name: "Mayıs",
                shortName: "May"
            },
            {
                id: 6,
                name: "Haziran",
                shortName: "Haz"
            },
            {
                id: 7,
                name: "Temmuz",
                shortName: "Tem"
            },
            {
                id: 8,
                name: "Ağustos",
                shortName: "Ağu"
            },
            {
                id: 9,
                name: "Eylül",
                shortName: "Eyl"
            },
            {
                id: 10,
                name: "Ekim",
                shortName: "Eki"
            },
            {
                id: 11,
                name: "Kasım",
                shortName: "Kas"
            },
            {
                id: 12,
                name: "Aralık",
                shortName: "Ara"
            }

        ]
        return turkishMonths.find((item) => item.id == number).name
    }

    const columns = useMemo(
        () => [

            {
                header: 'Ay',
                cell: ({ row, getValue }) => (
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Stack spacing={0}>
                            <Typography variant="subtitle1">{returnMonthName(row?.original?.month)}</Typography>
                        </Stack>
                    </Stack>
                )
            },
            {
                header: 'Fiyat',
                cell: ({ row, getValue }) => (
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Stack spacing={0}>
                            <Typography variant="subtitle1">{row.original.price} TL</Typography>
                        </Stack>
                    </Stack>
                )
            },
            {
                header: 'İşlemler',
                meta: {
                    className: 'cell-center'
                },
                disableSortBy: true,
                cell: ({ row }) => {
                    const collapseIcon =
                        row.getCanExpand() && row.getIsExpanded() ? (
                            <Add style={{ color: theme.palette.error.main, transform: 'rotate(45deg)' }} />
                        ) : (
                            <Eye />
                        );
                    return (
                        <Stack direction="row" spacing={0}>
                            {/* <Tooltip title="Görüntüle">
                                <IconButton color="secondary" onClick={row.getToggleExpandedHandler()}>
                                    {collapseIcon}
                                </IconButton>
                            </Tooltip> */}
                            <Tooltip title="Düzenle">
                                <IconButton
                                    color="primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // setSelectedStock()
                                        setSelectedStock(row?.original)
                                        setStockModal(true)
                                    }}
                                >
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Sil">
                                <IconButton
                                    color="error"
                                // onClick={(e) => {
                                //     e.stopPropagation();
                                //     handleClose();
                                //     setCustomerDeleteId(Number(row.original.id));
                                // }}
                                >
                                    <Trash />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    );
                }
            }
        ], // eslint-disable-next-line
        [theme]
    );
    let breadcrumbLinks = [{ title: 'Döviz Yönetimi' }, { title: 'Döviz Listesi', to: `/foreign-currencies` }];

    if (loading) return (<Loader open={loading} />)

    return (
        <>
            <Breadcrumbs custom links={breadcrumbLinks} />
            <ReactTable
                {...{
                    data,
                    columns,
                    pagination,
                    setPagination,
                    setSorting,
                    sorting,
                    globalFilter,
                    setGlobalFilter,
                    setStockModal,
                    year,
                    setYear
                }}
            />
            <OrderModalDelete setIsDeleted={setIsDeleted} setLoading={setLoading} id={Number(customerDeleteId)} title={customerDeleteId} open={orderModalDelete} handleClose={handleClose} />
            <ForeignCurrenciesCreateModal selectedStock={selectedStock} setSelectedStock={setSelectedStock} setIsEdit={setIsEdit} open={stockModal} modalToggler={setStockModal} />
        </>
    );
}