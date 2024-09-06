import { Autocomplete, Box, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'
import Loader from 'components/Loader'
import MainCard from 'components/MainCard'
import React, { useEffect, useState } from 'react'
import { getGeneralStats } from 'services/statServices'

export default function GeneralStatsTable() {
    const [data, setData] = useState([])
    const [firstYear, setFirstYear] = useState(new Date().getFullYear() - 2)
    const [lastYear, setLastYear] = useState(new Date().getFullYear())
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState([])

    useEffect(() => {
        setData([])
        setTotal([])
        for (let index = firstYear; index <= lastYear; index++) {
            setTotal((prevValues) => [...prevValues, { year: parseInt(index), price: 0 }])
        }
        getGeneralStats({ firstYear: firstYear, lastYear: lastYear }).then((res) => {
            res?.data?.map((item) => {
                item?.years?.map((year) => {
                    setTotal((prevTotal) =>
                        prevTotal.map((totalItem) =>
                            totalItem.year === year.year
                                ? { ...totalItem, price: year.price + totalItem.price }
                                : totalItem
                        )
                    );
                })
            })
            setData(res?.data)
            setLoading(false)
        })
    }, [firstYear, lastYear])

    const years = () => {
        let currentDate = new Date().getFullYear()
        let list = []

        for (let index = 2022; index <= currentDate; index++) {
            list.push(`${index}`)
        }
        return list
    }

    const YearsHeader = (count, startYear) => {
        const headers = [];
        let firstYear = startYear

        for (let i = 0; i < count; i++) {
            headers.push(
                <TableCell
                    key={i}
                    colSpan={2}
                    style={{ cursor: 'pointer' }}
                >
                    <Stack direction="row" spacing={1} alignItems="center" justifyContent={"center"}>
                        <Box>{firstYear}</Box>
                    </Stack>
                </TableCell>
            );
            firstYear++
        }

        return headers;
    };

    const handleChangeLastYear = (value) => {
        if (value >= firstYear) {
            setLastYear(value)
        }
    }

    const handleChangeFirstYear = (value) => {
        if (value <= lastYear) {
            setFirstYear(value)
        }
    }

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
                            ListboxProps={{ style: { maxHeight: 150 } }}
                            onChange={(e, value) => { handleChangeFirstYear(value) }}
                            value={`${firstYear}`}
                            renderInput={(params) => <TextField label="Başlangıç Yılı" {...params} />}
                        />
                    </Grid>
                    <Grid item marginBottom={2} marginTop={2} xs={2}>
                        <Autocomplete
                            disableClearable
                            fullWidth
                            id="basic-autocomplete-label"
                            options={years()}
                            ListboxProps={{ style: { maxHeight: 150 } }}
                            value={`${lastYear}`}
                            onChange={(e, value) => { handleChangeLastYear(value) }}
                            renderInput={(params) => <TextField label="Bitiş Yılı" {...params} />}
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
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Box></Box>
                                        </Stack>
                                    </TableCell>
                                    {YearsHeader((lastYear - firstYear) + 1, firstYear)}
                                </TableRow>
                            </TableHead>
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Box></Box>
                                        </Stack>
                                    </TableCell>
                                    {
                                        YearsHeader((lastYear - firstYear) + 1, firstYear).map((itm, x) => {
                                            return (
                                                <React.Fragment key={x}>
                                                    <TableCell
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <Stack direction="row" spacing={1} alignItems="center" justifyContent={"center"}>
                                                            <Box>TOPLAM</Box>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <Stack direction="row" spacing={1} alignItems="center" justifyContent={"center"}>
                                                            <Box>ORTALAMA KUR</Box>
                                                        </Stack>
                                                    </TableCell>
                                                </React.Fragment>
                                            )
                                        })
                                    }
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {
                                    data?.map((item, i) => {
                                        return (
                                            <React.Fragment key={i}>
                                                <TableRow>
                                                    <TableCell>{returnMonthName(item?.month)}</TableCell>
                                                    {
                                                        item?.years.map((year, y) => {
                                                            return (
                                                                <React.Fragment key={y}>
                                                                    <TableCell style={{ textAlign: 'center' }}>{year?.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} TL</TableCell>
                                                                    <TableCell style={{ textAlign: 'center' }}>-</TableCell>
                                                                </React.Fragment>
                                                            )
                                                        })
                                                    }
                                                </TableRow>
                                            </React.Fragment>
                                        )
                                    })
                                }
                                <TableRow>
                                    <TableCell style={{ fontWeight: 'bold' }}>GENEL TOPLAM</TableCell>
                                    {
                                        total?.map((item, i) => {
                                            return (
                                                <React.Fragment key={i}>
                                                    <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>{item?.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} TL</TableCell>
                                                    <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>-</TableCell>
                                                </React.Fragment>
                                            )
                                        })
                                    }
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </MainCard>
        </>

    )
}