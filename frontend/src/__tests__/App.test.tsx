import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders GameSite header', () => {
  render(<App />);
  const headerElement = screen.getByText(/GameSite/i);
  expect(headerElement).toBeInTheDocument();
});
