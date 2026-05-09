import { useEffect, useState } from "react";
import styled from "styled-components";
import Chat from "./components/Chat.jsx";

const DEFAULT_USER = {
  nome: "Utilizador UTAD",
  email: "utilizador@utad.pt",
};

const Page = styled.main`
  min-height: 100vh;
  background: linear-gradient(to right top, #d8f3dc, #f0fff4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  font-family: 'Inter', 'Segoe UI', 'Roboto', Arial, sans-serif;
`;

const Panel = styled.section`
  width: min(100%, 460px);
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(47, 133, 90, 0.18);
  border-radius: 8px;
  box-shadow: 0 18px 48px rgba(34, 84, 61, 0.16);
  padding: 2rem;
`;

const LogoBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-bottom: 1.6rem;
`;

const Logo = styled.img`
  width: 52px;
  height: 52px;
  object-fit: contain;
`;

const Title = styled.h1`
  color: #14532d;
  font-size: 1.55rem;
  margin: 0;
`;

const Text = styled.p`
  color: #386641;
  margin: 0.35rem 0 0;
`;

const Form = styled.form`
  display: grid;
  gap: 1rem;
`;

const Label = styled.label`
  color: #18392b;
  font-weight: 700;
  display: grid;
  gap: 0.4rem;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #b7d9c2;
  border-radius: 8px;
  padding: 0.85rem 1rem;
  font: inherit;
  color: #10291f;
  background: #ffffff;

  &:focus {
    outline: 3px solid rgba(34, 197, 94, 0.22);
    border-color: #2f855a;
  }
`;

const Button = styled.button`
  border: none;
  border-radius: 8px;
  padding: 0.9rem 1rem;
  background: #166534;
  color: white;
  font-weight: 800;
  font: inherit;
  cursor: pointer;

  &:hover {
    background: #14532d;
  }
`;

const SecondaryButton = styled(Button)`
  background: #e8f5ec;
  color: #14532d;
  border: 1px solid #b7d9c2;

  &:hover {
    background: #d8f3dc;
  }
`;

const Message = styled.p`
  color: ${(props) => (props.$error ? "#b91c1c" : "#166534")};
  font-weight: 700;
  margin: 0;
`;

const ProfileInfo = styled.div`
  display: grid;
  gap: 0.85rem;
  margin-bottom: 1.5rem;
`;

const InfoRow = styled.div`
  background: #f5fff7;
  border: 1px solid #d4eadb;
  border-radius: 8px;
  padding: 0.9rem 1rem;
`;

const InfoLabel = styled.span`
  color: #52705d;
  display: block;
  font-size: 0.88rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
`;

function getStoredUser() {
  const stored = localStorage.getItem("chatbotUser");
  return stored ? JSON.parse(stored) : null;
}

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("login");
  const [loginForm, setLoginForm] = useState(DEFAULT_USER);
  const [password, setPassword] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordForm, setPasswordForm] = useState({ atual: "", nova: "", confirmar: "" });

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
      setView("chat");
    }
  }, []);

  const handleLogin = (event) => {
    event.preventDefault();

    const nextUser = {
      nome: loginForm.nome.trim() || DEFAULT_USER.nome,
      email: loginForm.email.trim() || DEFAULT_USER.email,
    };

    localStorage.setItem("chatbotUser", JSON.stringify(nextUser));
    localStorage.setItem("chatbotPassword", password || "1234");
    setUser(nextUser);
    setView("chat");
  };

  const handleLogout = () => {
    localStorage.removeItem("chatbotUser");
    setUser(null);
    setPassword("");
    setProfileMessage("");
    setProfileError("");
    setPasswordForm({ atual: "", nova: "", confirmar: "" });
    setView("login");
  };

  const handlePasswordChange = (event) => {
    event.preventDefault();
    setProfileMessage("");
    setProfileError("");

    const storedPassword = localStorage.getItem("chatbotPassword") || "1234";

    if (passwordForm.atual !== storedPassword) {
      setProfileError("A password atual nao esta correta.");
      return;
    }

    if (passwordForm.nova.length < 4) {
      setProfileError("A nova password deve ter pelo menos 4 caracteres.");
      return;
    }

    if (passwordForm.nova !== passwordForm.confirmar) {
      setProfileError("A confirmacao nao corresponde a nova password.");
      return;
    }

    localStorage.setItem("chatbotPassword", passwordForm.nova);
    setPasswordForm({ atual: "", nova: "", confirmar: "" });
    setProfileMessage("Password alterada com sucesso.");
  };

  if (!user || view === "login") {
    return (
      <Page>
        <Panel>
          <LogoBlock>
            <Logo src="/img.png" alt="Logo Chatbot Academico UTAD" />
            <div>
              <Title>Chatbot Academico UTAD</Title>
              <Text>Entra para continuar.</Text>
            </div>
          </LogoBlock>

          <Form onSubmit={handleLogin}>
            <Label>
              Nome
              <Input
                value={loginForm.nome}
                onChange={(event) => setLoginForm((current) => ({ ...current, nome: event.target.value }))}
                placeholder="O teu nome"
              />
            </Label>
            <Label>
              Email
              <Input
                type="email"
                value={loginForm.email}
                onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
                placeholder="email@utad.pt"
              />
            </Label>
            <Label>
              Password
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
              />
            </Label>
            <Button type="submit">Login</Button>
          </Form>
        </Panel>
      </Page>
    );
  }

  if (view === "profile") {
    return (
      <Page>
        <Panel>
          <LogoBlock>
            <Logo src="/img.png" alt="Logo Chatbot Academico UTAD" />
            <div>
              <Title>Perfil</Title>
              <Text>Dados da conta</Text>
            </div>
          </LogoBlock>

          <ProfileInfo>
            <InfoRow>
              <InfoLabel>Nome</InfoLabel>
              {user.nome}
            </InfoRow>
            <InfoRow>
              <InfoLabel>Email</InfoLabel>
              {user.email}
            </InfoRow>
          </ProfileInfo>

          <Form onSubmit={handlePasswordChange}>
            <Label>
              Password atual
              <Input
                type="password"
                value={passwordForm.atual}
                onChange={(event) => setPasswordForm((current) => ({ ...current, atual: event.target.value }))}
              />
            </Label>
            <Label>
              Nova password
              <Input
                type="password"
                value={passwordForm.nova}
                onChange={(event) => setPasswordForm((current) => ({ ...current, nova: event.target.value }))}
              />
            </Label>
            <Label>
              Confirmar nova password
              <Input
                type="password"
                value={passwordForm.confirmar}
                onChange={(event) => setPasswordForm((current) => ({ ...current, confirmar: event.target.value }))}
              />
            </Label>
            {profileError && <Message $error>{profileError}</Message>}
            {profileMessage && <Message>{profileMessage}</Message>}
            <Button type="submit">Alterar password</Button>
            <SecondaryButton type="button" onClick={() => setView("chat")}>Voltar ao chatbot</SecondaryButton>
          </Form>
        </Panel>
      </Page>
    );
  }

  return <Chat user={user} onProfile={() => setView("profile")} onLogout={handleLogout} />;
}

export default App;
