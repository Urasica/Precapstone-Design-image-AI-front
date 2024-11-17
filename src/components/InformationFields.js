import React from 'react';
import { Card, Form, Input } from 'antd';

const { TextArea } = Input;

const InformationFields = ({ senderNumber, setSenderNumber, receiverNumbers, setReceiverNumbers }) => (
  <Card title="발신 및 수신 번호" bordered={true} style={{ borderRadius: 10, margin: '0px', marginTop: '-30px' }} className="korean-font">
    <Form layout="vertical">
      <Form.Item label={<span className="korean-font">발신 번호</span>} name="senderNumber">
        <Input
          placeholder="발신 번호 입력"
          value={senderNumber}
          onChange={(e) => setSenderNumber(e.target.value)}
        />
      </Form.Item>
      <Form.Item label={<span className="korean-font">수신 번호 입력</span>} name="receiverNumbers">
        <TextArea
          style={{ height: '120px', resize: 'none' }}
          placeholder="수신 번호 입력"
          value={receiverNumbers}
          onChange={(e) => setReceiverNumbers(e.target.value)}
        />
      </Form.Item>
    </Form>
  </Card>
);

export default InformationFields;
