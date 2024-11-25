import React, { useState } from 'react';
import { Card, Form, Input, Button, Row, Col } from 'antd';

const { TextArea } = Input;

const InformationFields = ({ senderNumber, setSenderNumber, receiverNumbers, setReceiverNumbers }) => {
  const [receiverInput, setReceiverInput] = useState('');
  const [isReceiverInputDisabled, setIsReceiverInputDisabled] = useState(false); // TextArea 비활성화 상태

  // 수신 번호를 쉼표로 구분해 배열로 변환
  const handleReceiverNumbersChange = (e) => {
    setReceiverInput(e.target.value); // 입력값을 상태로 업데이트
  };

  // 추가 버튼 클릭 시 수신 번호 목록에 추가 및 TextArea 비활성화
  const handleAddReceiverNumber = () => {
    const newNumbers = receiverInput
      .split(',')
      .map((num) => num.trim().replace(/-/g, '')) // 공백 제거하고 '-'를 없앰
      .filter((num) => num !== '' && /^[0-9]+$/.test(num)); // 빈 문자열 및 숫자가 아닌 값 제거

    setReceiverNumbers(newNumbers); // 입력된 번호로 갱신
    setReceiverInput(''); // 입력 필드 초기화
    setIsReceiverInputDisabled(true); // TextArea 비활성화
  };

  // 수정 버튼 클릭 시 등록된 수신 번호 초기화하고 TextArea 활성화
  const handleEditReceiverNumbers = () => {
    setReceiverNumbers([]); // 등록된 수신 번호 초기화
    setReceiverInput(''); // TextArea 초기화
    setIsReceiverInputDisabled(false); // TextArea 활성화
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
        <Form.Item label={<span className="korean-font">수신 번호</span>} name="receiverNumbers">
          <TextArea
            style={{ height: '120px', resize: 'none' }}
            placeholder="수신 번호를 쉼표(,)로 구분하여 입력"
            value={receiverInput} // `receiverInput`을 `value`로 사용
            onChange={handleReceiverNumbersChange} // 입력 필드 변화 감지
            disabled={isReceiverInputDisabled} // 추가 버튼 클릭 후 비활성화
          />
        </Form.Item>

        <Row gutter={[16, 16]} style={{ marginTop: '-10px' }}>
          <Col span={12}>
            <Button
              type="primary"
              block
              onClick={handleAddReceiverNumber} // 추가 버튼 클릭 시
            >
              추가
            </Button>
          </Col>
          <Col span={12}>
            <Button
              type="default"
              block
              onClick={handleEditReceiverNumbers} // 수정 버튼 클릭 시
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
