import React from "react";
import { FlatList } from "react-native";
import { 
  Container, 
  Header, 
  Title, 
  Subtitle, 
  DateBox, 
  DateText, 
  IconBox, 
  ScheduleCard, 
  ScheduleHeader, 
  ScheduleTitle, 
  ScheduleTime, 
  ScheduleItem, 
  ScheduleText, 
  RemoveButton, 
  Divider 
} from "./styles";

const appointments = [
  { id: "1", time: "13:00", name: "João Souza", description: "Orientação 1" },
  { id: "2", time: "14:00", name: "João Souza", description: "Orientação 2" },
  { id: "3", time: "15:00", name: "João Souza", description: "Orientação 3" },
];

export function Profile() {
  return (
    <Container>
    
      <Header>
        <Title>
          Sua agenda
        </Title>
        <Subtitle>
          Aqui você pode ver todos os Agendamentos
        </Subtitle>

        <DateBox>
          <IconBox name= "calendar" >
          </IconBox>
          <DateText>
            22/07/2024
          </DateText>
        </DateBox>
      </Header>

      <ScheduleCard>
        <ScheduleHeader>
          <ScheduleTitle>
            Horários
          </ScheduleTitle>
          <ScheduleTime>
            13h-18h
          </ScheduleTime>
        </ScheduleHeader>

        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <>
              <ScheduleItem>
                <ScheduleText>
                  <ScheduleTime>{item.time}</ScheduleTime> {item.name}
                </ScheduleText>
                <ScheduleText>{item.description}</ScheduleText>
                <RemoveButton>Remover agendamento</RemoveButton>
              </ScheduleItem>
              <Divider />
            </>
          )}
        />
      </ScheduleCard>
    </Container>
  );
}
