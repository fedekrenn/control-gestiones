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
import { AuthContext } from '../../context/authContext.jsx'
// Icons
import MenuIcon from '@mui/icons-material/Menu'
// Assets
import icon from '../../assets/logo-track360.png'
import picProfile from '../../assets/profile.svg'

const PAGES = [
  { name: 'Nuevo asesor', link: '/nuevo-asesor', isProtected: true },
  { name: 'Nueva gestión', link: '/nuevo-caso', isProtected: true },
  { name: 'Listado de gestiones', link: '/listado-gestiones', isProtected: false }
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
    <AppBar position="static" color="primary">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link to="/">
            <img className="img-logo" src={icon} alt="Logo de la empresa" />
          </Link>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
              justifyContent: 'right'
            }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              onClick={handleOpenNavMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              keepMounted
              id="menu-appbar"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              open={Boolean(anchorElNav)}
              anchorEl={anchorElNav}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {PAGES.map(({ name, link, isProtected }) => {
                const isAbleToRender = (isProtected && user) || !isProtected
                return isAbleToRender && (
                  <MenuItem key={name} onClick={handleCloseNavMenu}>
                    <Link to={link}>
                      <Typography textAlign="center">{name}</Typography>
                    </Link>
                  </MenuItem>
                )
              })}
            </Menu>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'none', md: 'flex' },
              mr: '20px',
              justifyContent: 'right'
            }}
          >
            {PAGES.map(({ name, link, isProtected }) => {
              const isAbleToRender = (isProtected && user) || !isProtected
              return isAbleToRender && (
                <Link to={link} key={name}>
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    {name}
                  </Button>
                </Link>
              )
            })}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <img
                  src={picProfile}
                  alt="Foto de perfil"
                  className="img-profile"
                />
              </IconButton>
            </Tooltip>
            <Menu
              keepMounted
              id="menu-appbar"
              sx={{ mt: '45px' }}
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={handleCloseUserMenu}>
                {user
                  ? (
                  <Typography textAlign="center" onClick={handleSignOut}>
                    Cerrar Sesión
                  </Typography>
                    )
                  : (
                  <Link to="/login">
                    <Typography textAlign="center">Iniciar Sesión</Typography>
                  </Link>
                    )}
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
