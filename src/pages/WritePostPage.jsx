import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Paper, TextField, Button,
  Box, CircularProgress, Chip
} from '@mui/material';
import { usePosts } from '../contexts/PostsContext.jsx';

function WritePostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addPost } = usePosts();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const post = await addPost({
        title,
        content,
        tags
      });
      
      navigate(`/post/${post.id}`);
    } catch (error) {
      alert(`게시물 저장 중 오류가 발생했습니다: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter(tag => tag !== tagToDelete));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        새 글 작성
      </Typography>
      
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
        <TextField
          fullWidth
          label="제목"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          margin="normal"
          required
        />
        
        <Box sx={{ mt: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TextField
              label="태그"
              variant="outlined"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="태그 입력 후 엔터 또는 추가 버튼 클릭"
              size="small"
              sx={{ mr: 1 }}
            />
            <Button 
              variant="outlined" 
              onClick={handleAddTag}
              disabled={!newTag.trim()}
            >
              추가
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            {tags.map(tag => (
              <Chip
                key={tag}
                label={tag}
                onDelete={() => handleDeleteTag(tag)}
                color="primary"
                variant="outlined"
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>
        </Box>
        
        <TextField
          fullWidth
          label="내용"
          variant="outlined"
          multiline
          rows={15}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="마크다운 형식으로 내용을 입력하세요"
          margin="normal"
          required
        />
        
        <Box sx={{ mt: 3, mb: 1, display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/')}
          >
            취소
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={isSubmitting || !title.trim() || !content.trim()}
          >
            {isSubmitting ? <CircularProgress size={24} /> : '게시하기'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default WritePostPage;