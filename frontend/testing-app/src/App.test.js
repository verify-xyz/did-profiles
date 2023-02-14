import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./network/client-sign', () => {
    return jest.fn();
});

jest.mock('./network/network-utils', () => {
    return jest.fn();
});

test('renders application title', () => {
    render(<App />);
    const textElement = screen.getByText('DID Profiles Testing App');
    expect(textElement).toBeInTheDocument();
});
