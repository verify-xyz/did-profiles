import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../App.js';

jest.mock('../network/client-sign', () => {
    return jest.fn();
});

jest.mock('../network/network-utils', () => {
    return jest.fn();
});

test('Should render the toggle button', () => {
    render(<App />);
    const toggleButton = screen.getByTestId('toggle-button-checkbox');
    expect(toggleButton).toBeInTheDocument();
});

test('Should check the toggle button attribute', () => {
    render(<App />);
    const toggleButton = screen.getByTestId('toggle-button-checkbox');
    expect(toggleButton).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute('type', 'checkbox');
});
