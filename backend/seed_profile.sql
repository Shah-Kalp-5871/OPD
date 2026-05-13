INSERT INTO "AdminProfile" (id, "userId", notes)
VALUES ('123e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174000', 'Default administrator account')
ON CONFLICT ("userId") DO NOTHING;
