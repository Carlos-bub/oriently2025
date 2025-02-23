import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Container, ScheduleList, ScheduleItem, ScheduleText, ScheduleListWrapper, Title, TitleWrapper, CalendarWrapper } from './styles';

export function Schedule() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);;

  // Simula horários disponíveis (substituir por dados reais do backend)
  const hours = ['15:00', '16:00', '18:00', '15:00', '16:00', '18:00', '15:00', '16:00', '18:00'];

  function handleDateSelect(day: string) {
    setSelectedDate(day);
  }

  return (
    <Container>
      <TitleWrapper>
        <Title>Selecione uma data</Title>
      </TitleWrapper>
      <CalendarWrapper>
        <Calendar
          onDayPress={(day: { dateString: string; }) => handleDateSelect(day.dateString)}
          markedDates={{
            [selectedDate || '']: { selected: true, selectedColor: '#6200ee' },
          }}
        />
      </CalendarWrapper>

      {selectedDate && (
        <>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20, color: '#258BFF' }}>
            Horários para {format(new Date(selectedDate), 'dd/MM/yyyy')}
          </Text>
          <ScheduleListWrapper>
            <ScheduleList
              data={hours}
              keyExtractor={(item: any, index: any) => String(index)}
              numColumns={3} 
              renderItem={({ item }) => (
            <ScheduleItem
              isSelected={selectedHour === item}
              onPress={() => setSelectedHour(item)}
            >
            <ScheduleText>{item}</ScheduleText>
            </ScheduleItem>
              )}
            />
         </ScheduleListWrapper>
        </>
      )}
    </Container>
  );
}
