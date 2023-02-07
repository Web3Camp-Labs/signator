import React from 'react';
import styled from "styled-components";
import HeaderTop from "./components/headTop";
import FooterBox from "./components/footerBox";
import GlobalStyle from "./utils/GloablStyle";
import {ContextProvider} from "./api/connect";
import Main from "./components/Main";
import Header2 from "./components/headT2";

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  .liBox,.li{
    margin-bottom: 40px;
  }
`

function App() {

  return (
      <ContextProvider>
          <div>
            <MainContent>
              <HeaderTop />
              <Header2 />
                <Main />
              <FooterBox />
            </MainContent>
            <GlobalStyle />
          </div>
      </ContextProvider>
  );
}

export default App;
