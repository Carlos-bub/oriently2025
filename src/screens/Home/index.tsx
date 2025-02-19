
import { 
  Container,
  Header,
  UserWrapper,
  UserInfo,
  UserIcon,
  HeaderTextWrapper,
  Greenting,
  Hello,
  LogoutButton,
  LogoutIcon
} from './styles';

export function Home() {
  return (
    <Container>
      <Header> 
        <UserWrapper>
          <UserInfo>
            <UserIcon name = 'user-circle' >
              
            </UserIcon>
            <HeaderTextWrapper>
              <Greenting>
                Olá
              </Greenting>
              <Hello>
                Usuário
              </Hello>
            </HeaderTextWrapper>
          </UserInfo>
          <LogoutButton>
            <LogoutIcon name = 'logout'>

            </LogoutIcon>
          </LogoutButton>
        </UserWrapper>
      </Header> 
    </Container>
  );
}

