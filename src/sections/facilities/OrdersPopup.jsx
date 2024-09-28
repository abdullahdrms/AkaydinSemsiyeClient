/* eslint-disable prettier/prettier */

// material-ui
import { Pagination } from '@mui/material';
import Modal from '@mui/material/Modal';
import Loader from 'components/Loader';

// project imports
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import { CloseCircle } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { GetOrderListAll } from 'services/ordersServices';


export default function OrdersPopup({ open, modalToggler }) {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])

    const [page, setPage] = useState(1);
    const handleChangePage = (event, value) => {
        setPage(value);
    };

    useEffect(() => {
        async function fetchData() {
            await GetOrderListAll({ page: page - 1, size: 10 }).then((res) => {
                setData(res)
                setLoading(false)
            })
        }
        if (open) {
            fetchData()
        }
    }, [open, page])

    const closeModal = () => {
        modalToggler(false);
        // setSelectedStock(undefined)
    }


    if (open && loading) return <Loader open={loading} />

    return (
        <>
            {open && (
                <Modal
                    open={open}
                    onClose={closeModal}
                    aria-labelledby="modal-customer-add-label"
                    aria-describedby="modal-customer-add-description"
                    sx={{ '& .MuiPaper-root:focus': { outline: 'none' } }}
                >
                    <MainCard
                        sx={{ width: `calc(100% - 48px)`, padding: 3, minWidth: 340, maxWidth: "100%", height: 'auto', maxHeight: 'calc(100vh - 48px)' }}
                        modal
                        content={false}
                    >
                        <SimpleBar sx={{ maxHeight: `calc(100vh - 48px)`, '& .simplebar-content': { display: 'flex', flexDirection: 'column' } }}>
                            <div style={{ justifyContent: 'end', display: 'flex', marginBottom: 20 }}>
                                <CloseCircle onClick={() => closeModal()} size={30} style={{ cursor: 'pointer' }} />
                            </div>
                            <div style={{ marginBottom: '36px' }} >
                                <table style={{ width: '100%', borderSpacing: 0, border: '1px solid black' }}>
                                    <thead style={{ width: '100%', textAlign: 'start', borderSpacing: 0 }}>
                                        <tr style={{ borderSpacing: 0 }}>
                                            <th style={{ width: '200px', borderBottom: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">Sipariş No</th>
                                            <th style={{ width: '200px', borderBottom: '1px solid black', borderLeft: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">Sipariş Tarihi</th>
                                            <th style={{ width: '200px', borderBottom: '1px solid black', borderLeft: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">Termin Tarihi</th>
                                            <th style={{ width: '200px', borderBottom: '1px solid black', borderLeft: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">Müşteri</th>
                                            <th style={{ width: '200px', borderBottom: '1px solid black', borderLeft: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">Adres</th>
                                            <th style={{ width: '200px', borderBottom: '1px solid black', borderLeft: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">İletişim</th>
                                            <th style={{ width: '200px', borderBottom: '1px solid black', borderLeft: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col"></th>
                                            <th style={{ width: '200px', borderBottom: '1px solid black', borderLeft: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">Per.</th>
                                            <th style={{ width: '200px', borderBottom: '1px solid black', borderLeft: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">Adet</th>
                                            <th style={{ width: '200px', borderBottom: '1px solid black', borderLeft: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">Ölçü</th>
                                            <th style={{ width: '200px', borderBottom: '1px solid black', borderLeft: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">İşlem</th>
                                            <th style={{ width: '200px', borderBottom: '1px solid black', borderLeft: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">İskelet</th>
                                            <th style={{ width: '200px', borderBottom: '1px solid black', borderLeft: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">Kumaş</th>
                                            <th style={{ width: '200px', borderBottom: '1px solid black', borderLeft: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">İskelet Renk</th>
                                            <th style={{ width: '200px', borderBottom: '1px solid black', borderLeft: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">Baca</th>
                                            <th style={{ width: '200px', borderBottom: '1px solid black', borderLeft: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">Saçak</th>
                                            <th style={{ width: '200px', borderBottom: '1px solid black', borderLeft: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">Baskı</th>
                                            <th style={{ width: '200px', borderBottom: '1px solid black', borderLeft: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">Ayak</th>
                                            <th style={{ width: '200px', borderBottom: '1px solid black', borderLeft: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">Ek Özellik</th>
                                            <th style={{ width: '200px', borderBottom: '1px solid black', borderLeft: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col"></th>
                                            <th style={{ width: '200px', borderBottom: '1px solid black', borderLeft: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">Not</th>
                                            <th style={{ width: '200px', borderBottom: '1px solid black', borderLeft: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">Fiyat</th>
                                            <th style={{ width: '200px', borderBottom: '1px solid black', borderLeft: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">Ödenen</th>
                                            <th style={{ width: '200px', borderBottom: '1px solid black', borderLeft: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">Kalan</th>
                                            {/* <th style={{ width: '200px', borderBottom: '1px solid black', borderLeft: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">Kumaş-Renk</th>
                                                    <th style={{ width: '200px', borderBottom: '1px solid black', borderLeft: '1px solid black', textAlign: 'start', padding: '8px' }} scope="col">İskelet-Renk</th> */}
                                        </tr>
                                    </thead>
                                    <tbody style={{ width: '100%', textAlign: 'start' }}>
                                        {
                                            data?.data?.map((itm, i) => {
                                                return (
                                                    itm?.orderDetails.map((item, x) => {
                                                        return (
                                                            <tr key={x}>
                                                                <td style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid black' }}>#{itm?.orderNumber}</td>
                                                                <td style={{ textAlign: 'center', borderLeft: '1px solid black', padding: '8px', borderBottom: '1px solid black' }}>{itm?.createdAt.toString().split('T')[0]}</td>
                                                                <td style={{ textAlign: 'center', borderLeft: '1px solid black', padding: '8px', borderBottom: '1px solid black' }}>{itm?.deadline.toString().split('T')[0]}</td>
                                                                <td style={{ textAlign: 'center', borderLeft: '1px solid black', padding: '8px', borderBottom: '1px solid black' }}>{itm?.customer?.firstName} {itm?.customer?.lastName}</td>
                                                                <td style={{ textAlign: 'center', borderLeft: '1px solid black', padding: '8px', borderBottom: '1px solid black' }}>{itm?.customerAddress?.address ? itm?.customerAddress?.address : '-'}</td>
                                                                <td style={{ textAlign: 'center', borderLeft: '1px solid black', padding: '8px', borderBottom: '1px solid black' }}>{itm?.customer?.phone}</td>
                                                                <td style={{ textAlign: 'center', borderLeft: '1px solid black', padding: '8px', borderBottom: '1px solid black' }}>{itm?.customer?.customerType === 2 ? 'Bayi' : 'Müş.'}</td>
                                                                <td style={{ textAlign: 'center', borderLeft: '1px solid black', padding: '8px', borderBottom: '1px solid black' }}>{itm?.person?.name} {itm?.person?.surName}</td>
                                                                <td style={{ textAlign: 'center', borderLeft: '1px solid black', padding: '8px', borderBottom: '1px solid black' }}>{item?.qty}</td>
                                                                <td style={{ textAlign: 'center', borderLeft: '1px solid black', padding: '8px', borderBottom: '1px solid black' }}>{item?.width}x{item?.height}</td>
                                                                <td style={{ textAlign: 'center', borderLeft: '1px solid black', padding: '8px', borderBottom: '1px solid black' }}>{item?.process === 1 ? "Kumaş Değişimi" : item?.process === 2 ? "Kumaş Tamiri" : item?.process === 3 ? "İskelet Tamiri" : item?.process === 4 ? "Plaj Şemsiye Siparişi" : item?.process === 5 ? "Yedek Parça Siparişi" : item?.process === 6 ? "Şemsiye Ayağı Siparişi" : item?.process === 7 ? "Özel" : item?.process === 8 ? "Servis Hizmeti" : "-"}</td>
                                                                <td style={{ textAlign: 'center', borderLeft: '1px solid black', padding: '8px', borderBottom: '1px solid black' }}>{item?.product?.name}</td>
                                                                <td style={{ textAlign: 'center', borderLeft: '1px solid black', padding: '8px', borderBottom: '1px solid black' }}>{item?.fabricChart?.colorType} - {item?.fabricChart?.code}</td>
                                                                <td style={{ textAlign: 'center', borderLeft: '1px solid black', padding: '8px', borderBottom: '1px solid black' }}>{item?.skeletonChart?.name ? item?.skeletonChart?.name : '-'}</td>
                                                                <td style={{ textAlign: 'center', borderLeft: '1px solid black', padding: '8px', borderBottom: '1px solid black' }}>{item?.flue === 1 ? "-" : item?.flue === 2 ? "Bacalı" : item?.flue === 3 ? "Havalandırmalı" : "-"}</td>
                                                                <td style={{ textAlign: 'center', borderLeft: '1px solid black', padding: '8px', borderBottom: '1px solid black' }}>{item?.fringe === 1 ? "-" : item?.fringe === 2 ? "Var" : "-"}</td>
                                                                <td style={{ textAlign: 'center', borderLeft: '1px solid black', padding: '8px', borderBottom: '1px solid black' }}>{item?.print === 1 ? "-" : item?.print === 2 ? item?.printText : "-"}</td>
                                                                <td style={{ textAlign: 'center', borderLeft: '1px solid black', padding: '8px', borderBottom: '1px solid black' }}>{item?.standType === 1 ? "Ayaksız" : item?.standType === 2 ? "Mermer" : item?.standType === 3 ? "Flanş" : item?.standType === 4 ? "Beton" : item?.standType === 6 ? "Bidon" : item?.standType === 7 ? "Yere Montaj" : item?.standType === 8 ? "MermereMontaj" : item?.standType === 9 ? "Özel" : "-"}</td>
                                                                <td style={{ textAlign: 'center', borderLeft: '1px solid black', padding: '8px', borderBottom: '1px solid black' }}>{item?.electric === 2 && 'Elektrik'} {item?.engine === 2 && 'Motor'} {item?.led === 2 && 'Led'} {item?.heater === 2 && 'Isıtıcı'}</td>
                                                                <td style={{ textAlign: 'center', borderLeft: '1px solid black', padding: '8px', borderBottom: '1px solid black' }}>{item?.stockFabricQty > 0 ? 'Kumaş Stok' : 'Kumaş Üretim'} {item?.stockSkeletonQty > 0 ? 'İskelet Stok' : 'İskelet Üretim'} {item?.stockStandQty > 0 ? 'Ayak Stok' : 'Ayak Üretim'}</td>
                                                                <td style={{ textAlign: 'center', borderLeft: '1px solid black', padding: '8px', borderBottom: '1px solid black' }}>{item?.orderDetailNote ? item?.orderDetailNote : '-'}</td>
                                                                <td style={{ textAlign: 'center', borderLeft: '1px solid black', padding: '8px', borderBottom: '1px solid black' }}>{item?.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} TL</td>
                                                                {
                                                                    x === 0 &&
                                                                    <td rowSpan={itm?.orderDetails.length > 1 ? itm?.orderDetails.length : 1} style={{ textAlign: 'center', borderLeft: '1px solid black', padding: '8px', borderBottom: '1px solid black' }}>{itm?.payment.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} TL</td>
                                                                }
                                                                {
                                                                    x === 0 &&
                                                                    <td rowSpan={itm?.orderDetails.length > 1 ? itm?.orderDetails.length : 1} style={{ textAlign: 'center', borderLeft: '1px solid black', padding: '8px', borderBottom: '1px solid black' }}>{itm?.remainingPayment.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} TL</td>
                                                                }
                                                            </tr>
                                                        )
                                                    }))

                                            })
                                        }

                                    </tbody>
                                </table>
                                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                                    <Pagination page={page} onChange={handleChangePage} variant="outlined" color='primary' count={Math.ceil(data?.totalCount / 10)} />
                                </div>
                            </div>

                        </SimpleBar>
                    </MainCard>
                </Modal>
            )}
        </>
    );
}


