import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Button, Radio, Image, message } from 'antd';
import Draggable from 'react-draggable';
import TextStyleForm from './TextStyleForm';

const ImageSection = ({ selectedImage, setSelectedImage, sendAllData }) => {
  const [imageTextInput, setImageTextInput] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const [fontColor, setFontColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [textShadowColor, setTextShadowColor] = useState('#000000');
  const [isTextApplied, setIsTextApplied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [imageErrorMessage, setImageErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentImages, setRecentImages] = useState([]);
  const [selectedImagePath, setSelectedImagePath] = useState(''); // 이미지 경로만 저장

  const userName = localStorage.getItem('username');
  const draggableRef = useRef(null); 

  // 최근 이미지 목록을 불러오는 함수
  const fetchRecentImages = async () => {
    if (!userName) {
      message.error('사용자 이름이 없습니다. 로그인 상태를 확인해주세요.');
      return;
    }
    try {
      const response = await fetch(`http://3.35.137.214:8080/images/recent?userName=${encodeURIComponent(userName)}`, {
        method: 'GET',
        headers: { Accept: '*/*' },
      });

      if (!response.ok) {
        throw new Error('최근 이미지를 가져오는 중 오류가 발생했습니다.');
      }

      const recentData = await response.json();
      const images = recentData.slice(0, 10).map((item) => ({
        base64Image: `data:image/jpeg;base64,${item.base64Image}`,
        genAt: item.genAt,
      }));
      
      setRecentImages(images);  // 최근 이미지를 상태에 반영
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRecentImages(); 
  }, [userName]);

  const handleRemoveBackground = () => setBackgroundColor('transparent');

  const applyTextStyle = () => {
    if (!selectedImage) {
      setImageErrorMessage('이미지를 선택해 주세요!');
      return;
    }
    if (imageTextInput.trim() === '') {
      setErrorMessage('텍스트를 입력해 주세요!');
      return;
    }
    setErrorMessage('');
    setImageErrorMessage('');
    setIsTextApplied(true);
  };

  const generateImage = async () => {
    setLoading(true);
  
    const loadingTimeout = setTimeout(() => {
      message.loading('이미지를 생성 중입니다. 잠시만 기다려 주세요...');
    }, 1000);
  
    const userName = localStorage.getItem('username');
    if (!userName) {
      message.error('사용자 이름이 없습니다. 로그인 상태를 확인해주세요.');
      setLoading(false);
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8080/images/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageContent: imageTextInput }),
      });
  
      if (!response.ok) {
        throw new Error('네트워크 응답이 올바르지 않습니다.');
      }
  
      const data = await response.json();
      const base64Image = `data:image/jpeg;base64,${data.image}`;
      setSelectedImage(base64Image);
  
      // 생성된 이미지 경로를 설정
      const imageId = data.imageId; // 서버에서 반환된 이미지 ID
      const imagePath = `/upload/image_${imageId}.jpg`; // 경로를 저장
      setSelectedImagePath(imagePath); // 경로 저장
  
      setRecentImages(prevImages => [
        { base64Image, genAt: new Date().toISOString() }, 
        ...prevImages,
      ]);
  
      message.success('이미지가 성공적으로 표시되었습니다.');
    } catch (error) {
      message.error('이미지 생성 중 오류가 발생했습니다.');
      console.error('이미지 생성 중 오류가 발생했습니다:', error.message);
    } finally {
      clearTimeout(loadingTimeout);
      setLoading(false);
    }
  };
  
  const handleRecentImageSelect = (image) => {
    // 최근 이미지 선택 시 경로도 함께 설정
    setSelectedImage(image.base64Image);
    const imagePath = `/upload/image_${image.genAt}.jpg`;  // 해당 이미지 경로 설정
    setSelectedImagePath(imagePath);
  };  

  return (
    <Card
      title="이미지 섹션"
      bordered={true}
      style={{ borderRadius: 10, margin: '0px', marginTop: '-30px' }}
      className="korean-font"
    >
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <div
            className="image-display"
            style={{
              position: 'relative',
              height: '350px',
              width: '100%',
              border: '4px solid #3CB371',
              overflow: 'hidden',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            {selectedImage ? (
              <Image src={selectedImage} alt="선택된 이미지" style={{ width: '100%', height: '100%' }} />
            ) : (
              <p className="korean-font">여기에 AI로 생성된 이미지가 표시됩니다.</p>
            )}
            {isTextApplied && (
              <Draggable nodeRef={draggableRef} bounds="parent">
                <div
                  ref={draggableRef}
                  style={{
                    position: 'absolute',
                    cursor: 'move',
                    color: fontColor,
                    fontSize: `${fontSize}px`,
                    background: backgroundColor,
                    padding: '2px',
                    borderRadius: '5px',
                    textShadow: `0px 0px 2px ${textShadowColor}`,
                  }}
                >
                  {imageTextInput}
                </div>
              </Draggable>
            )}
          </div>
        </Col>
        <Col span={10}>
          <TextStyleForm
            imageTextInput={imageTextInput}
            setImageTextInput={setImageTextInput}
            fontSize={fontSize}
            setFontSize={setFontSize}
            fontColor={fontColor}
            setFontColor={setFontColor}
            backgroundColor={backgroundColor}
            setBackgroundColor={setBackgroundColor}
            textShadowColor={textShadowColor}
            setTextShadowColor={setTextShadowColor}
            handleRemoveBackground={handleRemoveBackground}
            applyTextStyle={applyTextStyle}
            errorMessage={errorMessage}
            imageErrorMessage={imageErrorMessage}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col span={19}>
          <h5 className="korean-font" style={{ marginBottom: '20px' }}>
            최근 생성된 이미지 목록
          </h5>
          <Radio.Group onChange={(e) => setSelectedImage(e.target.value)}>
            <Row gutter={[2, 16]}>
              {recentImages.map((image, index) => (
                <Col span={4} key={index}>
                  <Radio value={image.base64Image}>
                    <div
                      style={{
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: '10px',
                        marginBottom: '10px',
                      }}
                    >
                      <Image
                        src={image.base64Image}
                        alt={`Image ${index}`}
                        style={{
                          width: '100%',
                          height: 'auto',
                          borderRadius: '10px',
                          border: selectedImage === image.base64Image ? '3px solid #1890ff' : 'none',
                        }}
                      />
                    </div>
                  </Radio>
                </Col>
              ))}
            </Row>
          </Radio.Group>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Button type="primary" block style={{ marginTop: 20 }} onClick={sendAllData}>
            문자 전송하기
          </Button>
        </Col>
      </Row>
    </Card>
  );
};
export default ImageSection;
