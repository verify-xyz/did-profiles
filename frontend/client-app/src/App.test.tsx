import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('ethr-did', () => {
    return jest.fn();
});

test('renders application header - wallet', () => {
    render(<App />);
    const textElement = screen.getByText('Wallet');
    expect(textElement).toBeInTheDocument();
});

test('renders application header - publish', () => {
    render(<App />);
    const textElement = screen.getByText('Publish');
    expect(textElement).toBeInTheDocument();
});

test('renders application header - manage', () => {
    render(<App />);
    const textElement = screen.getByText('Manage');
    expect(textElement).toBeInTheDocument();
});

