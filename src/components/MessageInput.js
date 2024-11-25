import React, { useState } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import {refresh} from './ImageSection';

const { TextArea } = Input;

const MessageInput = ({ messageContent, setMessageContent, prompt, setPrompt, setSelectedImage }) => {
  const [loading, setLoading] = useState(false);

// MessageInput 컴포넌트
const generateImage = async () => {
  setLoading(true);
  let loadingMessageShown = false;

  const loadingTimeout = setTimeout(() => {
    loadingMessageShown = true;
    message.loading('이미지를 생성 중입니다. 잠시만 기다려 주세요...');
  }, 1000);

  const userName = localStorage.getItem('username');
  if (!userName) {
    message.error('사용자 이름이 없습니다. 로그인 상태를 확인해주세요.');
    setLoading(false);
    return;
  }

  const refreshImages = () => {
    if (window.refresh) {
      window.refresh();
    }
  };

  try {
    const requestData = {
      userName: userName,
      message: messageContent,
      prompt: prompt,
    };

    // 서버 변경 필요
    const response = await fetch("http://3.35.137.214:8080/images/generate", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    console.log(requestData);

    if (!response.ok) {
      throw new Error('네트워크 응답이 올바르지 않습니다.');
    }

    const data = await response.json();
    const image = `data:image/jpeg;base64,${data.image}`;
    setSelectedImage(image); // selectedImage 상태를 업데이트

    const imagePath = data.imageUrl; // 이미지 URL
    console.log('이미지 URL:', imagePath);

    sessionStorage.setItem("selectedImagePath", imagePath);

    if (loadingMessageShown) {
      message.success('이미지가 성공적으로 표시되었습니다.');
      refreshImages(); //최근 이미지 불러오는 함수
    }
  } catch (error) {
    if (loadingMessageShown) {
      message.error('이미지 로드 중 오류가 발생했습니다');
    }
    console.log('이미지 로드 중 오류가 발생했습니다: ' + error.message);
  } finally {
    clearTimeout(loadingTimeout);
    setLoading(false);
  }
};

  return (
    <Card title="메세지 입력" bordered={true} style={{ borderRadius: 10, margin: '10px' ,marginTop: '-30px'}} className="korean-font">
      <Form layout="vertical">
        <Form.Item label={<span className="korean-font">메세지 입력</span>}>
          <TextArea
            style={{ height: '120px', resize: 'none' }}
            placeholder="메세지 입력"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
          />
        </Form.Item>
        <Form.Item label={<span className="korean-font">프롬프트</span>}>
          <TextArea
            style={{ height: '120px', resize: 'none' }}
            placeholder="프롬프트"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </Form.Item>
        <Button type="primary" block style={{ marginBottom: 20}} onClick={generateImage} loading={loading}>
          생성
        </Button>
      </Form>
    </Card>
  );
};

export default MessageInput;
