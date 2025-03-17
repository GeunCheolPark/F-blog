import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Paper, Box, Chip, Divider, 
  Button, Avatar, CircularProgress, Skeleton, Card,
  Breadcrumbs, IconButton, Tooltip
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  AccessTime as AccessTimeIcon,
  Visibility as VisibilityIcon,
  LocalOffer as LocalOfferIcon,
  Share as ShareIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { usePosts } from '../contexts/PostsContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import ReactMarkdown from 'react-markdown';
import { getRandomColor } from '../utils/colorUtils';

// 게시물 스켈레톤 로딩 컴포넌트
const PostSkeleton = () => (
  <Box>
    <Skeleton variant="text" height={60} width="70%" sx={{ mb: 1 }} />
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
      <Skeleton variant="circular" width={32} height={32} sx={{ mr: 1 }} />
      <Skeleton variant="text" width={120} height={20} />
    </Box>
    <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
    <Skeleton variant="text" height={20} />
    <Skeleton variant="text" height={20} />
    <Skeleton variant="text" height={20} />
    <Skeleton variant="text" height={20} width="80%" />
  </Box>
);

function PostDetailPage() {
  const { id } = useParams();
  const { posts, loading, incrementViews } = usePosts();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // 문자열로 전달된 id를 숫자로 변환
  const postId = parseInt(id);
  
  // 해당 ID의 게시물 찾기
  const post = posts.find(p => p.id === postId);

  // 헤더 배경색 설정 (게시물 ID 기반)
  const headerBgColor = post ? getRandomColor(post.id) : '#3f51b5';

  // 조회수 증가 (중복 방지를 위해 한 번만 실행)
  useEffect(() => {
    if (post && !loading) {
      incrementViews(postId);
    }
  }, [post, loading, incrementViews, postId]);

  // 공유 기능
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content.substring(0, 100) + '...',
        url: window.location.href,
      })
      .catch((error) => console.log('공유 실패:', error));
    } else {
      // 클립보드에 URL 복사 기능으로 대체
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('게시물 링크가 클립보드에 복사되었습니다.'))
        .catch((err) => console.error('클립보드 복사 실패:', err));
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Button 
            variant="text"
            startIcon={<ArrowBackIcon />}
            component={Link}
            to="/"
          >
            목록으로 돌아가기
          </Button>
        </Box>
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          <PostSkeleton />
        </Paper>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom color="error">
            게시물을 찾을 수 없습니다
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            요청하신 게시물이 존재하지 않거나 삭제되었을 수 있습니다.
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            color="primary"
          >
            홈으로 돌아가기
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* 브레드크럼 네비게이션 */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography color="inherit">홈</Typography>
        </Link>
        <Typography color="text.primary">게시물</Typography>
        <Typography color="text.primary" noWrap sx={{ maxWidth: 200 }}>
          {post.title}
        </Typography>
      </Breadcrumbs>
      
      {/* 게시물 헤더 */}
      <Card 
        sx={{ 
          p: 3, 
          mb: 3, 
          position: 'relative', 
          overflow: 'visible',
          borderTop: `4px solid ${headerBgColor}`,
          borderRadius: 2
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          {post.title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            alt={post.author || 'A'} 
            src={`https://github.com/${post.author}.png`} 
            sx={{ width: 40, height: 40, mr: 1 }}
          >
            {(post.author || 'A').charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight={500}>
              {post.author || '관리자'}
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                fontSize: '0.8rem',
                color: 'text.secondary'
              }}
            >
              <AccessTimeIcon sx={{ fontSize: '0.875rem', mr: 0.5 }} />
              {post.date}
              <Box component="span" sx={{ mx: 1 }}>•</Box>
              <VisibilityIcon sx={{ fontSize: '0.875rem', mr: 0.5 }} />
              {post.views || 0}
            </Box>
          </Box>
          
          {/* 작업 버튼 */}
          <Box sx={{ ml: 'auto', display: 'flex' }}>
            <Tooltip title="공유하기">
              <IconButton onClick={handleShare}>
                <ShareIcon />
              </IconButton>
            </Tooltip>
            
            {currentUser && currentUser.login === post.author && (
              <Tooltip title="수정하기">
                <IconButton>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
        
        {/* 태그 */}
        {post.tags && post.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {post.tags.map(tag => (
              <Chip 
                key={tag} 
                label={tag} 
                size="small" 
                color="primary" 
                variant="outlined"
                icon={<LocalOfferIcon sx={{ fontSize: '0.875rem' }} />}
                component={Link}
                to={`/?search=${encodeURIComponent(tag)}`}
                clickable
                sx={{ textDecoration: 'none' }}
              />
            ))}
          </Box>
        )}
      </Card>
      
      {/* 게시물 본문 */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          borderRadius: 2,
          bgcolor: 'background.paper',
          border: '1px solid rgba(0, 0, 0, 0.08)'
        }}
      >
        <Box 
          sx={{ 
            '& .markdown': { 
              lineHeight: 1.7,
              '& img': {
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 1,
                display: 'block',
                margin: '1rem auto'
              },
              '& a': {
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              },
              '& blockquote': {
                borderLeft: '4px solid',
                borderColor: 'primary.light',
                bgcolor: 'primary.50',
                my: 2,
                py: 1,
                px: 2,
                borderRadius: '4px'
              },
              '& pre': {
                bgcolor: '#f5f5f5',
                p: 2,
                borderRadius: 1,
                overflowX: 'auto'
              },
              '& code': {
                bgcolor: '#f5f5f5',
                p: 0.5,
                borderRadius: 0.5,
                fontFamily: 'monospace'
              },
              '& h1, & h2, & h3, & h4, & h5, & h6': {
                mt: 3,
                mb: 1,
                fontWeight: 600,
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: '-12px',
                  width: '4px',
                  height: '90%',
                  bgcolor: 'primary.main',
                  borderRadius: '4px',
                  top: '5%',
                  display: { xs: 'none', md: 'block' }
                }
              }
            }
          }}
        >
          <div className="markdown">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </Box>
      </Paper>
      
      {/* 네비게이션 버튼 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />}
          component={Link}
          to="/"
        >
          목록으로 돌아가기
        </Button>
        
        <Button 
          variant="contained" 
          color="primary"
          component={Link}
          to={`/?search=${encodeURIComponent(post.tags?.[0] || '')}`}
          disabled={!post.tags || post.tags.length === 0}
        >
          관련 글 보기
        </Button>
      </Box>
    </Container>
  );
}

export default PostDetailPage;