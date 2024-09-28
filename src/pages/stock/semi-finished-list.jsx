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

// ==============================|| REACT TABLE - LIST ||============================== //
const fallbackData = [];
function ReactTable({ data, columns, pagination, setPagination, setSorting, sorting, globalFilter, setGlobalFilter, setStockModal, setStorage, setStockType, storage, stockType }) {

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

    const storageTypes = [
        { id: 0, name: 'Hepsi' },
        { id: 1, name: 'Şirket Depo' },
        { id: 2, name: 'Bozhane Depo' },
        { id: 3, name: 'Ümraniye Depo' }
    ]

    const stockTypes = [
        { id: 0, name: 'Hepsi' },
        { id: 1, name: 'İskelet' },
        { id: 2, name: 'Kumaş' },
        { id: 3, name: 'Ayak' }
    ]

    return (
        <>
            <MainCard content={false}>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ padding: 3 }}>
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
                                options={storageTypes}
                                value={storageTypes.find((itm) => itm.id === storage) || null}
                                getOptionLabel={(option) => `${option?.name}` || ''}
                                isOptionEqualToValue={(option) => option.id === storage}
                                ListboxProps={{ style: { maxHeight: 150 } }}
                                style={{ width: '170px' }}
                                onChange={(e, value) => setStorage(value.id)}
                                renderInput={(params) => <TextField label="Depo" {...params} />}
                            />
                        </Grid>
                        <Grid item marginBottom={2} marginTop={2} xs={4}>
                            <Autocomplete
                                disableClearable
                                fullWidth
                                id="basic-autocomplete-label2"
                                options={stockTypes}
                                getOptionLabel={(option) => `${option?.name}` || ''}
                                isOptionEqualToValue={(option) => option.id === stockType}
                                value={stockTypes.find((itm) => itm.id === stockType) || null}
                                ListboxProps={{ style: { maxHeight: 150 } }}
                                style={{ width: '170px' }}
                                onChange={(e, value) => setStockType(value.id)}
                                renderInput={(params) => <TextField label="Stok Tipi" {...params} />}
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

export default function SemiFinishedList() {
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
    const [storage, setStorage] = useState(0)
    const [stockType, setStockType] = useState(0)

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10
    });

    const [data, setData] = useState(() => []);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        getSemiFinished({ page: pagination.pageIndex, size: pagination.pageSize, storage: storage, stockType: stockType }).then((res) => { setData(res); setLoading(false); })
    }, [pagination.pageIndex, pagination.pageSize, sorting, globalFilter, storage, stockType]);

    useEffect(() => {
        setPagination({ ...pagination, pageIndex: 0 })
    }, [globalFilter])

    useEffect(() => {
        if (isEdit) {
            setIsEdit(false)
            setLoading(true)
            getSemiFinished({ page: pagination.pageIndex, size: pagination.pageSize, storage: storage, stockType: stockType }).then((res) => { setData(res); setLoading(false); })
        }
    }, [isEdit])

    const handleClose = () => {
        setOrderModalDelete(!orderModalDelete);
    };

    const columns = useMemo(
        () => [

            {
                header: 'Başlık',
                cell: ({ row, getValue }) => (
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Stack spacing={0}>
                            <Typography variant="subtitle1">{row.original.name}</Typography>
                        </Stack>
                    </Stack>
                )
            },
            {
                header: 'Stok Kodu',
                cell: ({ row, getValue }) => (
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Stack spacing={0}>
                            <Typography variant="subtitle1">{row.original.stockCode}</Typography>
                        </Stack>
                    </Stack>
                )
            },
            {
                header: 'Adet',
                cell: ({ row, getValue }) => (
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Stack spacing={0}>
                            <Typography variant="subtitle1">{row.original.qty}</Typography>
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
    let breadcrumbLinks = [{ title: 'Stok Yönetimi' }, { title: 'Stok Listesi', to: `/stock/list` }];

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
                    setStockType,
                    setStorage,
                    storage,
                    stockType
                }}
            />
            <OrderModalDelete setIsDeleted={setIsDeleted} setLoading={setLoading} id={Number(customerDeleteId)} title={customerDeleteId} open={orderModalDelete} handleClose={handleClose} />
            <SemiFinishedCreateModal selectedStock={selectedStock} setSelectedStock={setSelectedStock} setIsEdit={setIsEdit} open={stockModal} modalToggler={setStockModal} />
        </>
    );
}