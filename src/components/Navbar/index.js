import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { MdSpaceDashboard, MdDelete } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { AiFillHome } from "react-icons/ai";
import { userLogout } from "./../../reducers/Login";
import "./style.css";

const MySwal = withReactContent(Swal);

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const state = useSelector((state) => {
    return {
      token: state.Login.token,
      role: state.Login.role,
      user: state.Login.user,
    };
  });

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const signout = async () => {
    dispatch(userLogout({ role: "", token: "", user: null }));
    await axios.get(`${process.env.REACT_APP_BASE_URL}/logout`);
    navigate("/login");
  };

  const deleteAccount = async () => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      iconColor: "#D11A2A",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#D11A2A",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`${process.env.REACT_APP_BASE_URL}/deleteAccount`, {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
        MySwal.fire({
          title: "Deleted!",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#E07A5F",
        });
        signout();
        navigate("/");
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        MySwal.fire({
          title: "Cancelled",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#E07A5F",
        });
      }
    });
  };

  return (
    <AppBar position="static" style={{ background: "#81B29A" }}>
      <Container maxWidth="xl">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
          >
            Social Media
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon style={{ color: "white" }} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              <MenuItem onClick={handleCloseNavMenu}>
                <Typography textAlign="center">
                  <AiFillHome
                    className="navbarIcon"
                    onClick={() => navigate("/")}
                  />
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          >
            Social Media
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              <AiFillHome
                className="navbarIcon"
                onClick={() => navigate("/")}
              />
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt={`${state.user.username} avatar`}
                  src={`${state.user.avatar}`}
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {state.role === "admin" && (
                <MenuItem onClick={() => navigate(`/dashboard`)}>
                  <Typography textAlign="center">
                    <MdSpaceDashboard /> Dashboard
                  </Typography>
                </MenuItem>
              )}
              <MenuItem onClick={signout}>
                <Typography textAlign="center">
                  <BiLogOut /> Signout
                </Typography>
              </MenuItem>
              <MenuItem onClick={deleteAccount}>
                <Typography textAlign="center">
                  <MdDelete /> Delete My Account
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
