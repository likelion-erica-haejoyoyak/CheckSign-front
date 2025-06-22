import axios from 'axios';

const BASE_URL = 'https://checksign.pdj.kr';

// API 엔드포인트 정의
const API_ENDPOINTS = {
  UPLOAD: `${BASE_URL}/api/imgupload/upload`,
  GET_IMAGE: `${BASE_URL}/api/imgupload/get`,
  DELETE_IMAGE: `${BASE_URL}/api/imgupload/remove`,
  AI_REQUEST: `${BASE_URL}/api/ai/request`,
  AI_RESULT: `${BASE_URL}/api/ai/result`
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
    
    if (result.success) {
      return { success: true, id: result.data.id };
    } else {
      throw new Error(result.message || '업로드 실패');
    }
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

// 이미지 삭제 API
export const deleteImage = async (imageId) => {
  const formData = new FormData();
  formData.append('id', imageId);
  try {
    const response = await axios.post(API_ENDPOINTS.DELETE_IMAGE, formData);
    const result = response.data;
    if (!result.success) {
      throw new Error(result.message || '삭제 실패');
    }
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
  const formData = new FormData();
  formData.append('image_id', imageId);
  try {
    const response = await axios.post(API_ENDPOINTS.AI_REQUEST, formData);
    const data = response.data;
    
    if (data.success) {
      return { success: true };
    } else {
      throw new Error(data.message || '분석 요청 실패');
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
    
    if (data.success) {
      const resultData = data.data;
      return {
        success: true,
        status: resultData.status,
        result: resultData.result,
        request_time: resultData.requestTime,
        complete_time: resultData.completeTime,
        error_message: resultData.errorMessage
      };
    } else {
      throw new Error(data.message || '결과 조회 실패');
    }
  } catch (error) {
    console.error('Result fetch error:', error);
    throw error;
  }
};
