import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import Chip from '@mui/material/Chip';
import TaskModal from '../components/TaskModal';
import task from '../functions/apiCalls';
import { toast } from 'react-toastify';
import { dispatchTask, fetchTask } from '../redux/actions/taskAction';
import { useDispatch, useSelector } from 'react-redux';


const priorityColors = {
    urgent: '#f44336',
    critical: '#4caf50',
    low: '#2196f3',
    medium: '#000fff',
    high: '#00ff00'
};

const progressColors = {
    open: '#f44336',
    wip: '#4caf50',
    closed: '#2196f3',
    reviwe: '#000fff',
    reopen: '#00ff00'
};


const Task = () => {


    const dataInStore = useSelector(state => state.task.data);
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [pageSize, setPageSize] = useState(10)
    const [page, setPage] = useState(1);
    const handleOpen = () => setOpen(true);
    const [objId, setObjId] = useState(null)
    const [open, setOpen] = useState(false);



    const handleDelete = async (id) => {


        const res = await task.delete(id);

        console.log(res.data)

        if (res?.status == 200) {
            toast.success(res.data.msg);
            fetchTask().then((res) => dispatch(dispatchTask(res)))
            if (dataInStore.length === 1) window.location.reload();

        }
        if (res?.response?.status == 400) {
            toast.error(res.response.data.msg)
        }


    }


    const handleUpdate = (id) => {
        setOpen(true)
        setObjId(id)
    }

    useEffect(() => {
        if (dataInStore.length) {
            setData(dataInStore)
        }

    }, [dataInStore])

    const columns = [
        {
            flex: 0.3,
            minWidth: 400,
            field: 'title',
            headerName: 'Title',
            renderCell: (params) => {
                return (

                    <Typography noWrap variant='caption' sx={{ fontSize: '16px' }}>
                        {params.row.title}
                    </Typography>

                )
            }
        },
        {
            flex: 0.2,
            minWidth: 300,
            headerName: 'Description',
            field: 'Description',
            renderCell: (params) => {
                return (
                    <Typography noWrap variant='caption' sx={{ fontSize: '16px' }}>
                        {params.row.description}
                    </Typography>
                )
            }
        },
        {
            flex: 0.2,
            minWidth: 70,
            headerName: 'Priority',
            field: 'priority',
            renderCell: (params) => {
                return (
                    <Typography noWrap variant='caption' sx={{ fontSize: '16px', textTransform: 'capitalize' }}>

                        <Chip
                            key={params.row.priority}
                            label={params.row.priority}
                            style={{ backgroundColor: priorityColors[params.row.priority] }}
                        />
                    </Typography>
                )
            }
        },
        {
            flex: 0.2,
            minWidth: 75,
            headerName: 'Status',
            field: 'status',
            renderCell: (params) => {
                return (
                    <Typography noWrap variant='caption' sx={{ fontSize: '16px' }}>
                        <Chip
                            key={params.row.progress}
                            label={params.row.progress}
                            style={{ backgroundColor: progressColors[params.row.progress] }}
                        />
                    </Typography>
                )
            }
        },
        {
            flex: 0.2,
            field: 'edit',
            headerName: 'Edit',
            width: 130,
            renderCell: (params) => (
                <Button variant='outlined' onClick={() => handleUpdate(params.row._id)}>Update</Button>
            ),
        },
        {
            flex: 0.2,
            field: 'delete',
            headerName: 'Delete',
            width: 130,
            renderCell: (params) => (
                <Button variant='outlined' color='error' onClick={() => handleDelete(params.row._id)}>Delete</Button>
            ),
        }

    ]



    return (
        <div>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'

            }}>
                <h1>To Do List</h1>
                <Button
                    color='success'
                    variant='contained'
                    onClick={() => setOpen(true)}>Add tasks</Button>
            </Box>
            {data.length ? <DataGrid
                autoHeight
                pagination
                rows={data}
                columns={columns}
                getRowId={row => row._id}
                pageSizeOptions={[10, 25, 50, 100]}
                pageSize={pageSize}

            /> : <></>}

            <TaskModal open={open} handleOpen={handleOpen} setOpen={setOpen} id={objId} />

        </div>


    )
}

export default Task