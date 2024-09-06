/* eslint-disable prettier/prettier */

// material-ui
import { Button } from '@mui/material';
import Modal from '@mui/material/Modal';

// project imports
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import { productKeyToName } from 'utils/productKeyToName';


export default function ErrorModal({ open, modalToggler, errors }) {

    const errorArray = Object.entries(errors)

    const closeModal = () => {
        modalToggler(false);
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
                        sx={{ width: `calc(100% - 48px)`, minWidth: 240, maxWidth: 580, height: 'auto', maxHeight: 'calc(100vh - 48px)', padding: '30px' }}
                        modal
                        content={false}
                    >
                        <SimpleBar sx={{ maxHeight: `calc(100vh - 48px)`, '& .simplebar-content': { display: 'flex', flexDirection: 'column' } }}>
                            {
                                errorArray?.map((item, i) => {
                                    return (
                                        <div style={{color: '#DC2626',fontSize: '15px',fontWeight :'bold'}} key={i}>
                                            * {productKeyToName(item[0])} Zorunlu
                                        </div>
                                    )
                                })
                            }
                            <Button style={{ marginTop: '20px' }} onClick={() => modalToggler()} type="submit" variant="contained">
                                TAMAM
                            </Button>
                        </SimpleBar>
                    </MainCard>
                </Modal>
            )}
        </>
    );
}


