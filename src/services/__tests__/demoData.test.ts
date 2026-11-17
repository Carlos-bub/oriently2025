import test from "node:test";
import assert from "node:assert/strict";
import {
  setDemoModeActive,
  resetDemoStore,
  getDemoUserInfo,
  getDemoEventTypes,
  getDemoAvailableTimes,
  getDemoEvents,
  createDemoBooking,
  cancelDemoEvent,
} from "../demoData";

test("modo demo fornece dados fictícios navegáveis de orientador, eventos, agendamento e cancelamento", () => {
  setDemoModeActive(true);
  resetDemoStore("teste@example.com");

  const user = getDemoUserInfo();
  assert.ok(user.name.includes("Demo"));

  const types = getDemoEventTypes();
  assert.equal(types.length, 2);

  const initial = getDemoEvents();
  assert.equal(initial.activeEvents.length, 2);
  assert.equal(initial.pastEvents.length, 1);
  assert.equal(initial.missedEvents.length, 1);

  // Data futura (+10 dias) para garantir disponibilidade de horários
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 10);
  const dateStr = futureDate.toISOString().slice(0, 10);

  const slots = getDemoAvailableTimes(types[0].uri, dateStr);
  assert.ok(slots.length > 0);

  const chosenSlot = slots[0];
  const booking = createDemoBooking({
    eventTypeUri: types[0].uri,
    startTimeUtc: chosenSlot,
    idempotencyKey: "demo-key-1",
  });
  assert.equal(booking.success, true);
  assert.ok(booking.booking?.eventUri);

  // O horário reservado não deve mais aparecer como disponível
  const remainingSlots = getDemoAvailableTimes(types[0].uri, dateStr);
  assert.equal(remainingSlots.includes(chosenSlot), false);

  // A nova reunião deve aparecer em activeEvents
  const afterBooking = getDemoEvents();
  assert.equal(afterBooking.activeEvents.length, 3);

  // Cancelamento move a reunião para missedEvents
  const canceled = cancelDemoEvent(booking.booking!.eventUri);
  assert.equal(canceled.success, true);

  const afterCancel = getDemoEvents();
  assert.equal(afterCancel.activeEvents.length, 2);
  assert.equal(afterCancel.missedEvents.length, 2);

  setDemoModeActive(false);
});
