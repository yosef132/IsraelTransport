import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import AppNavigator from './AppNavigator';

const App = () => (
  <AuthProvider>
    <AppNavigator />
  </AuthProvider>
);

export default App;
