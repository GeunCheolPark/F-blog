import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  AppBar, Toolbar, Typography, Button, Box, Avatar,
  InputBase, Paper, IconButton, useTheme, useMediaQuery,
  Container, Slide, Fab, Tooltip, Zoom
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Menu as MenuIcon,
  GitHub as GitHubIcon,
  ArrowUpward as ArrowUpwardIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext.jsx';
import MobileMenu from './MobileMenu.jsx';

function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // 스크롤 이벤트 감지
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
      
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <AppBar 
        position="sticky" 
        color="primary" 
        elevation={scrolled ? 4 : 0}
        sx={{
          backgroundColor: scrolled ? 'primary.main' : 'primary.main',
          transition: 'all 0.3s ease'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            {isMobile && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={() => setMobileMenuOpen(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                fontWeight: 700,
                letterSpacing: '.5px',
                flexGrow: 1,
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <GitHubIcon sx={{ mr: 1 }} />
              내 블로그
            </Typography>

            {!isMobile && (
              <Box component="form" onSubmit={handleSearch} sx={{ mx: 2, flexGrow: 0.5 }}>
                <Paper
                  sx={{
                    p: '2px 4px',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: theme.shape.borderRadius * 3,
                    boxShadow: 'none',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.25)',
                    }
                  }}
                >
                  <InputBase
                    sx={{ 
                      ml: 1, 
                      flex: 1,
                      color: 'white',
                      '& input::placeholder': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        opacity: 1
                      }
                    }}
                    placeholder="검색어를 입력하세요..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    inputProps={{ 'aria-label': '검색' }}
                  />
                  <IconButton type="submit" sx={{ p: '10px', color: 'white' }}>
                    <SearchIcon />
                  </IconButton>
                </Paper>
              </Box>
            )}

            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/"
                  sx={{ 
                    mx: 1,
                    opacity: location.pathname === '/' ? 1 : 0.7,
                    '&:hover': { opacity: 1 }
                  }}
                >
                  홈
                </Button>
                
                {currentUser ? (
                  <>
                    <Button 
                      color="inherit" 
                      component={Link} 
                      to="/write"
                      sx={{ 
                        mx: 1,
                        opacity: location.pathname === '/write' ? 1 : 0.7,
                        '&:hover': { opacity: 1 }
                      }}
                    >
                      글쓰기
                    </Button>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                      <Avatar 
                        alt={currentUser.login} 
                        src={currentUser.avatar_url}
                        sx={{ width: 32, height: 32, mr: 1 }}
                      />
                      <Button 
                        color="inherit"
                        onClick={handleLogout}
                        sx={{ '&:hover': { opacity: 0.8 } }}
                      >
                        로그아웃
                      </Button>
                    </Box>
                  </>
                ) : (
                  <Button 
                    color="inherit" 
                    component={Link} 
                    to="/login"
                    variant="outlined"
                    sx={{ 
                      ml: 1,
                      border: '1px solid rgba(255, 255, 255, 0.5)',
                      '&:hover': { 
                        border: '1px solid rgba(255, 255, 255, 0.8)',
                        bgcolor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    <GitHubIcon sx={{ mr: 1, fontSize: 20 }} />
                    로그인
                  </Button>
                )}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        isLoggedIn={!!currentUser}
        user={currentUser}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />

      {/* 스크롤 맨 위로 버튼 */}
      <Zoom in={showScrollTop}>
        <Box
          role="presentation"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          <Tooltip title="맨 위로">
            <Fab
              color="primary"
              size="small"
              aria-label="scroll back to top"
              onClick={scrollToTop}
            >
              <ArrowUpwardIcon />
            </Fab>
          </Tooltip>
        </Box>
      </Zoom>

      {/* 글쓰기 버튼 (모바일에서는 플로팅 버튼으로) */}
      {isMobile && currentUser && location.pathname !== '/write' && (
        <Zoom in={true}>
          <Box
            role="presentation"
            sx={{
              position: 'fixed',
              bottom: showScrollTop ? 80 : 16,
              right: 16,
              zIndex: 1000,
            }}
          >
            <Tooltip title="글쓰기">
              <Fab
                color="secondary"
                aria-label="write"
                component={Link}
                to="/write"
              >
                <EditIcon />
              </Fab>
            </Tooltip>
          </Box>
        </Zoom>
      )}
    </>
  );
}

export default Navbar;