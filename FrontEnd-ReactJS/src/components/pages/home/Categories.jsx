import React, { useEffect, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import styles from './home.module.scss'
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
export default function Categories({ category }) {

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
    const [categories, setCategories] = useState([])
    const [formData, setFormData] = useState({
        name: '',
        desc: '',
        image: null, 
    });

    useEffect(() => {
        getCategories();
    }, [])

    const getCategories = async () => {
        // call API                        
        const response = await Api.fetch({ url: 'categories' })
        // console.log(response);
        // check response
        if (response != null)
            setCategories(response.data) // update state with recevied categories
    }
    const addCategory = async () => {
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('desc', formData.desc);
            formDataToSend.append('image', formData.image);
    
            // const response = await Api.fetch({
            //     url: 'categories', 
            //     body: formDataToSend, // Use 'body' directly without converting to JSON
            //     method: 'POST',
            //     showPopup: appContext.showPopup,
            // });
            const response = await fetch('http://127.0.0.1:8000/api/categories', {
                method: 'POST',
                body: formDataToSend
            });
            if (response != null) {
                // show message
                appContext.showPopup(response.message)
            }
            
            console.log('Category added successfully:', response);
        } catch (error) {
            if (error.response && error.response.status === 422) {
                // Handle validation errors
                console.error('Validation errors:', error.response.data.errors);
            } else {
                console.error('Error occurred while adding the category:', error.message);
            }
        }
        setFormData({});
        handleClose();
        getCategories();
    };
    
    const updateCategory = async () => {
        console.log(formData);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('id', formData.id);
            formDataToSend.append('name', formData.name);
            formDataToSend.append('desc', formData.desc);
            formDataToSend.append('image', formData.image);

            const response = await axios.post(`http://127.0.0.1:8000/api/updateCategories`, formDataToSend);
            console.log('Category successfully updated:', response.data);
        } catch (error) {
            if (error.response && error.response.status === 422) {
                // Handle validation errors
                console.error('Validation errors:', error.response.data.errors);
            } else {
                console.error('An error occurred while updating the category:', error.message);
            }
        }
        setFormData({});
        handleCloseUpdate();
        getCategories();
    };



    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/api/categories/${formData.id}`);
            console.log('The category has been deleted successfully:', response.data);
            // هنا يمكنك إعادة تحميل البيانات بعد الحذف إذا كنت بحاجة إلى تحديث الواجهة
            getCategories();
        } catch (error) {
            console.error('An error occurred while deleting the category:', error.message);
        }
        setFormData({});
        handleCloseDelete();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file.size > 20480 * 1024) {
            alert('The selected file is too large. Please choose a file smaller than 2048 kilobytes.');
            e.target.value = null;
        } else {
            // File size is within the limit, update the state
            setFormData({ ...formData, image: file });
        }

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
                <Button onClick={handleOpen}>create categories</Button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style} >
                        <Typography id="modal-modal-title" variant="h6" component="h2" dir='rtl'>
                            Add a category
                        </Typography>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <i class='bx bxs-user bx_user'></i>
                            </div>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                placeholder="category name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <i className="bx bxs-time-five bx_user"></i>
                            </div>
                            <input
                                type="text"
                                name="desc"
                                className="form-control"
                                placeholder="category desc"
                                value={formData.desc}
                                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                            />
                        </div>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <i className="bx bxs-time-five bx_user"></i>
                            </div>
                            <input
                                type="file"
                                name="image"
                                className="form-control"
                                placeholder="category image"
                                onChange={handleFileChange}
                            />
                        </div>
                        <Button className={styles.Button} variant="contained" onClick={addCategory}>save</Button>
                    </Box>
                </Modal>
            </div>
            <ListGroup className={styles.categories} horizontal>

                <Table striped="columns" >
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>image</th>
                            <th>action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(categories == null || categories.length === 0) ?
                            <Loading />
                            :
                            categories.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item && item.name}</td>
                                    <td>{item && item.desc}</td>
                                    <td>
                                        {item && item.image && <img src={`data:image/png;base64,${item.image}`} alt="Category Image" width={100} />}
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
                                Edit category
                            </Typography>
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <i class='bx bxs-user bx_user'></i>
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    placeholder="category name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <i className="bx bxs-time-five bx_user"></i>
                                </div>
                                <input
                                    type="text"
                                    name="desc"
                                    className="form-control"
                                    placeholder="category desc"
                                    value={formData.desc}
                                    onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                                />
                            </div>
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <i className="bx bxs-time-five bx_user"></i>
                                </div>
                                <input
                                    type="file"
                                    name="image"
                                    className="form-control"
                                    placeholder="category image"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <Button className={styles.Button} variant="contained" onClick={updateCategory}>update</Button>
                        </Box>
                    </Modal>
                </Table>

            </ListGroup>

        </>
    );
}