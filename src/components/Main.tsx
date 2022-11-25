import {Button, Card, Col, Container, FloatingLabel, Form, Row} from "react-bootstrap";
import React, {ChangeEvent, useState} from "react";
import styled from "styled-components";
import {useWeb3} from "../api/connect";
import { ethers } from  'ethers';


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
  align-items: center;
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

const BtnBr = styled(Button)`
    margin-left: 20px;
  border: 1px solid #000;
  background: #fff;
  color: #000000;
`

export default function Main(){
    const {state} = useWeb3();
    const { web3Provider,account } = state;

    const [message,setMessage] = useState('');
    const [signature,setSignature] = useState('');
    const [hashMessage,setHashMessage] = useState('hashMessage');

    const handleInput = (e:ChangeEvent) => {
        const { name,value } = e.target as HTMLInputElement;

        switch (name){
            case 'message':
                setMessage(value);
                break;
            case 'hashMessage':
                console.log(value)
                if(value==='hashMessage'){
                    setHashMessage('');
                }else{
                    setHashMessage('hashMessage');
                }

                break;
        }
    }

    const signMessage = async() => {
        setSignature('');

        let msg;
        if (hashMessage) {
            msg = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(message));
        }else{
            msg = message;
        }
        const _signature = await web3Provider.send("personal_sign", [msg, account]);
        setSignature(_signature)
    };

    const addTime = () =>{
        const _date = new Date();
        setMessage(`${_date.toLocaleString()}: ${message}`);
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
                                name='message'
                                placeholder="Message"
                                value={message}
                                onChange={(e)=>handleInput(e)}
                            />
                        </FloatingLabel>
                    </Col>
                </CenterBox>
                <CenterBox>
                    <Form.Check
                        type='checkbox'
                        label='Hash message'
                        name='hashMessage'
                        checked={hashMessage==='hashMessage'}
                        value={hashMessage}
                        onChange={(e)=>handleInput(e)}
                    />
                    <BtnBr variant="flat" onClick={()=>addTime()}>Add time</BtnBr>
                </CenterBox>
                <CenterBox>
                    <Button variant="flat" onClick={()=>signMessage()}>Sign</Button>
                </CenterBox>
                <CenterBox>
                    <Col  md={8} xs={12}>
                        <GrayBox>
                            {signature}
                        </GrayBox>
                    </Col>
                </CenterBox>
            </CardBox>
        </Row>


    </ContentBox>
}