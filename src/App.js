import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar, Nav, Container, Form, Button, Row, Col } from 'react-bootstrap';
import MessageMain from './MessageMain';
import Signup from './Signup';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리

  return (
    <Router>
      <div className="app">
        <Navbar bg="light" expand="lg" className="navbar">
          <Container>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ml-auto">
                <Nav.Link href="/">Home</Nav.Link>
                {/* 로그인 상태에 따라 Message 메뉴 비활성화 */}
                <Nav.Link href="/MessageMain" disabled={!isLoggedIn}>Message</Nav.Link>
                <Nav.Link href="/Signup">Signup</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Routes>
          <Route path="/" element={<HomePage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/MessageMain" element={<MessageMain />} />
          <Route path="/Signup" element={<Signup />} />
        </Routes>

        <footer className="footer mt-auto py-3 bg-light">
          <Container>
            <p className="text-center">2024 SW Pre-Capstone Project | Hansung University</p>
          </Container>
        </footer>
      </div>
    </Router>
  );
}

function HomePage({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    const loginData = { username, password };

    console.log('전송 데이터:', loginData);

    try {
      const response = await fetch('http://3.35.137.214:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }

      // 응답 처리
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        console.log('로그인 성공(JSON):', result);
        alert(result.message || '로그인 성공!');
        setIsLoggedIn(true); // 로그인 성공 시 로그인 상태 변경
      } else {
        const textResult = await response.text();
        console.log('로그인 성공(텍스트):', textResult);
        alert(textResult || '로그인 성공!');
        setIsLoggedIn(true); // 로그인 성공 시 로그인 상태 변경
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('로그인 실패! 아이디와 비밀번호를 확인하세요.');
    }
  };

  return (
    <div className="main-content" style={{ backgroundColor: '#f7f7f7', padding: '40px 0' }}>
      <Container>
        <Row className="d-flex justify-content-start align-items-center">
          <Col md={3}>
            <div className="login-section">
              <h3 className="mb-4">Login</h3>
              <Form onSubmit={handleLogin}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>ID</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter ID"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="mt-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <div className="d-grid gap-2 mt-4">
                  <Button variant="primary" type="submit">
                    Login
                  </Button>
                </div>
              </Form>
            </div>
          </Col>

          <Col md={1}>
            <div className="divider"></div>
          </Col>

          <Col md={7} className="d-flex flex-column justify-content-center align-items-start">
            <h1 className="mb-4">Imokase, the largest text messaging site in Korea</h1>
            <p className="lead">
              We generate AI-powered images that match your desired text. Deliver your message effectively with Imokase!
            </p>
            <div className="ad-titlebox">
              <br />
              <p className="do-hyeon-font">이모카세와 함께하세요!</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
