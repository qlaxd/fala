# Fala Farm Admin Mobile App Structure

This file documents the organization of the Fala Farm Admin Mobile Application, a companion tool for the Fala Farm website designed for farm administrators to manage livestock and auction activities.

## Directory Structure

```
Mobile/
├── src/                  # Source code folder
│   ├── api/              # API client and endpoints
│   │   ├── client.ts     # Base API client setup
│   │   ├── auth.ts       # Authentication API
│   │   ├── animals.ts    # Breeding animals API
│   │   ├── lots.ts       # Commercial lots API
│   │   └── auctions.ts   # Auction management API
│   ├── assets/           # Static assets (images, fonts, etc.)
│   ├── components/       # Reusable UI components
│   │   ├── common/       # Shared components used across features
│   │   ├── animals/      # Breeding animals specific components
│   │   ├── lots/         # Commercial lots specific components
│   │   └── auctions/     # Auction specific components
│   ├── hooks/            # Custom React hooks
│   │   ├── useAuth.ts    # Authentication hook
│   │   ├── useOffline.ts # Offline functionality hook
│   │   └── useApi.ts     # API communication hook
│   ├── navigation/       # Navigation configuration
│   │   ├── AppNavigator.tsx      # Main navigation container
│   │   ├── AuthNavigator.tsx     # Authentication flow
│   │   └── MainNavigator.tsx     # Main app navigation (tabs)
│   ├── screens/          # App screens organized by feature
│   │   ├── auth/         # Authentication screens (login, etc.)
│   │   ├── dashboard/    # Dashboard and overview screens
│   │   ├── animals/      # Breeding animals screens
│   │   ├── lots/         # Commercial lots screens
│   │   └── auctions/     # Auction management screens
│   ├── store/            # State management (Redux)
│   │   ├── index.ts      # Store configuration
│   │   ├── slices/       # Redux slices for different entities
│   │   └── middleware/   # Redux middleware (offline sync, etc.)
│   ├── types/            # TypeScript type definitions
│   │   ├── api.ts        # API response types
│   │   ├── entities.ts   # Data entity types
│   │   └── navigation.ts # Navigation param types
│   └── utils/            # Utility functions
│       ├── format.ts     # Formatting utilities
│       ├── validation.ts # Form validation helpers
│       └── storage.ts    # Local storage utilities
└── app/                  # Expo Router file-based routing
```

## Key Conventions

1. **Modular Structure**: Code is organized by feature to enhance maintainability.
2. **Component Reusability**: Common components are designed to be reusable across features.
3. **Type Safety**: TypeScript is used throughout for type checking and better developer experience.
4. **State Management**: Redux Toolkit is used for global state, with React Query for server state.
5. **Navigation**: Expo Router with file-based routing is used for navigation.
6. **Offline Support**: Redux Persist with AsyncStorage is used for offline functionality.

## Best Practices

1. Keep components small and focused on a single responsibility.
2. Use TypeScript interfaces for all data models.
3. Implement proper error handling in API calls.
4. Write unit tests for critical business logic.
5. Follow the Redux pattern for state management.
6. Ensure all UI components follow accessibility guidelines.
7. Document complex functionality with comments.
8. Implement proper form validation. 