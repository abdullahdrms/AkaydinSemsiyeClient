import { Autocomplete, Box, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'
import Loader from 'components/Loader'
import MainCard from 'components/MainCard'
import React, { useEffect, useState } from 'react'
import { getYearlyStats } from 'services/statServices'

export default function YearlyStatsTable() {
    const [data, setData] = useState([])
    const [year, setYear] = useState(new Date().getFullYear())
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setData([])
        getYearlyStats({ year }).then((res) => {
            setData(res?.data)
            setLoading(false)
        })
    }, [year])

    const years = () => {
        let currentDate = new Date().getFullYear()
        let list = []

        for (let index = 2022; index <= currentDate; index++) {
            list.push(`${index}`)
        }
        return list
    }

    if (loading) return <Loader open={loading} />

    return (
        <>
            <MainCard>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end" sx={{ padding: 3 }}>
                    <Grid item marginBottom={2} marginTop={2} xs={2}>
                        <Autocomplete
                            disableClearable
                            fullWidth
                            id="basic-autocomplete-label"
                            options={years()}
                            defaultValue={`${new Date().getFullYear()}`}
                            onChange={(e, value) => { setYear(value) }}
                            renderInput={(params) => <TextField label="Yıl" {...params} />}
                        />
                    </Grid>
                    <Grid item marginBottom={2} marginTop={2} xs={2}>
                        <Autocomplete
                            disableClearable
                            fullWidth
                            id="basic-autocomplete-label"
                            options={['TL', 'USD']}
                            defaultValue='TL'
                            // onChange={(e, value) => { setFieldValue('orderDetailStatus', value?.id) }}
                            renderInput={(params) => <TextField label="Kur" {...params} />}
                        />
                    </Grid>
                </Stack>
                <div style={{ marginBottom: '36px' }} >
                    <div style={{ width: '100%', borderLeft: '1px solid', borderRight: '1px solid', display: 'flex', justifyContent: 'space-between', paddingLeft: '50px', paddingRight: '50px' }}>
                    </div>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell

                                        style={{ cursor: 'pointer' }}
                                    >
                                        <Stack direction="row" spacing={1} alignItems="center" justifyContent={"center"}>
                                            <Box>ÜRÜN</Box>
                                        </Stack>
                                    </TableCell>
                                    <TableCell

                                        style={{ cursor: 'pointer' }}
                                    >
                                        <Stack direction="row" spacing={1} alignItems="center" justifyContent={"center"}>
                                            <Box>BOYUTU</Box>
                                        </Stack>
                                    </TableCell>
                                    <TableCell

                                        style={{ cursor: 'pointer' }}
                                    >
                                        <Stack direction="row" spacing={1} alignItems="center" justifyContent={"center"}>
                                            <Box>KUMAŞ</Box>
                                        </Stack>
                                    </TableCell>
                                    <TableCell
                                        colSpan={3}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <Stack direction="row" spacing={1} alignItems="center" justifyContent={"center"}>
                                            <Box>ADET</Box>
                                        </Stack>
                                    </TableCell>
                                    <TableCell
                                        colSpan={2}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <Stack direction="row" spacing={1} alignItems="center" justifyContent={"center"}>
                                            <Box>SİPARİŞ TOPLAMI</Box>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>

                                {
                                    data.map((item, i) => {

                                        return (
                                            item.shape.map((itemShape, iS) => {
                                                return (
                                                    <React.Fragment key={iS}>
                                                        {(iS === 0 ? <>
                                                            <TableRow sx={[
                                                                {
                                                                    '&:hover': {
                                                                        backgroundColor: 'inherit !important',
                                                                    },
                                                                },
                                                            ]}>
                                                                <TableCell rowSpan={item.shape.length * 2} style={{ textAlign: 'center' }}>{item.productName}</TableCell>
                                                                <TableCell rowSpan={2} style={{ textAlign: 'center' }}>{item.shape[0].size}</TableCell>
                                                                <TableCell style={{ textAlign: 'center' }}>Acrilic</TableCell>
                                                                <TableCell style={{ textAlign: 'center' }}>{item.shape[0].qtyAcrilic}</TableCell>
                                                                <TableCell rowSpan={2} style={{ textAlign: 'center' }}>{item.shape[0].qty}</TableCell>
                                                                <TableCell rowSpan={item.shape.length * 2} style={{ textAlign: 'center' }}>{item.qty}</TableCell>
                                                                <TableCell rowSpan={2} style={{ textAlign: 'center' }}>{item.shape[0].price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} TL</TableCell>
                                                                <TableCell rowSpan={item.shape.length * 2} style={{ textAlign: 'center' }}>{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} TL</TableCell>
                                                            </TableRow>
                                                            <TableRow sx={[
                                                                {
                                                                    '&:hover': {
                                                                        backgroundColor: 'inherit !important',
                                                                    },
                                                                },
                                                                {
                                                                    '&:last-of-type': {
                                                                        '& .MuiTableCell-root': {
                                                                            borderBottom: '1px solid #dbe0e5a6 !important',
                                                                        }
                                                                    },
                                                                }
                                                            ]}>
                                                                <TableCell style={{ textAlign: 'center' }}>Polyester</TableCell>
                                                                <TableCell style={{ textAlign: 'center', padding: '12px' }}>{item.shape[0].qtyLocal}</TableCell>
                                                            </TableRow>
                                                        </> :
                                                            <>
                                                                <TableRow sx={[
                                                                    {
                                                                        '&:hover': {
                                                                            backgroundColor: 'inherit !important',
                                                                        },
                                                                    },
                                                                ]}>
                                                                    <TableCell rowSpan={2} style={{ textAlign: 'center' }}>{itemShape.size}</TableCell>
                                                                    <TableCell style={{ textAlign: 'center' }}>Acrilic</TableCell>
                                                                    <TableCell style={{ textAlign: 'center' }}>{itemShape?.qtyAcrilic}</TableCell>
                                                                    <TableCell rowSpan={2} style={{ textAlign: 'center' }}>{itemShape?.qty}</TableCell>
                                                                    <TableCell rowSpan={2} style={{ textAlign: 'center' }}>{itemShape.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} TL</TableCell>
                                                                </TableRow>
                                                                <TableRow sx={[
                                                                    {
                                                                        '&:hover': {
                                                                            backgroundColor: 'inherit !important',
                                                                        },
                                                                    },
                                                                ]}>
                                                                    <TableCell style={{ textAlign: 'center' }}>Polyester</TableCell>
                                                                    <TableCell style={{ textAlign: 'center', padding: '12px' }}>{itemShape?.qtyLocal}</TableCell>
                                                                </TableRow>
                                                            </>)}
                                                    </React.Fragment>
                                                );
                                            })
                                        );
                                    })
                                }

                            </TableBody>

                        </Table>
                    </TableContainer>
                </div>
            </MainCard>
        </>

    )
}