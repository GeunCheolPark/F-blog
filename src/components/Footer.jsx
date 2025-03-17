import React from 'react';
import { Box, Container, Typography, Link, Grid, Divider, IconButton } from '@mui/material';
import { GitHub as GitHubIcon, Code as CodeIcon, Favorite as FavoriteIcon } from '@mui/icons-material';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 4, 
        mt: 'auto', 
        backgroundColor: 'primary.dark', 
        color: 'white' 
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
              내 GitHub 블로그
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
              GitHub API를 활용한 백엔드 없는 블로그 플랫폼입니다.
              모든 데이터는 GitHub 저장소에 JSON 파일로 저장됩니다.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                color="inherit" 
                aria-label="GitHub repository" 
                component="a" 
                href="https://github.com" 
                target="_blank"
                rel="noopener"
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                }}
              >
                <GitHubIcon />
              </IconButton>
              <IconButton 
                color="inherit" 
                aria-label="Source code" 
                component="a" 
                href="https://github.com" 
                target="_blank"
                rel="noopener"
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                }}
              >
                <CodeIcon />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
              기술 스택
            </Typography>
            <Typography component="div" variant="body2" sx={{ opacity: 0.8 }}>
              <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
                <li>React</li>
                <li>Material UI</li>
                <li>React Router</li>
                <li>GitHub API (Octokit)</li>
                <li>React Markdown</li>
              </ul>
            </Typography>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
              링크
            </Typography>
            <Box component="nav" sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link href="/" color="inherit" underline="hover" sx={{ mb: 1, opacity: 0.8, '&:hover': { opacity: 1 } }}>
                홈
              </Link>
              <Link href="/login" color="inherit" underline="hover" sx={{ mb: 1, opacity: 0.8, '&:hover': { opacity: 1 } }}>
                로그인
              </Link>
              <Link href="https://github.com/octokit/octokit.js" target="_blank" rel="noopener" color="inherit" underline="hover" sx={{ mb: 1, opacity: 0.8, '&:hover': { opacity: 1 } }}>
                Octokit
              </Link>
              <Link href="https://docs.github.com/en/rest" target="_blank" rel="noopener" color="inherit" underline="hover" sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}>
                GitHub API 문서
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        <Typography 
          variant="body2" 
          align="center" 
          sx={{ opacity: 0.7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          &copy; {year} GitHub 블로그 프로젝트
          <FavoriteIcon sx={{ mx: 0.5, fontSize: 16, color: 'error.light' }} />
          Made with Material UI & GitHub API
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;