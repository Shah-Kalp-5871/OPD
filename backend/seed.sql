INSERT INTO "User" (id, name, email, password, role, "isActive", "createdAt", "updatedAt") 
VALUES ('123e4567-e89b-12d3-a456-426614174000', 'System Admin', 'admin@opd.com', '$2b$10$L9vM1n0D9F7z7/N/P9qS1.J6iKk8vJm8vJm8vJm8vJm8vJm8vJm', 'ADMIN', true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;
