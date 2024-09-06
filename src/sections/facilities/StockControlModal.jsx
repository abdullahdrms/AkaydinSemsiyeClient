/* eslint-disable prettier/prettier */

// material-ui
import Modal from '@mui/material/Modal';

// project imports
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import StockControlForm from './StockControlForm';


export default function StockControlModal({ open, modalToggler, setSelectedStock, stockData, formDt, update, productId, qty }) {

    const closeModal = () => {
        modalToggler(false);
        // setSelectedStock(undefined)
    }

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
                        sx={{ width: `calc(100% - 48px)`, minWidth: 340, maxWidth: 880, height: 'auto', maxHeight: 'calc(100vh - 48px)' }}
                        modal
                        content={false}
                    >
                        <SimpleBar sx={{ maxHeight: `calc(100vh - 48px)`, '& .simplebar-content': { display: 'flex', flexDirection: 'column' } }}>
                            <StockControlForm qty={qty} formDt={formDt} productId={productId} stockData={stockData} setSelectedStock={setSelectedStock} closeModal={closeModal} update={update} />
                        </SimpleBar>
                    </MainCard>
                </Modal>
            )}
        </>
    );
}


