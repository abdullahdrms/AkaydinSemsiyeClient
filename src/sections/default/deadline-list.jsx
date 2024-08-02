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
import { getMaterials } from 'services/stockServices';
import StockCreateModal from 'sections/stock/StockCreateModal';
import MaterialCreateModal from 'sections/stock/MaterialCreateModal';
import { GetListDeadline } from 'services/ordersServices';
import { formatDate, stringToDate } from 'utils/custom/dateHelpers';

// ==============================|| REACT TABLE - LIST ||============================== //
const fallbackData = [];
function ReactTable({ data, columns, pagination, setPagination, setSorting, sorting, globalFilter, setGlobalFilter, setStockModal }) {

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


    return (
        <>
            <MainCard content={false}>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ padding: 3 }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant='h5'>Termin Tarihi Yaklaşan Siparişler</Typography>
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
                                                navigate(`/orders/detail/${row?.original?.id}`)
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
                        {/* <>
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
                        </> */}
                    </Stack>
                </ScrollX>
            </MainCard>
        </>
    );
}
// ==============================|| CUSTOMER LIST ||============================== //

export default function DeadlineList() {
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

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10
    });

    const [data, setData] = useState(() => []);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        GetListDeadline().then((res) => { setData(res); setLoading(false); })
    }, [pagination.pageIndex, pagination.pageSize, sorting]);

    useEffect(() => {
        setPagination({ ...pagination, pageIndex: 0 })
    }, [globalFilter])

    useEffect(() => {
        if (isEdit) {
            setIsEdit(false)
            setLoading(true)
            GetListDeadline().then((res) => { setData(res); setLoading(false); })

        }
    }, [isEdit])

    const handleClose = () => {
        setOrderModalDelete(!orderModalDelete);
    };

    const columns = useMemo(
        () => [

            {
                header: 'Sipariş No',
                cell: ({ row }) => { return row?.original?.orderNumber }
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
                            <Typography fontSize={13} variant="p">Telefon: {row?.original?.customer?.phone}</Typography>
                        </Stack>
                        {/* <Chip sx={{ borderRadius: 1, position: 'relative', top: -1 }} size="small" label={row?.original?.customer.customerType === 1 ? 'Müşteri' : 'Bayi'} variant="outlined" color={row?.original?.customer.customerType === 1 ? 'warning' : 'primary'} /> */}
                    </Stack>
                )
            },
            {
                header: 'Tutar',
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
                header: 'Termin Tarihi',
                cell: ({ row }) => { return formatDate(stringToDate(row?.original?.deadline)) }
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
                        default:
                            return <Chip color="info" label="Pending" size="small" variant="light" />;
                    }
                }
            },
            // {
            //     header: 'İşlemler',
            //     meta: {
            //         className: 'cell-center'
            //     },
            //     disableSortBy: true,
            //     cell: ({ row }) => {
            //         const collapseIcon =
            //             row.getCanExpand() && row.getIsExpanded() ? (
            //                 <Add style={{ color: theme.palette.error.main, transform: 'rotate(45deg)' }} />
            //             ) : (
            //                 <Eye />
            //             );
            //         return (
            //             <Stack direction="row" spacing={0}>
            //                 {/* <Tooltip title="Görüntüle">
            //                     <IconButton color="secondary" onClick={row.getToggleExpandedHandler()}>
            //                         {collapseIcon}
            //                     </IconButton>
            //                 </Tooltip> */}
            //                 <Tooltip title="Düzenle">
            //                     <IconButton
            //                         color="primary"
            //                         onClick={(e) => {
            //                             e.stopPropagation();
            //                             // setSelectedStock()
            //                             console.log(row);
            //                             setSelectedStock(row?.original)
            //                             setStockModal(true)
            //                         }}
            //                     >
            //                         <Edit />
            //                     </IconButton>
            //                 </Tooltip>
            //                 <Tooltip title="Sil">
            //                     <IconButton
            //                         color="error"
            //                     // onClick={(e) => {
            //                     //     e.stopPropagation();
            //                     //     handleClose();
            //                     //     setCustomerDeleteId(Number(row.original.id));
            //                     // }}
            //                     >
            //                         <Trash />
            //                     </IconButton>
            //                 </Tooltip>
            //             </Stack>
            //         );
            //     }
            // }
        ], // eslint-disable-next-line
        [theme]
    );
    // let breadcrumbLinks = [{ title: 'Stok Yönetimi' }, { title: 'Stok Listesi', to: `/stock/list` }];

    if (loading) return (<Loader open={loading} />)

    return (
        <>
            {/* <Breadcrumbs custom links={breadcrumbLinks} /> */}
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
                    setStockModal
                }}
            />
            <OrderModalDelete setIsDeleted={setIsDeleted} setLoading={setLoading} id={Number(customerDeleteId)} title={customerDeleteId} open={orderModalDelete} handleClose={handleClose} />
            <MaterialCreateModal selectedStock={selectedStock} setSelectedStock={setSelectedStock} setIsEdit={setIsEdit} open={stockModal} modalToggler={setStockModal} />
        </>
    );
}