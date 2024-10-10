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
import { DebouncedInput, HeaderSort, TablePagination } from 'components/third-party/react-table';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';
import OrderModalDelete from 'sections/facilities/OrderModalDelete';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

// assets
import { Add, Edit, Eye, Trash, Location } from 'iconsax-react';

// custom
import Loader from 'components/Loader';
import { useNavigate } from 'react-router-dom';
import { GetFilterCustomer } from 'services/customersServices';

// ==============================|| REACT TABLE - LIST ||============================== //
const fallbackData = [];
function ReactTable({ data, columns, pagination, setPagination, setSorting, sorting, globalFilter, setGlobalFilter }) {

    const navigate = useNavigate();

    const table = useReactTable({
        data: data?.data || fallbackData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        pageCount: (Math.ceil(data?.totalCount / pagination.pageSize)) || 1,
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
                        <Button variant="contained" startIcon={<Add />} onClick={() => { navigate("/customers/add"); }} size="large">
                            Müşteri Ekle
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
                                            onClick={() => {
                                                navigate(`/customers/detail/${row?.original?.id}`)
                                            }}
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

export default function CustomersList() {
    const theme = useTheme();
    const navigate = useNavigate()

    const [sorting, setSorting] = useState([{ id: 'id', desc: true }]);
    const [globalFilter, setGlobalFilter] = useState('');

    const [customerDeleteId, setCustomerDeleteId] = useState('');
    const [isDeleted, setIsDeleted] = useState(false)
    const [orderModalDelete, setOrderModalDelete] = useState(false);

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10
    });

    const [data, setData] = useState(() => []);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        GetFilterCustomer({ customerType: 1, page: pagination.pageIndex, size: pagination.pageSize }).then((res) => { setData(res); setLoading(false); })
    }, [pagination.pageIndex, pagination.pageSize, sorting, globalFilter]);

    useEffect(() => {
        setPagination({ ...pagination, pageIndex: 0 })
    }, [globalFilter])

    useEffect(() => {
        if (isDeleted) {
            setIsDeleted(false)
            setLoading(true)
            GetFilterCustomer({ customerType: 1, page: pagination.pageIndex, size: pagination.pageSize }).then((res) => { setData(res); setLoading(false); })
        }
    }, [isDeleted])

    const handleClose = () => {
        setOrderModalDelete(!orderModalDelete);
    };

    const columns = useMemo(
        () => [

            {
                header: 'İsim Soyisim',
                cell: ({ row, getValue }) => (
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                            alt="Avatar"
                            size="sm"
                            src={getImageUrl(`avatar-${!row.original.avatar ? 1 : row.original.avatar}.png`, ImagePath.USERS)}
                        />
                        <Stack spacing={0}>
                            <Typography variant="subtitle1">{row.original.firstName} {row.original.lastName}</Typography>
                        </Stack>
                    </Stack>
                )
            },
            {
                header: 'Toplam Bakiye',
                cell: ({ row, getValue }) => (
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Stack spacing={0}>
                            <Typography variant="subtitle1">{row.original.totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} TL</Typography>
                        </Stack>
                    </Stack>
                )
            },
            {
                header: 'Kalan Bakiye',
                cell: ({ row, getValue }) => (
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Stack spacing={0}>
                            <Typography variant="subtitle1">{row.original.totalPayment.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} TL</Typography>
                        </Stack>
                    </Stack>
                )
            },
            {
                header: 'Müşteri Durumu',
                cell: ({ row }) => {
                    switch (row?.original?.generalStatusType) {
                        case 1: return <Chip color="success" label="Aktif" size="small" variant="light" />
                        case 2: return <Chip color="error" label="Pasif" size="small" variant="light" />
                        case 3: return <Chip color="error" label="Silinmiş" size="small" variant="light" />
                    }
                }
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
                        <Stack width={120} direction="row" spacing={0}>
                            <Tooltip title="Görüntüle">
                                <IconButton color="secondary" onClick={row.getToggleExpandedHandler()}>
                                    {collapseIcon}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Düzenle">
                                <IconButton
                                    color="primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/customers/update/${row?.original?.id}`)
                                    }}
                                >
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Adresler">
                                <IconButton
                                    color="secondary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/customers/addresses/${row?.original?.id}`)

                                    }}
                                >
                                    <Location />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Sil">
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
                            </Tooltip>
                        </Stack>
                    );
                }
            }
        ], // eslint-disable-next-line
        [theme]
    );
    let breadcrumbLinks = [{ title: 'Müşteri Yönetimi' }, { title: 'Müşteriler', to: `/customers/list` }];

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
                    setGlobalFilter
                }}
            />
            <OrderModalDelete setIsDeleted={setIsDeleted} setLoading={setLoading} id={Number(customerDeleteId)} title={customerDeleteId} open={orderModalDelete} handleClose={handleClose} />
        </>
    );
}