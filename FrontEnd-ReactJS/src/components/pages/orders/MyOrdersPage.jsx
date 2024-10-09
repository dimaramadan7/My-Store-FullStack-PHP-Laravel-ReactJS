import React, { useEffect, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import styles from '../home/home.module.scss'
import Loading from '../../shared/Loading';
import { useContext } from 'react';
import { AppContext } from '../../layout/Layout';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Table from 'react-bootstrap/Table';
import Buttonb from 'react-bootstrap/Button';
import Modalb from 'react-bootstrap/Modal';
import axios from 'axios';
import Api from '../../../tools/api';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


export default function MyOrdersPage() {

    // init app state
    const appContext = useContext(AppContext)
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [openUpdate, setOpenUpdate] = React.useState(false);
    const handleOpenUpdate = (item) => {
        setOpenUpdate(true);
        setFormData(item);
    }
    const handleCloseUpdate = () => setOpenUpdate(false);
    const [order, setorder] = useState([])
    const [user, setuser] = useState([])
    const [formData, setFormData] = useState({
        user_id: '',
        total: '',
        date: null,
    });

    useEffect(() => {
        getUser();
        getorder();
    }, [])

    const getUser = async () => {
        const response = await Api.fetch({ url: 'users' })
        console.log(response);
        if (response != null)
            setuser(response.data)
    }
    const getorder = async () => {
        const response = await Api.fetch({ url: 'order' })
        console.log(response);
        if (response != null)
            setorder(response.data) 
    }
    const addOrder = async () => {
        console.log(formData);
        try {
            
            // const response = await Api.fetch({
            //     url: 'order', 
            //     body: formDataToSend, // Use 'body' directly without converting to JSON
            //     method: 'POST',
            //     showPopup: appContext.showPopup,
            // });
            const response = await fetch('http://127.0.0.1:8000/api/order', {
                method: 'POST',
                body: formData
            });
            if (response != null) {
                // show message
                appContext.showPopup(response.message)
            }

            console.log('order added successfully:', response);
        } catch (error) {
            if (error.response && error.response.status === 422) {
                // Handle validation errors
                console.error('Validation errors:', error.response.data.errors);
            } else {
                console.error('Error occurred while adding the order:', error.message);
            }
        }
        setFormData({});
        handleClose();
        getorder();
    };

    const updateOrder = async () => {
        console.log(formData); // يتم طباعة قيمة formData في وحدة التحكم أو الطرفية
    
        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/updateOrder`, formData);
            console.log('order successfully updated:', response.data); // يتم طباعة البيانات المستلمة بنجاح في حالة الاستجابة الناجحة
    
        } catch (error) {
            if (error.response && error.response.status === 422) {
                // إذا كان هناك أخطاء التحقق من الصحة، يتم التعامل معها هنا
                console.error('Validation errors:', error.response.data.errors);
            } else {
                // إذا حدث خطأ آخر، يتم التعامل معه هنا
                console.error('An error occurred while updating the order:', error.message);
            }
        }
    
        setFormData({}); // يتم إعادة تعيين قيمة formData إلى كائن فارغ
        handleCloseUpdate(); // يتم إغلاق العنصر المحدث
        getorder(); // يتم استدعاء الدالة getorder() لتحديث البيانات
    };



    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/api/order/${formData.id}`);
            console.log('The order has been deleted successfully:', response.data);
            // هنا يمكنك إعادة تحميل البيانات بعد الحذف إذا كنت بحاجة إلى تحديث الواجهة
            getorder();
        } catch (error) {
            console.error('An error occurred while deleting the order:', error.message);
        }
        setFormData({});
        handleCloseDelete();
    };


    const [show, setShow] = useState(false);

    const handleCloseDelete = () => setShow(false);
    const handleShow = (item) => {
        setShow(true);
        setFormData(item);
    };

    return (
        <>
            <div>
                <Button onClick={handleOpen}>create order</Button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style} >
                        <Typography id="modal-modal-title" variant="h6" component="h2" dir='rtl'>
                            Add a order
                        </Typography>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <i className="bx bxs-time-five bx_user"></i>
                            </div>
                            <select id="user_id" name="user_id" className="form-control" value={formData.user_id}
                                onChange={(e) => setFormData({ ...formData, user_id: e.target.value })} >
                                <option>Select category</option>
                                {user.map((item, index) => (
                                    <option key={index} value={item.id}>{item.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <i className="bx bxs-time-five bx_user"></i>
                            </div>
                            <input
                                type="text"
                                name="total"
                                className="form-control"
                                placeholder="order total"
                                value={formData.total}
                                onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                            />
                        </div>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <i className="bx bxs-time-five bx_user"></i>
                            </div>
                            <input
                                type="date"
                                name="date"
                                className="form-control"
                                placeholder="order date"
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <Button className={styles.Button} variant="contained" onClick={addOrder}>save</Button>
                    </Box>
                </Modal>
            </div>
            <ListGroup className={styles.order} horizontal>

                <Table striped="columns" >
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>user_id</th>
                            <th>total</th>
                            <th>date</th>
                            <th>action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(order == null || order.length === 0) ?
                            <Loading />
                            :
                            order.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item && item.user_id}</td>
                                    <td>{item && item.total}</td>
                                    <td>
                                        {item && item.date}
                                    </td>
                                    <td>
                                        <Buttonb variant="danger" onClick={() => handleShow(item)}>
                                            Delete
                                        </Buttonb>
                                        <Buttonb variant="primary" onClick={() => handleOpenUpdate(item)}>
                                            Edit
                                        </Buttonb>
                                    </td>
                                </tr>
                            ))}
                    </tbody>

                    <Modalb show={show} onHide={handleCloseDelete} dir='rtl'>
                        <Modalb.Header closeButton>
                            <Modalb.Title>Delete item</Modalb.Title>
                        </Modalb.Header>
                        <Modalb.Body>Do you want to delete the item?</Modalb.Body>
                        <Modalb.Footer>
                            <Buttonb variant="secondary" onClick={handleCloseDelete}>
                                Close
                            </Buttonb>
                            <Buttonb variant="danger" onClick={handleDelete}>
                                Delete
                            </Buttonb>
                        </Modalb.Footer>
                    </Modalb>
                    <Modal
                        open={openUpdate}
                        onClose={handleCloseUpdate}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style} >
                            <Typography id="modal-modal-title" variant="h6" component="h2" dir='rtl'>
                                Edit order
                            </Typography>
                            <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <i className="bx bxs-time-five bx_user"></i>
                            </div>
                            <select id="user_id" name="user_id" className="form-control" value={formData.user_id}
                                onChange={(e) => setFormData({ ...formData, user_id: e.target.value })} >
                                <option>Select category</option>
                                {user.map((item, index) => (
                                    <option key={index} value={item.id}>{item.name}</option>
                                ))}
                            </select>
                        </div>
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <i className="bx bxs-time-five bx_user"></i>
                                </div>
                                <input
                                    type="text"
                                    name="total"
                                    className="form-control"
                                    placeholder="order total"
                                    value={formData.total}
                                    onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                                />
                            </div>
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <i className="bx bxs-time-five bx_user"></i>
                                </div>
                                <input
                                    type="date"
                                    name="date"
                                    className="form-control"
                                    placeholder="order date"
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                            <Button className={styles.Button} variant="contained" onClick={updateOrder}>update</Button>
                        </Box>
                    </Modal>
                </Table>

            </ListGroup>
        </>
    );
}