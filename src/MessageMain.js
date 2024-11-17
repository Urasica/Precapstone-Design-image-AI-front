import React, { useState } from 'react';
import { Layout, Row, Col, Form, Input, Button, Radio, Select, Image, Card, message} from 'antd';
import axios from 'axios'; // HTTP 클라이언트 라이브러리 (서버와의 비동기 데이터 통신 도움)
import './MessageMain.css';
import Draggable from 'react-draggable'; //사용자가 이미지 위에서 텍스트 잡고 움직일 수 있도록 하는 라이브러리
import InformationFields from './components/InformationFields'; 
import MessageInput from './components/MessageInput';
import ImageSection from './components/ImageSection'; 

const { Content } = Layout;
const { TextArea } = Input;
const { Option } = Select;

const MessageMain = () => {
  const [senderNumber, setSenderNumber] = useState('');
  const [receiverNumbers, setReceiverNumbers] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [prompt, setPrompt] = useState('');
  const [targeting, setTargeting] = useState('');
  const [imageText, setImageText] = useState('');
  const [isStyleVisible, setIsStyleVisible] = useState(false);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState(16);
  const [fontColor, setFontColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [loading, setLoading] = useState(false);
  const [recentImages] = useState([
    '/images/test1.jpg',
    '/images/test2.jpg',
    '/images/test3.jpg',
    '/images/test4.jpg',
    '/images/test5.jpg',
    '/images/test6.jpg',
    '/images/test7.jpg',
    '/images/test8.jpg',
    '/images/test9.jpg',
    '/images/test10.jpg',
  ]);
  const [selectedImage, setSelectedImage] = useState('');

  const toggleStyleVisibility = () => {
    setIsStyleVisible((prev) => !prev);
  };

  const applyTextStyle = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // 실제 텍스트 스타일 적용 로직을 여기에 추가하면 됩니다.
    }, 1000);
  };

  const sendAllData = async () => {
    try {
      const sanitizedSenderNumber = senderNumber.replace(/-/g, ''); // '-' 없는 발신번호 저장
      const sanitizedReceiverNumbers = receiverNumbers.replace(/-/g, ''); // '-' 없는 수신번호 저장
      const imagePath = selectedImage.replace('http://localhost:8080', '');
      console.log("전송할 이미지 경로:", imagePath);

      const dataToSend = {
        content: messageContent,
        path: imagePath,
        fromPhoneNumber: sanitizedSenderNumber,
        toPhoneNumber: sanitizedReceiverNumbers,
      };
  
      if (imageText) {
        dataToSend.imageText = imageText; // 이미지에 포함된 텍스트 추가
      }
  
      const response = await axios.post('http://localhost:8080/api/send', dataToSend);
  
      message.success('모든 정보를 성공적으로 전송했습니다.');
    } catch (error) {
      console.error('전송 실패:', error);
      if (error.response) {
        console.error("서버 에러 응답:", error.response.data);
        console.error("상태 코드:", error.response.status);
        console.error("헤더:", error.response.headers);
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
              targeting={targeting}
              setTargeting={setTargeting}
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
