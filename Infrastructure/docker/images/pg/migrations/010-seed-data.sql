INSERT INTO public.categories (id, name) VALUES ('eb4875d1-5135-437f-90e4-9a1688dbfb05', 'Eventos Musicais');
INSERT INTO public.categories (id, name) VALUES ('a9f345f9-6c83-4c18-bbb0-de30379ef488', 'Eventos Rurais');
INSERT INTO public.ticket_types (id, name) VALUES ('0158f389-ffdf-48b2-8c9c-8c5dc6f8fa2c', 'Ticket Normal');
INSERT INTO public.ticket_types (id, name) VALUES ('ad0e24d9-e2ee-4c57-80b5-bc4fc4b08d50', 'Ticket Vip');

INSERT INTO public.users (id, name, username, password, email, user_type) VALUES ('1c8a6a44-1293-4ea6-b2f7-f2c2ee6ff1a7', 'Organizer', 'Organizer', '$2a$11$iAVU4aUzi1GcrAuUqyRpveQ7v7T18LSBvbUxP637oZpXrjG12PvBG', 'Organizer@ipvc.pt', 'Organizer');
INSERT INTO public.users (id, name, username, password, email, user_type) VALUES ('593ab8df-d182-4ee0-b2aa-0cdac859dcb7', 'User', 'User', '$2a$11$saCZOgbr6FR6tppnBFoMPO5lg3ZBP2yON7kmVO8l1laDz5Zl3e7TW', 'User@ipvc.pt', 'User');
INSERT INTO public.users (id, name, username, password, email, user_type) VALUES ('ff378f8b-7656-488d-943b-68535cfbb884', 'Sérgio', 'admin', '$2a$11$GhFcFLuiB4ZS1pAlR4cijuosI6TBeaEZeRiLpJxLvkwweByViFZni', 'sergioserra@ipvc.pt', 'Admin');


INSERT INTO public.events (id, name, description, event_date, location, max_participants, created_by, category_id) VALUES ('924878c6-1e36-4b3c-9abe-b5250bb28785', 'Evento Musical ESTG', 'Evento Violino', '-infinity', 'ESTG', 10, '1c8a6a44-1293-4ea6-b2f7-f2c2ee6ff1a7', 'eb4875d1-5135-437f-90e4-9a1688dbfb05');


INSERT INTO public.tickets (id, event_id, ticket_type_id, price) VALUES ('8243ec89-051b-4f0c-a18f-f6c9d793c523', '924878c6-1e36-4b3c-9abe-b5250bb28785', '0158f389-ffdf-48b2-8c9c-8c5dc6f8fa2c', 5.00);
INSERT INTO public.tickets (id, event_id, ticket_type_id, price) VALUES ('16452c49-6659-4b33-ad74-901853dea9af', '924878c6-1e36-4b3c-9abe-b5250bb28785', 'ad0e24d9-e2ee-4c57-80b5-bc4fc4b08d50', 10.00);

INSERT INTO public.registrations_events (id, user_id, event_id) VALUES ('249d8176-691f-4568-8bc7-6d647775058b', '593ab8df-d182-4ee0-b2aa-0cdac859dcb7', '924878c6-1e36-4b3c-9abe-b5250bb28785');
INSERT INTO public.registrations_events (id, user_id, event_id) VALUES ('c8878b4a-5050-438f-b831-ec2662f7c92f', 'ff378f8b-7656-488d-943b-68535cfbb884', '924878c6-1e36-4b3c-9abe-b5250bb28785');

INSERT INTO public.registrations_activities (id, user_id, activity_id) VALUES ('d9dbd69c-6a82-435d-a7e8-5bbf4e169e02', '593ab8df-d182-4ee0-b2aa-0cdac859dcb7', 'bc6c88c9-eaf6-471c-a5a8-1fbf9d7cf2ce');
INSERT INTO public.registrations_activities (id, user_id, activity_id) VALUES ('af527171-954c-4568-a313-70d149d5a106', '593ab8df-d182-4ee0-b2aa-0cdac859dcb7', '67a27b27-a897-4058-8932-0baee0832ef3');
INSERT INTO public.registrations_activities (id, user_id, activity_id) VALUES ('9a27debd-f1c6-4c6a-92ca-74c43681fd63', 'ff378f8b-7656-488d-943b-68535cfbb884', 'bc6c88c9-eaf6-471c-a5a8-1fbf9d7cf2ce');


INSERT INTO public.activities (id, event_id, name, description) VALUES ('bc6c88c9-eaf6-471c-a5a8-1fbf9d7cf2ce', '924878c6-1e36-4b3c-9abe-b5250bb28785', 'Lache', 'Lanche Musical');
INSERT INTO public.activities (id, event_id, name, description) VALUES ('67a27b27-a897-4058-8932-0baee0832ef3', '924878c6-1e36-4b3c-9abe-b5250bb28785', 'Momento Musical', 'Concerto Musical');
