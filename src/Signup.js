import React from 'react';
import { Form, Input, Button, Typography, message, Layout } from 'antd';
import './Signup.css'; // 스타일 파일은 필요에 맞게 적용

const { Title } = Typography;
const { Content } = Layout;

const Signup = () => {
  const handleSignup = async (values) => {
    console.log('보낼 데이터:', values);
    try {
      const response = await fetch('http://34.47.70.206:8080/api/auth/signUp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: '*/*',
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });

      console.log('서버 응답 상태 코드:', response.status);
      if (response.ok) {
        message.success('회원가입이 완료되었습니다!');
      } else {
        const errorData = await response.json();
        message.error(`회원가입 실패: ${errorData.message || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('요청 중 오류 발생:', error);
    }
  };

  return (
    <Layout className="signup-layout">
      <Content>
        <div className="signup-container">
          <p className="title-font">회원가입</p>
          <Form onFinish={handleSignup}>
            <Form.Item
              name="username"
              label="이름"
              rules={[{ required: true, message: '이름을 입력하세요!' }]}
            >
              <Input placeholder="이름" />
            </Form.Item>

            <Form.Item
              name="password"
              label="비밀번호"
              rules={[
                { required: true, message: '비밀번호를 입력하세요!' },
                { min: 3, message: '비밀번호는 3자 이상이여야 합니다!' },
              ]}
            >
              <Input.Password placeholder="비밀번호" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="signup-button">
                Sign up
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
};

export default Signup;
