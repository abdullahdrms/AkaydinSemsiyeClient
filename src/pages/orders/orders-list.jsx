/* eslint-disable prettier/prettier */
import { useMemo, useState, Fragment, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Chip, Divider, Stack, Button, Table, TableCell, TableBody, TableHead, TableRow, TableContainer, Tooltip, Typography, Box } from '@mui/material';

// third-party
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

// project-import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import { DebouncedInput, HeaderSort, IndeterminateCheckbox, TablePagination } from 'components/third-party/react-table';
import OrderModalDelete from 'sections/facilities/OrderModalDelete';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

// assets
import { Add, Edit, Eye, InfoCircle, Trash } from 'iconsax-react';

// custom
import Loader from 'components/Loader';
import { useNavigate } from 'react-router-dom';
import { GetOrders } from 'services/ordersServices';
import { formatDate, stringToDate } from 'utils/custom/dateHelpers';
import OrdersPopup from 'sections/facilities/OrdersPopup';

// ==============================|| REACT TABLE - LIST ||============================== //
const fallbackData = [];
function ReactTable({ data, columns, pagination, setPagination, setSorting, sorting, globalFilter, setGlobalFilter, setRowSelection, rowSelection, setOrdersPopup, ordersPopup }) {

    const [query, setQuery] = useState('')
    const navigate = useNavigate();

    const table = useReactTable({
        data: data?.data || fallbackData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getRowId: row => row?.id,
        onPaginationChange: setPagination,
        onRowSelectionChange: setRowSelection,
        enableRowSelection: true,
        onSortingChange: setSorting,
        pageCount: (Math.ceil(data?.totalCount / pagination.pageSize)) || 1,
        autoResetPageIndex: false,
        state: {
            sorting,
            globalFilter,
            pagination,
            rowSelection
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

    useEffect(() => {
        setQuery('')
        var result = Object.keys(rowSelection).map((key) => [key]);
        result.map((item) => {
            setQuery((prevValue) => `${prevValue ? prevValue + ',' : ''}${item[0]}`)
        })
    }, [rowSelection])

    const handleNavigate = (e, row) => {
        if (e?.target?.type !== "checkbox") {
            navigate(`/orders/detail/${row?.original?.id}`)
        }
    }

    return (
        <>
            <MainCard content={false}>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ padding: 3, overflowX: 'auto' }}>
                    <DebouncedInput
                        value={globalFilter ?? ''}
                        onFilterChange={(value) => setGlobalFilter(String(value))}
                        placeholder={`Search ${data?.totalCount} records...`}
                    />
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Button variant="contained" color='info' startIcon={<Add />} onClick={() => setOrdersPopup(true)} size="large">
                            Liste
                        </Button>
                        <Button variant="contained" color='success' startIcon={<Add />} onClick={() => { if (query !== '') navigate(`/orders/delivery-list-print?id=${query}`); }} size="large">
                            Teslimat Listesi Oluştur
                        </Button>
                        <Button variant="contained" startIcon={<Add />} onClick={() => { navigate("/orders/add"); }} size="large">
                            Sipariş Ekle
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
                                            style={{ cursor: 'pointer' }}
                                            onClick={(e) => handleNavigate(e, row)}
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

export default function OrderList() {
    const navigate = useNavigate()
    const theme = useTheme();

    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [rowSelection, setRowSelection] = useState({})

    const [customerDeleteId, setCustomerDeleteId] = useState('');
    const [isDeleted, setIsDeleted] = useState(false)
    const [orderModalDelete, setOrderModalDelete] = useState(false);

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10
    });

    const [data, setData] = useState(() => []);

    const [ordersPopup, setOrdersPopup] = useState(false)

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        GetOrders({ pageSize: pagination.pageSize, page: pagination.pageIndex, searchVal: globalFilter, orderStatusType: sorting[0]?.id === 'orderStatusType' ? sorting[0]?.desc ? 'desc' : 'asc' : null, price: sorting[0]?.id === 'price' ? sorting[0]?.desc ? 'desc' : 'asc' : null, orderDate: sorting[0]?.id === 'orderDate' ? sorting[0]?.desc ? 'desc' : 'asc' : null, deadlineDate: sorting[0]?.id === 'deadlineDate' ? sorting[0]?.desc ? 'desc' : 'asc' : null }).then((res) => { setData(res); setLoading(false); })
    }, [pagination.pageIndex, pagination.pageSize, sorting, globalFilter]);

    useEffect(() => {
        setPagination({ ...pagination, pageIndex: 0 })
    }, [globalFilter])

    useEffect(() => {
        if (isDeleted) {
            setIsDeleted(false)
            setLoading(true)
            GetOrders({ pageSize: pagination.pageSize, page: pagination.pageIndex, searchVal: globalFilter }).then((res) => { setData(res); setLoading(false); })
        }
    }, [isDeleted])

    const handleClose = () => {
        setOrderModalDelete(!orderModalDelete);
    };

    const columns = useMemo(
        () => [
            {
                id: 'select',
                header: ({ table }) => (
                    <IndeterminateCheckbox
                        {...{
                            checked: table.getIsAllRowsSelected(),
                            indeterminate: table.getIsSomeRowsSelected(),
                            onChange: table.getToggleAllRowsSelectedHandler(),
                        }}
                    />
                ),
                cell: ({ row }) => (
                    <IndeterminateCheckbox
                        {...{
                            checked: row.getIsSelected(),
                            disabled: !row.getCanSelect(),
                            indeterminate: row.getIsSomeSelected(),
                            onChange: row.getToggleSelectedHandler(),
                        }}
                    />
                )
            },
            {
                header: 'Sipariş No',
                cell: ({ row }) => (
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Tooltip title={`${row?.original?.person?.name} ${row?.original?.person?.surName}`}>
                            <IconButton color="warning">
                                <InfoCircle />
                            </IconButton>
                        </Tooltip>
                        <Stack spacing={0}>
                            <Typography variant="subtitle1">{row?.original?.orderNumber}</Typography>
                        </Stack>

                    </Stack>
                )
            },
            {
                header: 'Müşteri',
                cell: ({ row, getValue }) => (
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        {/* <Avatar
                            alt="Avatar"
                            size="sm"
                            src={getImageUrl(`avatar-${!row.original.avatar ? 1 : row.original.avatar}.png`, ImagePath.USERS)}
                        /> */}
                        <Stack spacing={0}>
                            <Typography variant="subtitle1">{row?.original?.customer?.firstName} {row?.original?.customer?.lastName}</Typography>
                        </Stack>
                        <Chip sx={{ borderRadius: 1, position: 'relative', top: -1 }} size="small" label={row?.original?.customer.customerType === 1 ? 'Müşteri' : 'Bayi'} variant="outlined" color={row?.original?.customer.customerType === 1 ? 'warning' : 'primary'} />
                    </Stack>
                )
            },
            {
                header: 'Sipariş Durumu',
                accessorKey: 'orderStatusType',
                cell: (cell) => {
                    switch (cell.getValue()) {
                        case 1:
                            return <Chip color="success" label="Oluşturuldu" size="small" variant="light" />;
                        case 2:
                            return <Chip color="success" label="Başladı" size="small" variant="light" />;
                        case 3:
                            return <Chip color="info" label="Kısmi Hazır" size="small" variant="light" />;
                        case 4:
                            return <Chip color="success" label="Teslime Hazır" size="small" variant="light" />;
                        case 5:
                            return <Chip color="success" label="Teslim Edildi" size="small" variant="light" />;
                        case 6:
                            return <Chip color="error" label="İptal Edildi" size="small" variant="light" />;
                        case 10:
                            return <Chip color="primary" label="Bayi Oluşturdu" size="small" variant="light" />;
                        case 11:
                            return <Chip color="warning" label="Onay Bekliyor" size="small" variant="light" />;
                        default:
                            return <Chip color="info" label="Pending" size="small" variant="light" />;
                    }
                }
            },
            {
                header: 'Tutar',
                accessorKey: 'price',
                cell: ({ row }) => {
                    return (
                        <div>
                            <div style={{ fontWeight: '600' }}>{row?.original?.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} TL</div>
                            <div style={{ color: '#f1416c', fontWeight: '600' }}>( {((parseFloat(row?.original?.price) - parseFloat(row?.original?.payment)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} TL )</div>
                        </div>
                    )
                }
            },
            {
                header: 'Sipariş Tarihi',
                accessorKey: 'orderDate',
                cell: ({ row }) => { return formatDate(stringToDate(row?.original?.createdAt)) }
            },
            {
                header: 'Termin Tarihi',
                accessorKey: 'deadlineDate',
                cell: ({ row }) => { return formatDate(stringToDate(row?.original?.deadline)) }
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
                            <Tooltip title="View">
                                <IconButton color="secondary" onClick={() => { row.getToggleExpandedHandler(); navigate(`/orders/detail/${row.original.id}`) }}>
                                    {collapseIcon}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                                <IconButton
                                    color="primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/orders/update/${row?.original?.id}`)
                                    }}
                                >
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                            {/* <Tooltip title="Delete">
                                <IconButton
                                    color="error"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleClose();
                                        setCustomerDeleteId(Number(row.original.id));
                                    }}
                                >
                                    <Trash />
                                </IconButton>
                            </Tooltip> */}
                        </Stack>
                    );
                }
            }
        ], // eslint-disable-next-line
        [theme]
    );
    let breadcrumbLinks = [{ title: 'Sipariş Yönetimi' }, { title: 'Sipariş Listesi', to: `/orders/list` }];

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
                    setRowSelection,
                    rowSelection,
                    setOrdersPopup,
                    ordersPopup
                }}
            />
            <OrderModalDelete setIsDeleted={setIsDeleted} setLoading={setLoading} id={Number(customerDeleteId)} title={customerDeleteId} open={orderModalDelete} handleClose={handleClose} />
            <OrdersPopup open={ordersPopup} modalToggler={setOrdersPopup} />
        </>
    );
}