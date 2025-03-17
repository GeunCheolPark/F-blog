import React from 'react';
import { Link } from 'react-router-dom';
import {
  Drawer, List, ListItem, ListItemIcon, ListItemText,
  Divider, Box, IconButton, InputBase, Paper
} from '@mui/material';
import {
  Home as HomeIcon,
  Create as CreateIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
  Close as CloseIcon
} from '@mui/icons-material';

function MobileMenu({ open, onClose, isLoggedIn, onLogout, searchQuery, setSearchQuery, handleSearch }) {
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ width: 280, pt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2 }}>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Box component="form" onSubmit={(e) => { handleSearch(e); onClose(); }} sx={{ px: 2, pb: 2 }}>
          <Paper
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="검색어를 입력하세요..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <IconButton type="submit" sx={{ p: '10px' }}>
              <SearchIcon />
            </IconButton>
          </Paper>
        </Box>
        
        <Divider />
        
        <List>
          <ListItem button component={Link} to="/" onClick={onClose}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="홈" />
          </ListItem>
          
          {isLoggedIn ? (
            <>
              <ListItem button component={Link} to="/write" onClick={onClose}>
                <ListItemIcon>
                  <CreateIcon />
                </ListItemIcon>
                <ListItemText primary="글쓰기" />
              </ListItem>
              
              <ListItem button onClick={() => { onLogout(); onClose(); }}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="로그아웃" />
              </ListItem>
            </>
          ) : (
            <ListItem button component={Link} to="/login" onClick={onClose}>
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="GitHub 로그인" />
            </ListItem>
          )}
        </List>
      </Box>
    </Drawer>
  );
}

export default MobileMenu;