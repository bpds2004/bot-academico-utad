import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import { fuse } from "../data/fuse";
import Loader from "./Loader.jsx";
import BotaoEnviar from "./BotaoEnviar";
import CaixaTexto from "./CaixaTexto";
import MenuInicial from "./MenuInicial";

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(to right top, #d8f3dc, #f0fff4);
  display: flex;
  align-items: stretch;
  justify-content: center;
  padding: 1rem;
`;

const AppShell = styled.div`
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Header = styled.header`
  width: 100%;
  min-height: 76px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 1.1rem;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(47, 133, 90, 0.18);
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(34, 84, 61, 0.12);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  min-width: 0;
`;

const Logo = styled.img`
  width: 56px;
  height: 56px;
  object-fit: contain;
  flex: 0 0 auto;
`;

const BrandText = styled.div`
  min-width: 0;
`;

const BrandName = styled.p`
  color: #14532d;
  font-size: 1.15rem;
  font-weight: 850;
  margin: 0;
`;

const UserName = styled.p`
  color: #4a6f55;
  font-size: 0.92rem;
  font-weight: 650;
  margin: 0.15rem 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.65rem;
  flex-wrap: wrap;
`;

const HeaderButton = styled.button`
  border: 1px solid #b7d9c2;
  border-radius: 8px;
  background: ${(props) => (props.$primary ? "#166534" : "#f5fff7")};
  color: ${(props) => (props.$primary ? "#ffffff" : "#14532d")};
  padding: 0.72rem 1rem;
  min-width: 92px;
  font: inherit;
  font-weight: 800;
  cursor: pointer;

  &:hover {
    background: ${(props) => (props.$primary ? "#14532d" : "#e8f5ec")};
  }
`;

const ChatBox = styled.div`
  background: rgba(255, 255, 255, 0.44);
  border-radius: 8px;
  padding: 24px;
  width: 100%;
  min-height: calc(100vh - 124px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 8px 32px 0 rgba(31, 80, 54, 0.16);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(47, 133, 90, 0.2);
  color: #111;
  font-family: 'Inter', sans-serif;
  box-sizing: border-box;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 1rem;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  animation: floatTitle 2.5s ease-in-out infinite;

  .gradient-title {
    background: linear-gradient(270deg, #2f855a, #166534, #2f855a);
    background-size: 200% 200%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    display: inline;
    animation: gradientMove 3s ease-in-out infinite;
  }

  @keyframes gradientMove {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes floatTitle {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-16px); }
    100% { transform: translateY(0px); }
  }
`;

const Mensagens = styled.div`
  flex-grow: 1;
  background: rgba(255, 255, 255, 0.36);
  padding: 1rem;
  border: 2px solid rgba(47, 133, 90, 0.16);
  overflow-y: auto;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  margin-bottom: 12px;
`;

const Linha = styled.div`
  margin-bottom: 12px;
  display: flex;
  justify-content: ${(props) => (props.de === "tu" ? "flex-end" : "flex-start")};
`;

const Bolha = styled.span`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: ${(props) =>
    props.de === "tu" ? "16px 16px 0 16px" : "16px 16px 16px 0"};
  background: ${(props) =>
    props.de === "tu" ? "rgba(47, 133, 90, 0.2)" : "rgba(255, 255, 255, 0.46)"};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(47, 133, 90, 0.14);
  color: #111;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 1.05rem;
  line-height: 1.6;
  letter-spacing: 0.01em;
  animation: aparecer 0.3s ease;
  font-family: 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 500;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
`;

const InputArea = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 12px;
  border: 2px solid rgba(47, 133, 90, 0.16);
`;

function Chat({ user, onProfile, onLogout }) {
  const [mensagens, setMensagens] = useState([]);
  const [input, setInput] = useState("");
  const mensagensEndRef = useRef(null);

  useEffect(() => {
    mensagensEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  useEffect(() => {
    setMensagens([{ de: "bot", texto: "__LOADING__" }]);

    const timer = setTimeout(() => {
      setMensagens([
        {
          de: "bot",
          texto:
            "Ola! Sou o Chatbot Academico da UTAD. Podes perguntar-me sobre faltas, melhorias, exames, inscricoes e muito mais!",
        },
      ]);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const responder = (texto) => {
    const resultado = fuse.search(texto);
    return resultado.length > 0
      ? resultado[0].item.texto
      : "Desculpa, nao encontrei uma resposta para isso. Tenta reformular a pergunta.";
  };

  const enviarMensagem = (texto) => {
    const pergunta = texto.trim();
    if (!pergunta) return;

    setMensagens((prev) => [...prev, { de: "tu", texto: pergunta }, { de: "bot", texto: "__LOADING__" }]);
    setInput("");

    setTimeout(() => {
      const resposta = responder(pergunta);
      setMensagens((prev) => {
        const novas = [...prev];
        novas[novas.length - 1] = { de: "bot", texto: resposta };
        return novas;
      });
    }, 1000);
  };

  const handleSend = () => enviarMensagem(input);

  return (
    <Container>
      <AppShell>
        <Header>
          <Brand>
            <Logo src="/img.png" alt="Logo Chatbot Academico UTAD" />
            <BrandText>
              <BrandName>Chatbot Academico UTAD</BrandName>
              <UserName>{user?.nome}</UserName>
            </BrandText>
          </Brand>
          <HeaderActions>
            <HeaderButton type="button" onClick={onProfile}>Perfil</HeaderButton>
            <HeaderButton type="button" $primary onClick={onLogout}>Logout</HeaderButton>
          </HeaderActions>
        </Header>

        <ChatBox>
          <Title>
            <img src="/img.png" alt="chapeu" style={{
              width: "32px",
              height: "32px",
              verticalAlign: "middle",
              marginRight: "10px",
              animation: "float 2.5s ease-in-out infinite"
            }} />
            <span className="gradient-title">Chatbot Academico UTAD</span>
          </Title>

          <Mensagens style={{ fontFamily: "'Inter', 'Segoe UI', 'Roboto', Arial, sans-serif" }}>
            {mensagens.map((msg, i) => (
              <Linha key={i} de={msg.de}>
                {msg.texto === "__LOADING__" ? (
                  <Loader />
                ) : (
                  <Bolha de={msg.de}>
                    {i === 0 && msg.de === "bot" ? (
                      <MenuInicial onPerguntar={enviarMensagem} />
                    ) : (
                      <ReactMarkdown
                        components={{
                          p: ({ ...props }) => (
                            <span style={{ fontFamily: "'Inter', 'Segoe UI', 'Roboto', Arial, sans-serif" }} {...props} />
                          ),
                          strong: ({ ...props }) => (
                            <strong style={{ fontWeight: 700 }} {...props} />
                          ),
                        }}
                      >
                        {msg.texto}
                      </ReactMarkdown>
                    )}
                  </Bolha>
                )}
              </Linha>
            ))}
            <div ref={mensagensEndRef} />
          </Mensagens>
          <InputArea>
            <CaixaTexto
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              style={{ fontFamily: "'Inter', 'Segoe UI', 'Roboto', Arial, sans-serif" }}
            />
            <BotaoEnviar onClick={handleSend} />
          </InputArea>
        </ChatBox>
      </AppShell>
    </Container>
  );
}

export default Chat;
