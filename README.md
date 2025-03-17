# GitHub API 기반 React 블로그

GitHub API를 활용하여 백엔드 없이 블로그를 구현한 프로젝트입니다. 게시물 데이터는 GitHub 저장소의 JSON 파일로 저장되며, Material UI를 사용하여 모던한 디자인을 적용했습니다.

## 주요 기능

- GitHub 인증을 통한 작성자 전용 글쓰기
- 마크다운 형식 지원
- 게시물 태그 시스템
- 반응형 디자인 (모바일, 데스크톱 지원)
- 게시물 검색 기능
- 조회수 집계

## 기술 스택

- React
- React Router
- Material UI
- Octokit (GitHub API 클라이언트)
- React Markdown

## 시작하기

### 필수 요구사항

- Node.js
- GitHub 계정
- GitHub 저장소 (데이터 저장용)
- GitHub 개인 액세스 토큰 (PAT)

### 설치 방법

1. 저장소 클론

   ```bash
   git clone https://github.com/yourusername/github-blog.git
   cd github-blog
   ```

2. 의존성 설치

   ```bash
   npm install
   ```

3. GitHub 저장소 정보 설정
   `src/contexts/PostsContext.js` 파일에서 다음 정보를 수정하세요:

   ```javascript
   const REPO_OWNER = "YOUR_GITHUB_USERNAME";
   const REPO_NAME = "blog-data";
   const FILE_PATH = "posts.json";
   ```

4. 개발 서버 실행

   ```bash
   npm start
   ```

5. 빌드 및 배포
   ```bash
   npm run deploy
   ```

## 사용 방법

1. GitHub 개인 액세스 토큰으로 로그인
2. 글쓰기 페이지에서 제목, 태그, 내용 작성
3. 마크다운 형식으로 글 작성 가능
4. 홈페이지에서 게시물 확인 및 검색

## 라이선스

MIT
