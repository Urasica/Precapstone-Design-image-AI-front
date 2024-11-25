import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Button, Radio, Image, message } from 'antd';
import Draggable from 'react-draggable';
import html2canvas from 'html2canvas';
import TextStyleForm from './TextStyleForm';

const ImageSection = ({ selectedImage, setSelectedImage, sendAllData }) => {
  const [imageTextInput, setImageTextInput] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const [fontColor, setFontColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [textShadowColor, setTextShadowColor] = useState('#000000');
  const [isTextApplied, setIsTextApplied] = useState(false);
  const [recentImages, setRecentImages] = useState([]);
  const userName = localStorage.getItem('username');
  const draggableRef = useRef(null);
  const imageContainerRef = useRef(null);

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
        imageUrl: item.imageUrl,
        genAt: item.genAt,
      }));
      setRecentImages(images);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRecentImages();
  }, []);

  useEffect(() => {
    if (recentImages.length > 0) {
      const firstImage = recentImages[0];
      setSelectedImage(firstImage.base64Image);
      sessionStorage.setItem('selectedImagePath', firstImage.imageUrl);
    }
  }, [recentImages]);

  useEffect(() => {
    window.refresh = fetchRecentImages;
    return () => {
      delete window.refresh;
    };
  }, []);

  const handleRemoveBackground = () => setBackgroundColor('transparent');

  const applyTextStyle = () => {
    if (imageTextInput.trim() === '') {
      message.error('텍스트를 입력해 주세요!');
      return;
    }
    setIsTextApplied(true);
  };

  const handleRecentImageSelect = (image) => {
    setSelectedImage(image.base64Image);
    const imagePath = image.imageUrl;
    sessionStorage.setItem("selectedImagePath", imagePath);
  };

  const uploadImageToServer = async () => {
    if (imageContainerRef.current) {
      try {
        // 캡처 시작
        const canvas = await html2canvas(imageContainerRef.current, {
          backgroundColor: null,
        });

        // 캡처된 이미지를 크롭
        const croppedCanvas = document.createElement('canvas');
        const cropWidth = canvas.width - 20; // 좌우 여백 제거
        const cropHeight = canvas.height;
        croppedCanvas.width = cropWidth;
        croppedCanvas.height = cropHeight;

        const ctx = croppedCanvas.getContext('2d');
        ctx.drawImage(canvas, 10, 0, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

        const base64ImageData = croppedCanvas.toDataURL('image/jpeg').split(',')[1];
        const nickname = localStorage.getItem('username') || 'Guest';

        const payload = {
          nickname,
          base64ImageData,
        };

        const response = await fetch('http://3.35.137.214:8080/images/edit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('이미지를 업로드하는 중 오류가 발생했습니다.');
        }

        const data = await response.json();
        const { imageUrl, image } = data;

        // 서버에서 받은 이미지 URL을 저장 (선택된 이미지는 갱신하지 않음)
        sessionStorage.setItem('uploadedImagePath', imageUrl);

        message.success('이미지가 성공적으로 업로드되었습니다.');

        if (window.refresh) {
          window.refresh();  // 최신 이미지를 불러오기 위해 최근 이미지 목록 갱신
        }
      } catch (error) {
        console.error('서버 업로드 중 오류:', error);
        message.error('이미지 업로드에 실패했습니다.');
      }
    }
  };

  const handleSendData = () => {
    sendAllData();
  };

  return (
    <Card
      title="이미지 섹션" style={{ margin: '0px', marginTop: '-30px' }} className="korean-font">
      <Row gutter={[16, 16]}>
        <Col span={11}>
          <div
            ref={imageContainerRef}
            className="image-display"
            style={{
              position: 'relative',
              height: '279px',
              width: '300px',
              overflow: 'hidden',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            {selectedImage ? (
              <Image src={selectedImage} alt="선택된 이미지" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Image alt="AI로 생성된 이미지" style={{ width: '100%', height: '100%' , objectFit: 'cover'}} />
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
                    borderRadius: '8px',
                    background: backgroundColor,
                    padding: '2px',
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
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}  style={{ marginTop: '-62px' }}>
        <Col span={9}>
          <Button type="primary" block onClick={uploadImageToServer}>
            이미지 저장하기
          </Button>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: '50px' }}>
        <Col span={19}>
          <h5 className="korean-font" style={{ marginBottom: '30px' }}>
            최근 생성된 이미지 목록
          </h5>
          <Radio.Group
            onChange={(e) => handleRecentImageSelect(recentImages.find((img) => img.base64Image === e.target.value))}
            value={selectedImage}
          >
            <Row gutter={[2, 16]}>
              {recentImages.map((image, index) => (
                <Col span={4} key={index}>
                  <Radio value={image.base64Image}>
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
                  </Radio>
                </Col>
              ))}
            </Row>
          </Radio.Group>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={22}>
        <Button type="primary" block style={{ marginTop: 20, marginLeft: '40px', backgroundColor:"#3CB371" }} onClick={handleSendData}>
          문자 전송하기
        </Button>
        </Col>
      </Row>
    </Card>
  );
};



export default ImageSection;
