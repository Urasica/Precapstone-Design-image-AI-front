import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Input, Button, Slider } from 'antd';

const TextStyleForm = ({
  imageTextInput,
  setImageTextInput,
  fontSize,
  setFontSize,
  fontColor,
  setFontColor,
  backgroundColor,
  setBackgroundColor,
  textShadowColor,
  setTextShadowColor,
  handleRemoveBackground,
  applyTextStyle,
  errorMessage,
  imageErrorMessage,
  backgroundOpacity,
  setBackgroundOpacity
}) => {
  const handleRemoveTextShadow = () => {
    setTextShadowColor('transparent');
  };

  useEffect(() => {
    handleRemoveBackground();
  }, []);

  return (
    <div
      style={{
        marginTop: '0px',
        padding: '10px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '5px',
        }}
      >
        <h5 className="korean-font" style={{ marginLeft: '90px'}}>이미지에 추가할 텍스트</h5>
        <Button
          type="default"
          onClick={() => {setImageTextInput('');}} // TextArea 초기화
          style={{ fontSize: '12px', marginLeft: '60px'}}
        >
          삭제
        </Button>
      </div>

      <Form.Item label={<span className="korean-font">텍스트 입력</span>}>
        <Input.TextArea
          placeholder="텍스트 입력"
          value={imageTextInput}
          onChange={(e) => setImageTextInput(e.target.value)}
          style={{
            width: '100%',
            resize: 'none', // 사용자가 크기를 조정할 수 없게 설정
            whiteSpace: 'pre-line', // 줄바꿈이 스타일 적용 시 반영되게 설정
          }}
          rows={4} // 기본적으로 4줄 표시
        />
      </Form.Item>

      <Row gutter={16}>
        <Col span={8}>
          <label className="korean-font" style={{ display: 'flex', alignItems: 'center' }}>
            폰트 크기:
          </label>
        </Col>
        <Col span={16}>
          <Row gutter={8}>
            <Col span={16}>
              <Slider min={8} max={72} value={fontSize} onChange={setFontSize} />
            </Col>
            <Col span={8}>
              <Input
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                min={8}
                max={72}
                style={{ width: '100%' }}
              />
            </Col>
          </Row>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '10px' }}>
        <Col span={8}>
          <label className="korean-font" style={{ display: 'flex', alignItems: 'center' }}>
            텍스트 색상:
          </label>
        </Col>
        <Col span={16}>
          <Input
            type="color"
            value={fontColor}
            onChange={(e) => setFontColor(e.target.value)}
            style={{ width: '100%' }}
          />
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '10px' }}>
        <Col span={8}>
          <label className="korean-font" style={{ display: 'flex', alignItems: 'center' }}>
            텍스트 윤곽선:
          </label>
        </Col>
        <Col span={12}>
          <Input
            type="color"
            value={textShadowColor}
            onChange={(e) => setTextShadowColor(e.target.value)}
            style={{ width: '100%' }}
          />
        </Col>
        <Col span={4}>
          <Button onClick={handleRemoveTextShadow} block type="default" style={{ marginTop: '0px' }}>
            제거
          </Button>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '10px' }}>
        <Col span={8}>
          <label className="korean-font" style={{ display: 'flex', alignItems: 'center' }}>
            배경:
          </label>
        </Col>
        <Col span={12}>
          <Input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            style={{ width: '100%' }}
          />
        </Col>
        <Col span={4}>
          <Button onClick={handleRemoveBackground} block type="default" style={{ marginTop: '0px' }}>
            제거
          </Button>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '10px' }}>
        <Col span={8}>
          <label className="korean-font" style={{ display: 'flex', alignItems: 'center' }}>
            배경 투명도:
          </label>
        </Col>
        <Col span={16}>
          <Slider
            min={0}
            max={1}
            step={0.1}
            value={backgroundOpacity}
            onChange={setBackgroundOpacity}
          />
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '10px' }}>
        <Col span={24}>
          <Button onClick={applyTextStyle} block type="primary">
            스타일 적용
          </Button>
        </Col>
      </Row>

      {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>}
      {imageErrorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{imageErrorMessage}</div>}
    </div>
  );
};

export default TextStyleForm;
