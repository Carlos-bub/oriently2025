import React, { useState } from "react";
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
  TimeContainer, 
  FontAwesome, 
  ScheduleTime, 
  ScheduleItem, 
  ScheduleText, 
  RemoveButton, 
  Divider 
} from "./styles";
import { RFValue } from "react-native-responsive-fontsize";
import theme from "src/global/styles/theme";

const scheduleData = [
  {
    date: '22/07/2024',
    appointments: [
      { id: "1", time: "13:00", name: "João Souza", description: "Orientação 1" },
      { id: "2", time: "14:00", name: "João Souza", description: "Orientação 2" },
    ],
  },
  {
    date: '21/07/2025', 
    appointments: [
      { id: "3", time: "10:00", name: "João Souza", description: "Orientação 3" },
    ],
  },
];

const isPastDate = (dateString: string) => {
  const [day, month, year] = dateString.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  return date < new Date();
};

const isPastTime = (dateString: string, timeString: string) => {
  const [day, month, year] = dateString.split('/').map(Number);
  const [hours, minutes] = timeString.split(':').map(Number);
  const dateTime = new Date(year, month - 1, day, hours, minutes);
  return dateTime < new Date();
};

export function Profile() {

  const [schedules, setSchedules] = useState(scheduleData);

  const handleRemoveAppointment = (appointmentId: string) => {
    const updatedSchedules = schedules
      .map(dateGroup => ({
        ...dateGroup,
        appointments: dateGroup.appointments.filter(app => app.id !== appointmentId)
      }))
      .filter(dateGroup => dateGroup.appointments.length > 0); 

    setSchedules(updatedSchedules);
  };

  return (
    <Container>
      <Header>
        <Title>
          Sua agenda
        </Title>
        <Subtitle>
          Aqui você pode ver todos os Agendamentos
        </Subtitle>
      </Header>

      <FlatList
        data={schedules}
        keyExtractor={(item) => item.date}
        contentContainerStyle={{ paddingBottom: RFValue(20) }}
        renderItem={({ item }) => (
          <ScheduleCard past={isPastDate(item.date)}>
            <DateBox past={isPastDate(item.date)}>
              <IconBox 
                name="calendar" 
                past={isPastDate(item.date)}
              />
              <DateText past={isPastDate(item.date)}>
                {item.date}
              </DateText>
            </DateBox>

            <FlatList
              data={item.appointments}
              keyExtractor={(appointment) => appointment.id}
              renderItem={({ item: appointment }) => {
                const past = isPastTime(item.date, appointment.time);
                return (
                  <>
                    <ScheduleItem past={past}>
                      <TimeContainer>
                        <ScheduleTime past={past}>
                          {appointment.time}
                        </ScheduleTime>
                        {past && (
                          <FontAwesome 
                            name="exclamation-circle" 
                            size={RFValue(12)} 
                            color={theme.colors.cancel} 
                          />
                        )}
                      </TimeContainer>
                      <ScheduleText past={past}>
                        {appointment.name}
                      </ScheduleText>
                      <ScheduleText past={past}>
                        {appointment.description}
                      </ScheduleText>
                      {!past && 
                      <RemoveButton onPress={() => handleRemoveAppointment(appointment.id)}
                        >Remover agendamento
                      </RemoveButton>}
                    </ScheduleItem>
                    <Divider />
                  </>
                );
              }}
            />
          </ScheduleCard>
        )}
      />
    </Container>
  );
}
