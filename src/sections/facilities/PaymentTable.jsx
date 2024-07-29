import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Chip, CircularProgress, Stack, Tooltip } from '@mui/material';
import { useEffect } from 'react';
import { GetPayments } from 'services/paymentServices';
import { useState } from 'react';
import IconButton from 'components/@extended/IconButton';
import { Edit, Eye } from 'iconsax-react';
import { formatDate, stringToDate } from 'utils/custom/dateHelpers';
import PaymentUpdateModal from './PaymentUpdateModal';

export default function PaymentTable({ id, isEdit, setIsEdit, data }) {
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedPayment, setSelectedPayment] = useState([])
    const [paymentUpdateModal, setPaymentUpdateModal] = useState(false)

    let totalPrice = 0
    let totalTaxPrice = 0

    useEffect(() => {
        if (id || isEdit) {
            setRows([])
            data?.map((item, i) => {
                totalPrice = totalPrice + (item?.price * item?.qty)
                totalTaxPrice = totalTaxPrice + (((item?.price * item?.qty) * item?.tax) / 100)
            })
            GetPayments(id).then((res) => {
                let totalPayment = 0
                res?.data?.map((item, i) => {
                    totalPayment = totalPayment + item?.amount
                    const data1 = {
                        paymentDate: formatDate(stringToDate(item?.createdAt)),
                        till: item?.paymentType?.name,
                        paymentDesc: item?.paymentNote,
                        amount: item?.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' TL',
                        original: item
                    }
                    setRows((prevValues) => [...prevValues, data1])
                    if (res?.data?.length === i + 1) {
                        const data1 = {
                            paymentDate: "",
                            till: "",
                            paymentDesc: "",
                            amount: "Toplam Ödeme",
                            text: `${totalPayment.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} TL`,
                        }
                        setRows((prevValues) => [...prevValues, data1])
                        const data2 = {
                            paymentDate: "",
                            till: "",
                            paymentDesc: "",
                            amount: "Kalan Ödeme",
                            text: `${((totalPrice + totalTaxPrice) - totalPayment).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} TL`,
                        }
                        setRows((prevValues) => [...prevValues, data2])
                    }
                })
                setLoading(false)
            })
        }
    }, [id, isEdit])

    return (
        <>
            <PaymentUpdateModal setIsEdit={setIsEdit} selectedPayment={selectedPayment} open={paymentUpdateModal} modalToggler={setPaymentUpdateModal} />
            <TableContainer component={Paper}>
                {
                    loading ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}> <CircularProgress style={{ marginTop: '20px', marginBottom: '20px', marginLeft: '20px' }} /></div> :
                        <Table sx={{ minWidth: 650 }} aria-label="caption table">
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ minWidth: '200px' }} >ÖDEME TARİHİ</TableCell>
                                    <TableCell align="right">KASA</TableCell>
                                    <TableCell align="right">ÖDEME AÇIKLAMASI</TableCell>
                                    <TableCell align="right">TUTAR</TableCell>
                                    <TableCell align="right">İŞLEMLER</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row, i) => (
                                    <TableRow key={i}>
                                        <TableCell component="th" scope="row">
                                            {row.paymentDate}
                                        </TableCell>
                                        <TableCell align="right">{row.till}</TableCell>
                                        <TableCell align="right">{row.paymentDesc}</TableCell>
                                        <TableCell style={{ fontWeight: row?.text ? 'bold' : 'normal' }} align="right">{row.amount}</TableCell>
                                        <TableCell style={{ fontWeight: row?.text ? 'bold' : 'normal' }} align="right">
                                            {
                                                row?.text ? row?.text :
                                                    <Stack style={{ justifyContent: 'end' }} direction="row" spacing={0}>

                                                        <Tooltip title="Edit">
                                                            <IconButton
                                                                color="primary"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedPayment(row.original)
                                                                    setPaymentUpdateModal(true)
                                                                }}
                                                            >
                                                                <Edit />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Stack>
                                            }
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                }
            </TableContainer>
        </>
    );
}
