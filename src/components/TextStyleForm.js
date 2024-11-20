import React from 'react';
import { Row, Col, Form, Input, Button, Select } from 'antd';

const { Option } = Select;

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
}) => {
  const handleRemoveTextShadow = () => {
    setTextShadowColor('#000000');
  };
  
  return (
    <div
      style={{
        marginTop: '0px',
        padding: '10px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px',
      }}
    >
      <h5 className="korean-font" style={{ marginBottom: '5px' }}>
        이미지에 추가할 텍스트
      </h5>

      <Form.Item label={<span className="korean-font">텍스트 입력</span>}>
        <Input
          placeholder="텍스트 입력"
          value={imageTextInput}
          onChange={(e) => setImageTextInput(e.target.value)}
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Row gutter={16}>
        <Col span={8}>
          <label className="korean-font" style={{ display: 'flex', alignItems: 'center' }}>
            텍스트:
          </label>
        </Col>
        <Col span={16}>
          <Select
            value={fontSize}
            onChange={setFontSize}
            style={{ width: '100%' }}
            placeholder="폰트 크기"
          >
            <Option value={9}>9px</Option>
            <Option value={12}>12px</Option>
            <Option value={16}>16px</Option>
            <Option value={20}>20px</Option>
            <Option value={24}>24px</Option>
          </Select>
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
            텍스트 편집:
          </label>
        </Col>
        <Col span={16}>
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