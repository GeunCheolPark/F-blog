import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';

const PostsContext = createContext();

export function usePosts() {
  return useContext(PostsContext);
}

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { octokit, currentUser } = useAuth();

  // GitHub 저장소 정보
  const REPO_OWNER = 'GeunCheolPark'; // 본인의 GitHub 사용자명으로 변경
  const REPO_NAME = 'F-blog'; // 데이터 저장용 저장소 이름
  const FILE_PATH = 'posts.json'; // 게시물 데이터 파일 경로

  // 게시물 데이터 로드
  useEffect(() => {
    fetchPosts();
  }, []);

  // GitHub에서 게시물 데이터 가져오기
  async function fetchPosts() {
    setLoading(true);
    try {
      // GitHub API를 통해 파일 내용 가져오기
      const response = await fetch(`https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${FILE_PATH}`);
      
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      } else {
        console.log('게시물 데이터가 없습니다. 새로 생성합니다.');
        setPosts([]);
      }
    } catch (error) {
      console.error('게시물 로드 오류:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  // GitHub에 게시물 데이터 저장
  async function savePosts(updatedPosts) {
    if (!octokit || !currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    try {
      // 현재 파일 정보 가져오기 (파일이 있는 경우)
      let sha = '';
      try {
            console.log('1. 저장 시도 시작', {
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: FILE_PATH
            });
        
        const { data } = await octokit.repos.getContent({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          path: FILE_PATH,
        });
        sha = data.sha;
      } catch (error) {
        // 파일이 없는 경우 (처음 저장 시)
        console.log(error, '새 파일을 생성합니다.');
      }

      // 파일 내용 업데이트 또는 생성
      const content = JSON.stringify({ posts: updatedPosts, updated_at: new Date().toISOString() }, null, 2);
      
      await octokit.repos.createOrUpdateFileContents({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: FILE_PATH,
        message: `게시물 업데이트: ${new Date().toLocaleString()}`,
        // eslint-disable-next-line no-undef
        content: Buffer.from(content).toString('base64'),
        sha: sha || undefined,
      });

      setPosts(updatedPosts);
      return true;
    } catch (error) {
      console.error('게시물 저장 오류:', error);
      throw error;
    }
  }

  // 조회수 증가
  async function incrementViews(postId) {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return { ...post, views: (post.views || 0) + 1 };
      }
      return post;
    });

    try {
      // 비로그인 상태에서는 로컬에서만 업데이트
      if (!octokit) {
        setPosts(updatedPosts);
        return;
      }
      
      await savePosts(updatedPosts);
    } catch (error) {
      console.error('조회수 업데이트 오류:', error);
    }
  }

  // 게시물 추가
  async function addPost(postData) {
    if (!octokit || !currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const newPost = {
      id: Date.now(),
      title: postData.title,
      content: postData.content,
      tags: postData.tags || [],
      date: new Date().toISOString().split('T')[0],
      views: 0,
      author: currentUser.login,
    };

    const updatedPosts = [newPost, ...posts];
    await savePosts(updatedPosts);
    return newPost;
  }

  const value = {
    posts,
    loading,
    fetchPosts,
    addPost,
    incrementViews,
  };

  return (
    <PostsContext.Provider value={value}>
      {children}
    </PostsContext.Provider>
  );
}