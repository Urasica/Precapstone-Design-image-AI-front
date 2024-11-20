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
  const [receiverNumbers, setReceiverNumbers] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [prompt, setPrompt] = useState('');
  const [imageText, setImageText] = useState('');
  const [recentImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedImagePath, setSelectedImagePath] = useState(''); // 이미지 경로 저장 변수 추가

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result); // 이미지 파일을 base64로 저장
      setSelectedImagePath(file.name); // 선택된 이미지 파일의 경로를 저장
    };
    reader.readAsDataURL(file);
  };

  const sendAllData = async () => {
    try {
      // 전화번호 포맷 정리
      const sanitizedSenderNumber = senderNumber.replace(/-/g, '');
      const sanitizedReceiverNumbers = receiverNumbers.replace(/-/g, '');

      console.log('전송할 데이터 확인:');
      console.log('Sender Number:', sanitizedSenderNumber);
      console.log('Receiver Numbers:', sanitizedReceiverNumbers);
      console.log('Message Content:', messageContent);
      console.log('Prompt:', prompt);
      console.log('Image Text:', imageText);
      console.log('Selected Image:', selectedImage); // base64 이미지 데이터
      console.log('Selected Image Path:', selectedImagePath); // 선택된 이미지의 경로

      const dataToSend = {
        content: messageContent,
        path: selectedImagePath, // 경로 사용
        fromPhoneNumber: sanitizedSenderNumber,
        toPhoneNumber: sanitizedReceiverNumbers,
      };

      if (!selectedImagePath) {
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
