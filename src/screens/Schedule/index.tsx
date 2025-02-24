import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { format } from 'date-fns';

import { 
  Container, 
  ScheduleList, 
  ScheduleItem, 
  ScheduleText, 
  ScheduleListWrapper, 
  Title, 
  TitleWrapper, 
  CalendarWrapper,
  ModalOverlay,
  ModalContent,
  ModalText,
  ModalButtonContainer,
  ModalButton,
  ModalButtonText 
} from './styles';
import { Modal, TouchableOpacity } from 'react-native';

export function Schedule() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);;
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleConfirm = () => {
    if (selectedDate && selectedHour) {
      
      console.log('Reserva confirmada:', selectedDate, selectedHour);
      setShowConfirmationModal(false);
      setSelectedHour(null); 
    }
  };

  const hours = ['15:00', '16:00', '18:00', '15:00', '16:00', '18:00', '15:00', '16:00', '18:00'];

  function handleDateSelect(day: string) {
    setSelectedDate(day);
  }

  return (
    <Container>
      <TitleWrapper>
        <Title>
          Selecione uma data
        </Title>
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
                onPress={() => {
                  setSelectedHour(item);
                  setShowConfirmationModal(true);
                }}
              >
                <ScheduleText>{item}</ScheduleText>
                </ScheduleItem>
              )}
            />
         </ScheduleListWrapper>
        </>
      )}

      <Modal
        visible={showConfirmationModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConfirmationModal(false)}
      >
        <ModalOverlay>
          <ModalContent>
            <ModalText>
              Confirmar reserva para {'\n'}
              {format(new Date(selectedDate!), 'dd/MM/yyyy')} às {selectedHour}?
            </ModalText>
            
            <ModalButtonContainer>
              <ModalButton isConfirm onPress={handleConfirm}>
                <ModalButtonText>Confirmar</ModalButtonText>
              </ModalButton>
              
              <ModalButton onPress={() => setShowConfirmationModal(false)}>
                <ModalButtonText>Cancelar</ModalButtonText>
              </ModalButton>
            </ModalButtonContainer>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Container>
  );
}
