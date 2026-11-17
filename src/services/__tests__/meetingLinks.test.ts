import test from "node:test";
import assert from "node:assert/strict";
import {
  getValidVideoJoinUrl,
  getMeetingLocationLabel,
  getValidCalendlyActionUrl,
} from "../../utils/meetingLinks";

test("getValidVideoJoinUrl aceita URL HTTPS de videoconferência e rejeita URI do Calendly", () => {
  assert.equal(
    getValidVideoJoinUrl({
      location: {
        type: "google_conference",
        join_url: "https://meet.google.com/abc-defg-hij",
      },
    }),
    "https://meet.google.com/abc-defg-hij"
  );

  assert.equal(
    getValidVideoJoinUrl({
      location: {
        join_url: "https://api.calendly.com/scheduled_events/evt-123",
      },
    }),
    null
  );

  assert.equal(
    getValidVideoJoinUrl({
      location: {
        join_url: "http://meet.google.com/abc-defg-hij",
      },
    }),
    null
  );

  assert.equal(
    getValidVideoJoinUrl({
      location: {
        join_url: "not-a-valid-url",
      },
    }),
    null
  );
});

test("getMeetingLocationLabel não rotula URI do Calendly como Videoconferência", () => {
  assert.equal(
    getMeetingLocationLabel({
      location: {
        join_url: "https://api.calendly.com/scheduled_events/evt-123",
      },
    }),
    null
  );

  assert.equal(
    getMeetingLocationLabel({
      location: {
        type: "google_conference",
      },
    }),
    "Google Meet"
  );

  assert.equal(
    getMeetingLocationLabel({
      location: {
        join_url: "https://zoom.us/j/123456789",
      },
    }),
    "Videoconferência"
  );
});

test("getValidCalendlyActionUrl aceita apenas URLs HTTPS do domínio calendly.com", () => {
  assert.equal(
    getValidCalendlyActionUrl("https://calendly.com/cancellations/abc-123"),
    "https://calendly.com/cancellations/abc-123"
  );
  assert.equal(
    getValidCalendlyActionUrl("https://evil.example.com/cancel"),
    null
  );
  assert.equal(
    getValidCalendlyActionUrl("http://calendly.com/cancellations/abc-123"),
    null
  );
});
