import React, { useEffect } from 'react'
import * as yup from 'yup'
import { useFormik, Field, FormikProvider } from 'formik'
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    InputLabel,
    OutlinedInput,
    MenuItem,
    Modal,
    Select

} from '@mui/material';
import { toast } from 'react-toastify';
import task from '../functions/apiCalls';
import { dispatchTask, fetchTask } from '../redux/actions/taskAction';
import { useDispatch, useSelector } from 'react-redux';


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


const taskPriority = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent',
    CRITICAL: 'critical'

};

const taskProgress = {
    OPEN: 'open',
    WIP: 'wip',
    CLOSED: 'closed',
    REVIEW: 'review',
    REOPEN: 'reopen'
}

const schema = yup.object().shape({

    title: yup.string().min(3, 'Task shold have atlesat 3 words').required('This field is required'),
    description: yup.string(),
    priority: yup.mixed()
        .oneOf(Object.values(taskPriority), 'Invalid task priority')
        .required('Task priority is required'),
    status: yup.mixed()
        .oneOf(Object.values(taskProgress), 'Invalid task priority')
        .required('Task priority is required')
})

const TaskModal = ({ open, setOpen, id }) => {

    const handleClose = () => setOpen(false);
    const dispatch = useDispatch();
    const data = useSelector(state => state.task.data);

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            status: '',
            priority: '',
        },

        validationSchema: schema,
        onSubmit: (values) => {

            handleAddTask(values)


        }
    });
    useEffect(() => {
        if (id) {
            let selected = data.filter((val) => (val._id == id));

            formik.setValues({ ...selected[0], status: selected[0].progress })
        }
    }, [id])


    const handleAddTask = async (values) => {

        const res = await task.create(values);

        if (res?.status == 200) {
            toast.success(res.data.msg);
            fetchTask().then((res) => dispatch(dispatchTask(res)))
            setOpen(false);
        }

        if (res?.response?.status == 400) {
            toast.error(res.response.data.msg)
        }

        formik.resetForm();

    }

    const handleUpdateTask = async (e) => {

        e.preventDefault();

        const res = await task.update(id, formik.values);

        if (res?.status == 200) {
            toast.success(res.data.msg);
            fetchTask().then((res) => dispatch(dispatchTask(res)))
            setOpen(false);
        }
        if (res?.response?.status == 400) {
            toast.error(res.response.data.msg)
        }

        formik.resetForm();

    }

    const handleInputChange = (event) => {
        const { id, value, checked } = event.target;
        const newValue = event.target.type === 'checkbox' ? checked : value;
        formik.setFieldValue(id, newValue);
    };

    const handleSelect = (event, setFieldValue) => {
        const { value, name, checked } = event.target;
        const newValue = event.target.type === 'checkbox' ? checked : value;
        setFieldValue(name, newValue);
    };


    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <h2>Add Task</h2>
                <FormikProvider value={formik}>
                    <form
                        noValidate
                        autoComplete='off'
                        onSubmit={id === null ? formik.handleSubmit : handleUpdateTask}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',

                        }}
                    >
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel htmlFor='title' sx={{ color: '#2A3A51' }}>
                                Title*
                            </InputLabel>
                            <OutlinedInput
                                sx={{ height: '60px', color: 'rgba(27, 11, 43, 0.79)', fontSize: '17px' }}
                                autoFocus
                                label='Title'
                                id='title'
                                className='form'
                                placeholder='Enter Task'
                                value={formik.values.title}
                                fullWidth
                                onBlur={formik.handleBlur}
                                onChange={(e) => handleInputChange(e, formik.setFieldValue)}
                            />
                            {formik.errors.title && formik.touched.title && (
                                <FormHelperText sx={{ color: 'error.main', fontSize: '15px !important', marginLeft: '2px!important' }}>
                                    {formik.errors.title}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel htmlFor='description' sx={{ color: '#2A3A51' }}>
                                Description
                            </InputLabel>
                            <OutlinedInput
                                sx={{ height: '60px', color: 'rgba(27, 11, 43, 0.79)', fontSize: '17px' }}
                                autoFocus
                                label='description'
                                id='description'
                                placeholder='Enter Description'
                                value={formik.values.description}
                                fullWidth
                                onBlur={formik.handleBlur}
                                onChange={(e) => handleInputChange(e, formik.setFieldValue)}
                            />
                            {formik.errors.description && formik.touched.description && (
                                <FormHelperText sx={{ color: 'error.main', fontSize: '15px !important', marginLeft: '2px!important' }}>
                                    {formik.errors.description}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel htmlFor='priority' sx={{ color: '#2A3A51' }}>
                                Priority*
                            </InputLabel>
                            <Field name="priority"
                                type="text" as={Select}
                                id="priority"
                                label="priority"

                                onChange={(e) => handleSelect(e, formik.setFieldValue)}>
                                {Object.values(taskPriority).map((value) => (
                                    <MenuItem key={value} value={value}>
                                        {value}
                                    </MenuItem>
                                ))}
                            </Field>
                            {formik.errors.priority && formik.touched.priority && (
                                <FormHelperText sx={{ color: 'error.main', fontSize: '15px !important', marginLeft: '2px!important' }}>
                                    {formik.errors.priority}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel htmlFor='status' sx={{ color: '#2A3A51' }}>
                                Status*
                            </InputLabel>
                            <Field name="status"
                                type="text" as={Select}
                                id="status"
                                label="status"

                                onChange={(e) => handleSelect(e, formik.setFieldValue)}>
                                {Object.values(taskProgress).map((value) => (
                                    <MenuItem key={value} value={value}>
                                        {value}
                                    </MenuItem>
                                ))}
                            </Field>
                            {formik.errors.status && formik.touched.status && (
                                <FormHelperText sx={{ color: 'error.main', fontSize: '15px !important', marginLeft: '2px!important' }}>
                                    {formik.errors.status}
                                </FormHelperText>
                            )}
                        </FormControl>
                        {id === null ? <Button
                            size='large'
                            type='submit'
                            variant='contained'
                            sx={{
                                textTransform: 'capitalize',
                                width: '140.21px !important',
                                height: '60px',
                                padding: '10px !important',
                                marginTop: '16px',
                                borderRadius: '9px',
                                fontSize: '16px'
                            }}
                        >
                            Add
                        </Button> : <Button
                            size='large'
                            type='submit'
                            variant='contained'
                            // onClick={()=> handleUpdateTask()}
                            sx={{
                                textTransform: 'capitalize',
                                width: '140.21px !important',
                                height: '60px',
                                padding: '10px !important',
                                marginTop: '16px',
                                borderRadius: '9px',
                                fontSize: '16px'
                            }}
                        >
                            update
                        </Button>}
                    </form>
                </FormikProvider>
            </Box>
        </Modal>
    )
}

export default TaskModal
