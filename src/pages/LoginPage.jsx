import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container, Typography, Paper, TextField, Button,
  Box, CircularProgress, Alert, Divider, Grid,
  Card, CardContent, Avatar, Stepper, Step, StepLabel
} from '@mui/material';
import { 
  GitHub as GitHubIcon,
  Key as KeyIcon,
  Security as SecurityIcon,
  Code as CodeIcon,
  VerifiedUser as VerifiedUserIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext.jsx';

function LoginPage() {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // 로그인 성공 후 이동할 페이지
  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!token.trim()) {
      setError('GitHub 토큰을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const user = await loginWithToken(token);
      
      if (user) {
        navigate(from, { replace: true });
      } else {
        setError('GitHub 토큰이 유효하지 않습니다.');
      }
    } catch (error) {
      setError(`로그인 오류: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              GitHub으로 로그인
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              개인 액세스 토큰으로 로그인하여 블로그를 관리하세요.
            </Typography>
          </Box>
          
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="GitHub 개인 액세스 토큰"
                variant="outlined"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxx"
                margin="normal"
                required
                type="password"
                InputProps={{
                  startAdornment: <KeyIcon color="action" sx={{ mr: 1 }} />,
                }}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isLoading || !token.trim()}
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <GitHubIcon />}
              >
                {isLoading ? '로그인 중...' : 'GitHub 토큰으로 로그인'}
              </Button>
            </Box>
            
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                또는
              </Typography>
            </Divider>
            
            <Button
              fullWidth
              variant="outlined"
              color="inherit"
              startIcon={<GitHubIcon />}
              component="a"
              href="https://github.com/login"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ mb: 2 }}
            >
              GitHub 계정으로 이동
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 4, borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <SecurityIcon />
                </Avatar>
                <Typography variant="h6">개인 액세스 토큰 안내</Typography>
              </Box>
              
              <Typography variant="body2" paragraph color="text.secondary">
                이 블로그는 GitHub API를 사용하여 데이터를 저장합니다.
                게시물을 작성하려면 GitHub 개인 액세스 토큰(PAT)이 필요합니다.
              </Typography>
              
              <Stepper orientation="vertical" sx={{ mt: 3 }}>
                <Step active completed>
                  <StepLabel>GitHub 계정 설정 이동</StepLabel>
                  <Box sx={{ ml: 3, mt: 1, mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      GitHub 로그인 후 우측 상단 프로필 &gt; Settings &gt; Developer settings &gt; Personal access tokens &gt; Tokens (classic) 메뉴로 이동
                    </Typography>
                  </Box>
                </Step>
                <Step active completed>
                  <StepLabel>토큰 생성</StepLabel>
                  <Box sx={{ ml: 3, mt: 1, mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      "Generate new token" 버튼 클릭 후 토큰 이름(Note) 입력 (예: "My Blog Token")
                    </Typography>
                  </Box>
                </Step>
                <Step active completed>
                  <StepLabel>권한 설정</StepLabel>
                  <Box sx={{ ml: 3, mt: 1, mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      'repo' 권한 체크 (저장소 접근 및 파일 수정 권한)
                    </Typography>
                    <Box component="img" src="https://docs.github.com/assets/cb-49422/mw-1440/images/help/settings/token_scopes.webp" sx={{ maxWidth: '100%', height: 'auto', mt: 1, borderRadius: 1 }} />
                  </Box>
                </Step>
                <Step active completed>
                  <StepLabel>토큰 생성 및 복사</StepLabel>
                  <Box sx={{ ml: 3, mt: 1, mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      "Generate token" 버튼 클릭 후 생성된 토큰을 복사하여 로그인에 사용
                      (이 페이지를 나가면 토큰을 다시 볼 수 없습니다!)
                    </Typography>
                  </Box>
                </Step>
              </Stepper>
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<GitHubIcon />}
                  component="a" 
                  href="https://github.com/settings/tokens/new" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  토큰 생성 페이지로 이동
                </Button>
              </Box>
            </CardContent>
          </Card>
          
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  <CodeIcon />
                </Avatar>
                <Typography variant="h6">블로그 정보</Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>GitHub API 기반 블로그</strong>는 백엔드 서버 없이 GitHub 저장소를 데이터베이스로 활용하는 블로그 플랫폼입니다.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                <VerifiedUserIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  <strong>보안:</strong> 토큰은 클라이언트에만 저장되며 서버로 전송되지 않습니다.
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <VerifiedUserIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  <strong>접근 제어:</strong> 본인만 게시물을 작성/수정할 수 있으며, 모든 사용자가 게시물을 읽을 수 있습니다.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default LoginPage;