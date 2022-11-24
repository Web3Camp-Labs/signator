import {Button, Card, Col, Container, FloatingLabel, Form, Row} from "react-bootstrap";
import React, {ChangeEvent, useState} from "react";
import styled from "styled-components";
const ContentBox = styled(Container)`
    margin: 40px auto;
`
const CardBox = styled(Card)`
  border:0;
  box-shadow: 0 0 5px #ccc;
  border-radius: 6px;
  padding: 40px;
`

const CenterBox = styled.div`
    display: flex;
  justify-content: center;
  margin-bottom: 40px;
  .textareaBox{
    height: 200px;
  }
`

const GrayBox = styled.div`
    width: 100%;
    background: #f7f7f7;
  padding: 40px 20px;
  border-radius: 6px;
`

export default function Main(){
    const [address,setAddress] = useState('');
    const handleInput = (e:ChangeEvent) => {
        const { value } = e.target as HTMLInputElement;
        setAddress(value);
    }

    return <ContentBox>
        <Row>
            <CardBox body>
                <CenterBox>
                    <Col  md={8} xs={12}>
                        <FloatingLabel
                            controlId="Address"
                            label="Message"
                            className="mb-3"
                        >
                            <Form.Control
                                as="textarea"
                                className="textareaBox"
                                name='token'
                                placeholder="Message"
                                value={address}
                                onChange={(e)=>handleInput(e)}
                            />
                        </FloatingLabel>
                    </Col>
                </CenterBox>
                <CenterBox>
                    <Button variant="flat">Sign</Button>
                </CenterBox>
                <CenterBox>
                    <Col  md={8} xs={12}>
                        <GrayBox>
                            dd
                        </GrayBox>
                    </Col>
                </CenterBox>
            </CardBox>
        </Row>


    </ContentBox>
}