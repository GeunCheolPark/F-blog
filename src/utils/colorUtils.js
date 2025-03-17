// 게시물 ID 기반으로 일관된 색상 생성하는 유틸리티 함수

// 미리 정의된 브랜드 색상들 (파스텔 계열)
const brandColors = [
  '#4CAF50', // 초록
  '#2196F3', // 파랑
  '#9C27B0', // 보라
  '#F44336', // 빨강
  '#FF9800', // 주황
  '#009688', // 청록
  '#673AB7', // 진보라
  '#3F51B5', // 남색
  '#E91E63', // 분홍
  '#00BCD4', // 하늘
  '#8BC34A', // 연두
  '#FFC107', // 노랑
  '#795548', // 갈색
  '#607D8B', // 청회색
];

/**
 * 게시물 ID에 기반한 색상 생성
 * @param {number|string} id - 게시물 ID 또는 문자열
 * @param {number} opacity - 색상 불투명도 (0-1)
 * @returns {string} - CSS 색상 문자열
 */
export const getRandomColor = (id, opacity = 1) => {
  // ID를 숫자로 변환 (이미 숫자면 그대로 사용)
  const numericId = typeof id === 'string' ? id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : id;
  
  // ID를 색상 배열의 인덱스로 변환
  const colorIndex = numericId % brandColors.length;
  
  return brandColors[colorIndex];
};

/**
 * 밝기에 따라 텍스트 색상 결정 (어두운 배경엔 밝은 텍스트, 밝은 배경엔 어두운 텍스트)
 * @param {string} backgroundColor - 배경 색상 (hex)
 * @returns {string} - 'white' 또는 'rgba(0, 0, 0, 0.87)'
 */
export const getContrastTextColor = (backgroundColor) => {
  // hex 색상에서 RGB 추출
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // 색상 밝기 계산 (YIQ 공식)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // 밝기에 따라 텍스트 색상 결정
  return brightness > 128 ? 'rgba(0, 0, 0, 0.87)' : 'white';
};