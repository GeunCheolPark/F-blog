import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Container, Typography, Grid, Card, CardContent, CardMedia,
  CardActions, Button, Box, Chip, CircularProgress, Divider,
  Paper, InputBase, IconButton, Avatar, Skeleton, Pagination
} from '@mui/material';
import {
  Search as SearchIcon,
  AccessTime as AccessTimeIcon,
  Visibility as VisibilityIcon,
  Person as PersonIcon,
  ArrowForward as ArrowForwardIcon,
  LocalOffer as LocalOfferIcon
} from '@mui/icons-material';
import { usePosts } from '../contexts/PostsContext.jsx';
import { getRandomColor } from '../utils/colorUtils';

// 게시물 아이템 컴포넌트
const PostItem = ({ post, onView }) => {
  const cardColor = getRandomColor(post.id);
  
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <CardMedia
        sx={{ 
          height: 140, 
          bgcolor: cardColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 700,
          fontSize: '1.5rem',
          letterSpacing: 1
        }}
      >
        {post.title.charAt(0).toUpperCase()}
      </CardMedia>
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography variant="h5" component="h3" gutterBottom noWrap>
          {post.title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary', fontSize: '0.75rem' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <AccessTimeIcon sx={{ fontSize: '0.875rem', mr: 0.5 }} />
            <span>{post.date}</span>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <VisibilityIcon sx={{ fontSize: '0.875rem', mr: 0.5 }} />
            <span>{post.views || 0}</span>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ fontSize: '0.875rem', mr: 0.5 }} />
            <span>{post.author || '관리자'}</span>
          </Box>
        </Box>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {post.content.substring(0, 150)}...
        </Typography>
        
        {post.tags && post.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
            {post.tags.map(tag => (
              <Chip 
                key={tag} 
                label={tag} 
                size="small" 
                color="primary" 
                variant="outlined"
                icon={<LocalOfferIcon sx={{ fontSize: '0.75rem' }} />}
              />
            ))}
          </Box>
        )}
      </CardContent>
      <Divider />
      <CardActions>
        <Button 
          size="small" 
          color="primary"
          component={Link}
          to={`/post/${post.id}`}
          onClick={() => onView(post.id)}
          endIcon={<ArrowForwardIcon />}
        >
          더 읽기
        </Button>
      </CardActions>
    </Card>
  );
}

// 스켈레톤 로딩 컴포넌트
const PostSkeleton = () => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <Skeleton variant="rectangular" height={140} />
    <CardContent sx={{ flexGrow: 1, pb: 1 }}>
      <Skeleton variant="text" height={40} sx={{ mb: 1 }} />
      
      <Box sx={{ display: 'flex', mb: 1 }}>
        <Skeleton variant="text" width={160} height={20} />
      </Box>
      
      <Skeleton variant="text" height={20} />
      <Skeleton variant="text" height={20} />
      <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
      
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Skeleton variant="rounded" width={60} height={24} />
        <Skeleton variant="rounded" width={75} height={24} />
      </Box>
    </CardContent>
    <Divider />
    <CardActions>
      <Skeleton variant="text" width={100} height={36} />
    </CardActions>
  </Card>
);

function HomePage() {
  const { posts, loading, incrementViews } = usePosts();
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(9);
  const location = useLocation();

  useEffect(() => {
    // URL에서 검색 쿼리 파라미터 추출
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');
    
    if (searchQuery) {
      setLocalSearchQuery(searchQuery);
    } else {
      setLocalSearchQuery('');
    }

    // 검색어가 있을 경우 필터링
    if (searchQuery) {
      const filtered = posts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
    
    // 페이지 초기화
    setCurrentPage(1);
  }, [posts, location.search]);

  // 현재 페이지에 표시할 게시물 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const pageCount = Math.ceil(filteredPosts.length / postsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <Box sx={{ py: 4 }}>
        <Container>
          <Typography variant="h4" gutterBottom>
            최근 게시물
          </Typography>
          <Grid container spacing={4}>
            {Array.from(new Array(6)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <PostSkeleton />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    );
  }

  if (filteredPosts.length === 0) {
    return (
      <Box sx={{ py: 4 }}>
        <Container>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              borderRadius: 2,
              bgcolor: 'background.paper',
              border: '1px solid rgba(0, 0, 0, 0.08)'
            }}
          >
            <Typography variant="h5" gutterBottom>
              {location.search ? '검색 결과가 없습니다' : '게시물이 없습니다'}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {location.search ? 
                '다른 검색어로 다시 검색해보세요.' : 
                '첫 게시물을 작성해보세요!'}
            </Typography>
            {location.search && (
              <Button 
                variant="contained" 
                component={Link} 
                to="/"
                color="primary"
              >
                모든 게시물 보기
              </Button>
            )}
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container>
        {/* 검색 결과 또는 헤더 정보 */}
        <Box sx={{ mb: 4 }}>
          {location.search ? (
            <Box>
              <Typography variant="h4" gutterBottom>
                검색 결과
              </Typography>
              <Paper
                component="form"
                sx={{
                  p: '2px 4px',
                  display: 'flex',
                  alignItems: 'center',
                  width: { xs: '100%', sm: 400 },
                  mb: 2
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="검색어를 입력하세요..."
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  inputProps={{ 'aria-label': '검색' }}
                />
                <IconButton type="submit" sx={{ p: '10px' }}>
                  <SearchIcon />
                </IconButton>
              </Paper>
              <Typography variant="body2" color="text.secondary">
                {filteredPosts.length}개의 게시물이 검색되었습니다.
              </Typography>
            </Box>
          ) : (
            <Typography variant="h4" gutterBottom>
              최근 게시물
            </Typography>
          )}
        </Box>

        {/* 게시물 그리드 */}
        <Grid container spacing={4}>
          {currentPosts.map(post => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <PostItem post={post} onView={incrementViews} />
            </Grid>
          ))}
        </Grid>

        {/* 페이지네이션 */}
        {pageCount > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination 
              count={pageCount} 
              page={currentPage} 
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default HomePage;