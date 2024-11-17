import React, { useState } from 'react';
import { Row, Col, Card, Button, Radio, Image } from 'antd';
import Draggable from 'react-draggable';
import TextStyleForm from './TextStyleForm';

const ImageSection = ({ recentImages, selectedImage, setSelectedImage, sendAllData, imageText, setImageText }) => {
  const [imageTextInput, setImageTextInput] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const [fontColor, setFontColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [textShadowColor, setTextShadowColor] = useState('#000000');
  const [isTextApplied, setIsTextApplied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [imageErrorMessage, setImageErrorMessage] = useState('');

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

  return (
    <Card title="이미지 섹션" bordered={true} style={{ borderRadius: 10, margin: '0px', marginTop: '-30px' }} className="korean-font">
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
          <Image
            src={selectedImage}
            alt="선택된 이미지"
            style={{
              width: '100%', 
              height: '100%', 
            }}
          />
        ) : (
          <p className="korean-font">여기에 AI로 생성된 이미지가 표시됩니다.</p>
        )}
        {isTextApplied && (
          <Draggable bounds="parent">
            <div
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

        {/*최근 생성된 이미지 목록*/} 
        <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col span={19}>
            <h5 className="korean-font" style={{ marginBottom: '20px' }}>최근 생성된 이미지 목록</h5>
            <Radio.Group onChange={(e) => setSelectedImage(e.target.value)}>
            <Row gutter={[2, 16]}>
        {recentImages.slice(0, 10).map((image, index) => (
            <Col span={4} key={index}> 
            <Radio value={image}>
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '10px', marginBottom: '10px' }}>
          <Image
              src={image}
              alt={`Image ${index}`}
              style={{
              width: '100%',  
              height: 'auto',
              borderRadius: '10px',
              border: selectedImage === image ? '3px solid #1890ff' : 'none',
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
