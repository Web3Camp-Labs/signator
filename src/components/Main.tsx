import {Button, Card, Col, Container, FloatingLabel, Form, Row} from "react-bootstrap";
import React, {ChangeEvent, useState} from "react";
import styled from "styled-components";
import {useWeb3} from "../api/connect";
import { ethers } from  'ethers';
import chainJSON  from "../api/chains.json";

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
  margin-bottom: 20px;
  .textareaBox{
    height: 200px;
  }
  .li{
    margin-right: 20px;
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

    const [message,setMessage] = useState<any>('');
    const [type,setType] = useState('message');
    const [signature,setSignature] = useState('');
    const [hashMessage,setHashMessage] = useState('hashMessage');

    const eip712Example = {
        types: {
            Greeting: [
                {
                    name: "salutation",
                    type: "string",
                },
                {
                    name: "target",
                    type: "string",
                },
                {
                    name: "born",
                    type: "int32",
                },
            ],
        },
        message: {
            salutation: "Hello",
            target: "Ethereum",
            born: 2015,
        },
    };


    const handleInput = (e:ChangeEvent) => {
        const { name,value } = e.target as HTMLInputElement;
        switch (name){
            case 'message':
                setMessage(value);
                break;
            case 'type':
                setType(value);
                if(value === 'typedData'){
                    setMessage(JSON.stringify(eip712Example,null,4));
                    setSignature('');
                }else{
                    setSignature('');
                    setMessage('');
                }
                break;
            case 'hashMessage':
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

        if(type === 'message'){
            let msg;
            if (hashMessage) {
                msg = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(message));
            }else{
                msg = message;
            }
            const _signature = await web3Provider.send("personal_sign", [msg, account]);
            setSignature(_signature);
        }else{
            let signer = web3Provider.getSigner(account);
            const { chainId }= await web3Provider.getNetwork();
            const chainObj = chainJSON.filter(i=>i.chainId === chainId);
            const messageObj = JSON.parse(message);
            console.log(chainObj[0].chainId)
            let domain = {
                name:chainObj[0].name,
                chainId:chainObj[0].chainId
            }
            if(chainObj[0] && messageObj){
                const _signature = await signer._signTypedData(domain, messageObj.types, messageObj.message);
                setSignature(_signature);
            }
        }






    };

    const addTime = () =>{
        const _date = new Date();
        setMessage(`${_date.toLocaleString()}: ${message}`);
    }

    const isJSON = (str:string) =>{
        try {
            JSON.parse(str);
            return true;

        } catch(e) {
            return false;
        }

    }

    const prettify = () =>{
        let beforeStr = JSON.parse(message);
        setMessage(JSON.stringify(beforeStr,null,4))
    }

    const reset = () =>{
        setMessage(JSON.stringify(eip712Example,null,4))
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
                    <div className="li">
                        <Form.Check
                            type='radio'
                            label='Message'
                            name='type'
                            checked={type==='message'}
                            value='message'
                            onChange={(e)=>handleInput(e)}
                        />
                    </div>
                    <div className="li">
                        <Form.Check
                            type='radio'
                            label='Typed Data'
                            name='type'
                            checked={type==='typedData'}
                            value='typedData'
                            onChange={(e)=>handleInput(e)}
                        />
                    </div>

                </CenterBox>
                {
                    type === 'message' && <CenterBox>
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
                }
                {
                    type === 'typedData' &&<CenterBox>
                        <BtnBr variant="flat" onClick={()=>prettify()} disabled={!isJSON(message)}>Prettify</BtnBr>
                        <BtnBr variant="flat" onClick={()=>reset()}>Reset</BtnBr>
                    </CenterBox>
                }

                <CenterBox>
                    {
                        !!message?.length &&!isJSON(message) && <div>Invalid Json</div>
                    }
                </CenterBox>


                <CenterBox>
                    <Button variant="flat" onClick={()=>signMessage()} disabled={!isJSON(message)}>Sign</Button>
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