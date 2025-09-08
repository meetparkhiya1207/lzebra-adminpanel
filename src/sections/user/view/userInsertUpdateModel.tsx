import React from 'react'

import { Grid, TextField, FormControl } from '@mui/material'


const UserInsertUpdateModel = () => (
    <FormControl>
        <Grid container spacing={2}>
            <Grid size={6}>
                <TextField id="outlined-basic" label="Product Name" variant="outlined" sx={{ width: '100%' }} />
            </Grid>
            <Grid size={6}>
                <TextField id="outlined-basic" label="Category" variant="outlined" sx={{ width: '100%' }} />
            </Grid>
        </Grid>
    </FormControl>
)
export default UserInsertUpdateModel
