import React, { useState } from 'react';
import { Layout, Row, Col, message } from 'antd';
import axios from 'axios';
import './MessageMain.css';
import InformationFields from './components/InformationFields';
import MessageInput from './components/MessageInput';
import ImageSection from './components/ImageSection';

const { Content } = Layout;

const MessageMain = () => {
  const [senderNumber, setSenderNumber] = useState('');
  const [receiverNumbers, setReceiverNumbers] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const [prompt, setPrompt] = useState('');
  const [imageText, setImageText] = useState('');
  const [recentImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const savedImagePath = sessionStorage.getItem("selectedImagePath");

  const sendAllData = async () => {
    try {
      // 전화번호 포맷 정리
      const sanitizedSenderNumber = senderNumber.replace(/-/g, '');
      const sanitizedReceiverNumbers = receiverNumbers.map((num) => num.replace(/-/g, ''));

      const dataToSend = {
        content: messageContent,
        path: savedImagePath, // 경로 사용
        fromPhoneNumber: sanitizedSenderNumber,
        toPhoneNumbers: sanitizedReceiverNumbers, // 배열로 처리
      };
      console.log("서버가 문자 보낼 데이터",dataToSend);

      if (!savedImagePath) {
        console.error('선택된 이미지 경로가 없습니다. path 값이 비어있습니다.');
        message.error('이미지 경로가 비어있습니다. 경로를 확인해주세요.');
        return;
      }
       
      if (imageText) {
        dataToSend.imageText = imageText;
      }

      console.log('전달할 데이터:', dataToSend);

      // 서버로 데이터 전송
      const response = await axios.post('http://3.35.137.214:8080/api/send', dataToSend);

      message.success('모든 정보를 성공적으로 전송했습니다.');
      console.log('서버 응답:', response.data);
    } catch (error) {
      console.error('전송 실패:', error);
      if (error.response) {
        console.error('서버 에러 응답:', error.response.data);
      }
      message.error('전송에 실패했습니다.');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Content style={{ padding: '50px' }}>
        <Row gutter={[16, 16]} justify="center" style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Col xs={24} sm={12} md={4}>
            <InformationFields
              senderNumber={senderNumber}
              setSenderNumber={setSenderNumber}
              receiverNumbers={receiverNumbers}
              setReceiverNumbers={setReceiverNumbers}
            />
          </Col>
          <Col xs={24} sm={12} md={5}>
            <MessageInput
              messageContent={messageContent}
              setMessageContent={setMessageContent}
              prompt={prompt}
              setPrompt={setPrompt}
              imageText={imageText}
              setImageText={setImageText}
              setSelectedImage={setSelectedImage}
            />
          </Col>
          <Col xs={24} sm={12} md={15}>
            <ImageSection
              recentImages={recentImages}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              sendAllData={sendAllData}
              imageText={imageText}
              setImageText={setImageText}
            />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default MessageMain;
