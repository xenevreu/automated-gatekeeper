import logo from './logo.svg';
import './App.css';
import React from 'react'
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css';


function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user.attributes.email}</h1>
          <button onClick={signOut}>Sign out </button>
        </main>
      )}
    </Authenticator>
  );
}

export default App;
