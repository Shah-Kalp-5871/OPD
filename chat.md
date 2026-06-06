# OPD Chat System Documentation

This document outlines the architecture, components, and workflow of the real-time chat system implemented in the OPD system.

## Overview

The chat system is a hybrid solution that uses **REST APIs** for message persistence/retrieval and **WebSockets (Socket.io)** for real-time bi-directional communication. It is designed to support communication within specific branches/clinics (multi-tenant aware).

## 1. Backend Architecture (NestJS)

The backend is built with NestJS and utilizes Prisma ORM for database operations.

### `ChatModule` Components
- **`ChatController`** (`backend/src/chat/chat.controller.ts`):
  - Exposes two main REST endpoints secured by `JwtAuthGuard`:
    - `POST /chat`: Creates a new message.
    - `GET /chat`: Retrieves recent message history.
  - Automatically extracts the `branchId` from the request headers using the custom `@BranchId()` decorator to ensure multi-tenancy context.

- **`ChatService`** (`backend/src/chat/chat.service.ts`):
  - **`createMessage`**: 
    - Validates the `branchId` and resolves the associated `tenantId`.
    - Persists the message into the database via Prisma (`Message` model).
    - Looks up the sender's details (`firstName`, `lastName`, `role`) for frontend display formatting.
    - Triggers real-time broadcasting by calling the appropriate method on the `AppGateway` (e.g., `sendToUser` for direct messages, `broadcastToRoom` for rooms, or `broadcastGlobal` for general clinic chat).
  - **`getRecentMessages`**: 
    - Fetches the last 50 messages for the specific `tenantId` (ensuring data isolation between clinics).

### `WebSocketGateway`
- **`AppGateway`** (`backend/src/socket/app.gateway.ts`):
  - Uses the namespace `/medflow`.
  - Maintains a map of connected clients (`socketId` -> `userId`).
  - **Events Handled**:
    - `authenticate`: Binds the WebSocket connection to a specific `userId` and joins a private room (`user:${userId}`) for direct messaging.
    - `join-room`: Allows clients to join specific chat rooms.
  - **Broadcasting Methods**:
    - `broadcastToRoom(room, event, payload)`: Emits to a specific room.
    - `sendToUser(userId, event, payload)`: Emits to a specific user's private channel.
    - `broadcastGlobal(event, payload)`: Emits to all connected clients in the namespace.

## 2. Frontend Architecture (React / Next.js)

The frontend implements the chat as a persistent floating widget, accessible across different layouts.

### `ChatWidget` Component
- **Path**: `frontend/components/chat/ChatWidget.tsx`
- **State Management**:
  - Manages UI states: `isOpen`, `isMinimized`, `unreadCount`.
  - Maintains the `messages` array and the `currentUserId` (extracted from the JWT payload in `localStorage`).

- **Initialization Flow**:
  1. On mount, fetches the JWT token from `localStorage` to decode the `userId`.
  2. Calls the REST API (`GET /chat`) to load the historical messages and populates the view.
  3. Establishes a Socket.io connection to `${APP_CONFIG.API_BASE_URL}/medflow`.
  4. Upon successful connection, emits the `authenticate` event to register the user's socket session.

- **Message Receiving (Real-time)**:
  - Listens for the `new_message` event on the socket.
  - Appends incoming messages to the local state.
  - If the widget is closed, increments the `unreadCount` badge on the chat icon.
  - Automatically scrolls to the bottom of the message list when new messages arrive and the widget is open.

- **Message Sending**:
  - Instead of emitting via WebSockets, the frontend posts the message to the REST API (`POST /chat`). 
  - This guarantees the message is saved to the database first, and the backend handles the subsequent WebSocket broadcast to all relevant clients (including the sender).

## 3. Data Flow Summary (Sending a Message)

1. **User Action**: User types a message in the `ChatWidget` and hits send.
2. **REST Request**: Frontend makes an HTTP `POST` request to `/chat` with the message content and `branchId` header.
3. **Database Persistence**: `ChatService` saves the message to the DB with the associated `tenantId`.
4. **Backend Broadcast**: `ChatService` calls `AppGateway` to emit a `new_message` event over Socket.io.
5. **Frontend Update**: All connected clients (including the sender) receive the `new_message` socket event and update their UI in real-time.

> [!NOTE]
> The chat system currently uses a "Global" clinic-wide broadcast by default if `recipientId` or `roomId` is not provided in the payload. It strictly segregates data using the `tenantId` resolved from the user's `branchId`.
