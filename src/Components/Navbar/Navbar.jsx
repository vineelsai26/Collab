import React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import Modal from '@mui/material/Modal'
import { FormControlLabel, Input, OutlinedInput, Switch } from '@mui/material'

const settings = ['Profile', 'Logout']

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
}

const Navbar = ({ user, page, handleSave, handleEmailChange, emailList, handleTitleChange, title, publicAccess, setPublicAccess }) => {
    const [anchorElUser, setAnchorElUser] = React.useState(null)

    const [open, setOpen] = React.useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget)
    }

    const handleCloseUserMenu = (event) => {
        if (event.target.childNodes[0] && event.target.childNodes[0].nodeValue === 'Profile') {
            window.location.href = '/profile'
        } else if (event.target.childNodes[0] && event.target.childNodes[0].nodeValue === 'Logout') {
            window.location.href = '/logout'
        } else {
            setAnchorElUser(null)
        }
    }

    const handleCheckChange = (event) => {
        setPublicAccess(event.target.checked)
    }

    return (
        <AppBar position="static">
            <Container>
                <Toolbar disableGutters sx={{ display: "flex", flexDirection: 'row', justifyContent: "space-between" }}>
                    <Typography
                        variant="h6"
                        noWrap
                        onClick={() => window.location.href = '/'}
                        component="div"
                        sx={{ mr: 2, display: { xs: 'none', md: 'flex' }, cursor: 'pointer' }}
                    >
                        COLLAB
                    </Typography>
                    <Box sx={{ display: 'flex' }}>
                        {page === 'docs' && (
                            <>
                                <OutlinedInput value={title} onChange={handleTitleChange} color="success" sx={{ mr: 1, color: 'white' }} />
                                <Button onClick={handleOpen} variant='outlined' color="inherit" sx={{ mr: 1 }}>Share</Button>
                                <Button onClick={handleSave} variant='outlined' color="inherit" sx={{ mr: 1 }}>Save</Button>
                            </>
                        )}

                        <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={style}>
                                <Typography
                                    id="modal-modal-title"
                                    variant="h6"
                                    component="h2"
                                >
                                    Share
                                </Typography>
                                <OutlinedInput
                                    value={emailList}
                                    onChange={handleEmailChange}
                                    sx={{ margin: '20px', width: '100%', marginLeft: '0px' }}
                                    type="text"
                                    placeholder="Enter emails Seperated by comma"
                                />
                                <FormControlLabel
                                    control={<Switch defaultChecked={publicAccess} onChange={handleCheckChange} />}
                                    label={publicAccess ? "Public" : "Private"}
                                    labelPlacement="start"
                                />
                                <Button
                                    onClick={() => { handleSave(); handleClose() }}
                                    variant="contained"
                                    color="primary"
                                    sx={{ margin: '20px', width: '100%', marginLeft: '0px' }}
                                >
                                    Share
                                </Button>
                            </Box>
                        </Modal>

                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="User" src={user.profileObj.imageUrl} />
                            </IconButton>
                        </Tooltip>
                        <Box sx={{ flexGrow: 0 }}>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center">{setting}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}
export default Navbar
