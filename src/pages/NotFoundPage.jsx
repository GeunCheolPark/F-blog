import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';

function NotFoundPage() {
  return (
    <Container sx={{ mt: 4, textAlign: 'center' }}>
      <Typography variant="h1" component="h1" sx={{ fontSize: '6rem', fontWeight: 700 }}>
        404
      </Typography>
      <Typography variant="h4" component="h2" gutterBottom>
        페이지를 찾을 수 없습니다
      </Typography>
      <Typography variant="body1" paragraph>
        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/"
          startIcon={<HomeIcon />}
        >
          홈으로 돌아가기
        </Button>
      </Box>
    </Container>
  );
}

export default NotFoundPage;