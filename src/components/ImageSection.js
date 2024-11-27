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
  const [backgroundOpacity, setBackgroundOpacity] = useState(1.0);
  const userName = localStorage.getItem('username');
  const draggableRef = useRef(null);
  const imageContainerRef = useRef(null);

  const fetchRecentImages = async () => {
    if (!userName) {
      message.error('사용자 이름이 없습니다. 로그인 상태를 확인해주세요.');
      return;
    }
    try {
      const response = await fetch(`http://34.47.70.206:8080/images/recent?userName=${encodeURIComponent(userName)}`, {
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
      sessionStorage.setItem("selectedImagePath", images[0].imageUrl);
      console.log(sessionStorage.getItem("selectedImagePath"));
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

  const handleRemoveBackground = () => setBackgroundOpacity('0');

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
    setImageTextInput('');
    if (imageContainerRef.current) {
        try {
            // 캡처 시작
            const canvas = await html2canvas(imageContainerRef.current, {
                backgroundColor: null
            });

            // 원본 크기를 그대로 가져옴
            const originalWidth = canvas.width;
            const originalHeight = canvas.height;

            // 512x512 크기의 캔버스 생성 (목표 크기 설정)
            const targetSize = 512;
            const aspectRatio = originalWidth / originalHeight;

            let targetWidth, targetHeight;

            if (aspectRatio > 1) {
                // 가로가 더 긴 경우
                targetWidth = targetSize;
                targetHeight = targetSize / aspectRatio;
            } else {
                // 세로가 더 긴 경우
                targetHeight = targetSize;
                targetWidth = targetSize * aspectRatio;
            }

            const resizedCanvas = document.createElement('canvas');
            resizedCanvas.width = targetWidth;
            resizedCanvas.height = targetHeight;

            const resizedCtx = resizedCanvas.getContext('2d');

            // 원본을 비율에 맞게 리사이즈
            resizedCtx.drawImage(
                canvas,
                0, 0, originalWidth, originalHeight, // 원본 이미지 영역
                0, 0, targetWidth, targetHeight // 비율에 맞는 대상 크기
            );

            // 최종 캔버스를 512x512로 중앙 정렬
            const finalCanvas = document.createElement('canvas');
            finalCanvas.width = targetSize;
            finalCanvas.height = targetSize;

            const finalCtx = finalCanvas.getContext('2d');

            // 배경을 투명하게 초기화
            finalCtx.clearRect(0, 0, targetSize, targetSize);

            // 중앙 정렬
            const offsetX = (targetSize - targetWidth) / 2;
            const offsetY = (targetSize - targetHeight) / 2;

            finalCtx.drawImage(
                resizedCanvas,
                offsetX, offsetY, targetWidth, targetHeight
            );

            // 고해상도로 데이터 URL 생성
            const base64ImageData = finalCanvas.toDataURL('image/jpeg', 1.0).split(',')[1];
            const nickname = localStorage.getItem('username') || 'Guest';

            const payload = {
                nickname,
                base64ImageData,
            };

            const response = await fetch('http://34.47.70.206:8080/images/edit', {
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

            setSelectedImage(`data:image/jpeg;base64,${image}`);
            sessionStorage.setItem('uploadedImagePath', imageUrl);

            message.success('이미지가 성공적으로 업로드되었습니다.');

            if (window.refresh) {
                window.refresh();
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
              height: 'px',
              width: '300px',
              overflow: 'hidden',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              margin: 0, 
              padding: 0, 
              background: 'White',
              borderRadius: '0px'
            }}
          >
            {selectedImage ? (
              <Image src={selectedImage} alt="선택된 이미지" style={{ width: '100%', height: '100%' }} />
            ) : (
              <Image alt="AI로 생성된 이미지" style={{ width: '100%', height: '100%'}} />
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
                    background: `rgba(${parseInt(backgroundColor.slice(1, 3), 16)}, ${parseInt(backgroundColor.slice(3, 5), 16)}, ${parseInt(backgroundColor.slice(5, 7), 16)}, ${backgroundOpacity})`,
                    padding: '2px',
                    textShadow: `0px 0px 4px ${textShadowColor}`,
                    fontWeight: 'bold'
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
            backgroundOpacity={backgroundOpacity}
            setBackgroundOpacity={setBackgroundOpacity}
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
