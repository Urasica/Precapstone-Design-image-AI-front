import React, { useState } from 'react';
import { Card, Form, Input, Button, message } from 'antd';

const { TextArea } = Input;

const MessageInput = ({ messageContent, setMessageContent, prompt, setPrompt, targeting, setTargeting, imageText, setImageText, setSelectedImage }) => {
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    setLoading(true);
    let loadingMessageShown = false;

    const loadingTimeout = setTimeout(() => {
      loadingMessageShown = true;
      message.loading('이미지를 생성 중입니다. 잠시만 기다려 주세요...');
    }, 1000);

    try {
      const response = await fetch("http://localhost:8080/images/generate", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prompt),
      });

      console.log('응답 상태:', response.status);

      if (!response.ok) {
        throw new Error('네트워크 응답이 올바르지 않습니다.');
      }

      const textResponse = await response.text();
      console.log('서버 응답:', textResponse);

      const imageUrl = textResponse;
      setSelectedImage(imageUrl);

      if (loadingMessageShown) {
        message.success('이미지가 성공적으로 표시되었습니다.');
      }

    } catch (error) {
      if (loadingMessageShown) {
        message.error('이미지 로드 중 오류가 발생했습니다.');
      }
    } finally {
      clearTimeout(loadingTimeout);
      setLoading(false);
    }
  };

  return (
    <Card title="메세지 입력" bordered={true} style={{ borderRadius: 10, margin: '0px', marginTop: '-30px' }} className="korean-font">
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
            style={{ height: '50px', resize: 'none' }}
            placeholder="프롬프트"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </Form.Item>
        <Button type="primary" block style={{ marginBottom: 20 }} onClick={generateImage} loading={loading}>
          생성
        </Button>
      </Form>
    </Card>
  );
};

export default MessageInput;
