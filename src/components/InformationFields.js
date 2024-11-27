import React, { useState } from 'react';
import { Card, Form, Input, Button, Row, Col } from 'antd';

const { TextArea } = Input;

const InformationFields = ({ senderNumber, setSenderNumber, receiverNumbers, setReceiverNumbers }) => {
  const [receiverInput, setReceiverInput] = useState('');
  const [isReceiverInputDisabled, setIsReceiverInputDisabled] = useState(false); 

  
  const handleReceiverNumbersChange = (e) => {
    setReceiverInput(e.target.value); 
  };

  
  const handleAddReceiverNumber = () => {
    const newNumbers = receiverInput
      .split(',')
      .map((num) => num.trim().replace(/-/g, '')) 
      .filter((num) => num !== '' && /^[0-9]+$/.test(num)); 

    setReceiverNumbers(newNumbers); 
    console.log(newNumbers);
    setReceiverInput(''); 
    setIsReceiverInputDisabled(true); 
  };


  const handleEditReceiverNumbers = () => {
    setReceiverNumbers([]); 
    setReceiverInput(''); 
    setIsReceiverInputDisabled(false); 
  };

  return (
    <Card
      title="발신 및 수신 번호"
      bordered={true}
      style={{ borderRadius: 10, margin: '0px', marginTop: '-30px' }}
      className="korean-font"
    >
      <Form layout="vertical">
        <Form.Item label={<span className="korean-font">발신 번호</span>} name="senderNumber">
          <Input
            placeholder="발신 번호 입력"
            value={senderNumber}
            onChange={(e) => setSenderNumber(e.target.value)}
          />
        </Form.Item>
        <Form.Item label={<span className="korean-font">수신 번호</span>}>
          <TextArea
            style={{ height: '120px', resize: 'none' }}
            placeholder="수신 번호를 쉼표(,)로 구분하여 입력"
            value={receiverInput} 
            onChange={handleReceiverNumbersChange} 
            disabled={isReceiverInputDisabled} 
          />
        </Form.Item>

        <Row gutter={[16, 16]} style={{ marginTop: '-10px' }}>
          <Col span={12}>
            <Button
              type="primary"
              block
              onClick={handleAddReceiverNumber} 
            >
              추가
            </Button>
          </Col>
          <Col span={12}>
            <Button
              type="default"
              block
              onClick={handleEditReceiverNumbers} 
            >
              수정
            </Button>
          </Col>
        </Row>

        <Form.Item label={<span className="korean-font">등록된 수신 번호</span>} style={{ marginTop: '10px' }}>
          <div>
            {receiverNumbers.length > 0 ? (
              <ul style={{ paddingLeft: '20px' }}>
                {receiverNumbers.map((num, index) => (
                  <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
                    {num}
                  </li>
                ))}
              </ul>
            ) : (
              <p>수신 번호가 없습니다.</p>
            )}
          </div>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default InformationFields;
