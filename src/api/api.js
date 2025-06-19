import axios from 'axios';

const BASE_URL = 'https://pi4.pbj.kr/likelion/api';

// API 엔드포인트 정의
const API_ENDPOINTS = {
  UPLOAD: `${BASE_URL}/imgupload/upload.php`,
  GET_IMAGE: `${BASE_URL}/imgupload/get.php`,
  DELETE_IMAGE: `${BASE_URL}/imgupload/remove.php`,
  AI_REQUEST: `${BASE_URL}/ai/request.php`,
  AI_RESULT: `${BASE_URL}/ai/result.php`
};

// 이미지 업로드 API
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axios.post(API_ENDPOINTS.UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const result = response.data;
    
    if (result.success === 1) {
      return { success: true, id: result.id };
    } else {
      throw new Error(result.error || '업로드 실패');
    }
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

// 이미지 삭제 API
export const deleteImage = async (imageId) => {
  try {
    await axios.post(`${API_ENDPOINTS.DELETE_IMAGE}?id=${imageId}`);
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
};

// 이미지 URL 생성
export const getImageUrl = (imageId) => {
  return `${API_ENDPOINTS.GET_IMAGE}?id=${imageId}`;
};

// AI 분석 요청 API
export const requestAnalysis = async (imageId) => {
  try {
    const response = await axios.post(API_ENDPOINTS.AI_REQUEST, 
      `image_id=${imageId}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const data = response.data;
    
    if (data.success === 1) {
      return { success: true };
    } else {
      throw new Error(data.error || '분석 요청 실패');
    }
  } catch (error) {
    console.error('Analysis request error:', error);
    throw error;
  }
};

// AI 분석 결과 조회 API
export const getAnalysisResult = async (imageId) => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.AI_RESULT}?image_id=${imageId}`);
    const data = response.data;
    
    if (data.success === 1) {
      return {
        success: true,
        status: data.status,
        result: data.result,
        error_message: data.error_message
      };
    } else {
      throw new Error(data.error || '결과 조회 실패');
    }
  } catch (error) {
    console.error('Result fetch error:', error);
    throw error;
  }
};
