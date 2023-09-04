import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
// Libraries
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  Tooltip,
  MenuItem
} from '@mui/material'
// Firebase
import { auth } from '../../config/firebaseConfig'
import { signOut } from 'firebase/auth'
// Context
import { AuthContext } from '../../context/authContext'
// Icons
import MenuIcon from '@mui/icons-material/Menu'
// Assets
import icon from '../../assets/logo-startek.png'
import picProfile from '../../assets/profile.svg'

const PAGES = [
  { name: 'Nuevo asesor', link: '/nuevo-asesor' },
  { name: 'Nueva gestión', link: '/nuevo-caso' },
  { name: 'Gestiones', link: '/listado-casos' }
]

export default function Header() {
  const [anchorElNav, setAnchorElNav] = useState(null)
  const [anchorElUser, setAnchorElUser] = useState(null)

  const { user } = useContext(AuthContext)

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget)
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget)
  const handleCloseNavMenu = () => setAnchorElNav(null)
  const handleCloseUserMenu = () => setAnchorElUser(null)

  const handleSignOut = () => {
    handleCloseUserMenu()

    setTimeout(() => {
      signOut(auth)
    }, 500)
  }

  return (
    <AppBar position='static' color='primary'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <Link to='/'>
            <img className='img-logo' src={icon} alt='Logo de la empresa' />
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              color='inherit'
              onClick={handleOpenNavMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              keepMounted
              id='menu-appbar'
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              open={Boolean(anchorElNav)}
              anchorEl={anchorElNav}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {user &&
                PAGES.map(page => (
                  <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                    <Link to={page.link}>
                      <Typography textAlign='center'>{page.name}</Typography>
                    </Link>
                  </MenuItem>
                ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {user &&
              PAGES.map(page => (
                <Link to={page.link} key={page.name}>
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    {page.name}
                  </Button>
                </Link>
              ))}
          </Box>
          {user && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title='Open settings'>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <img
                    src={picProfile}
                    alt='Foto de perfil'
                    className='img-profile'
                  />
                </IconButton>
              </Tooltip>
              <Menu
                keepMounted
                id='menu-appbar'
                sx={{ mt: '45px' }}
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography textAlign='center' onClick={handleSignOut}>
                    Cerrar Sesión
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  )
}
