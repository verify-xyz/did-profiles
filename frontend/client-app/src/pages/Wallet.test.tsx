import React from 'react';
import { render, screen } from '@testing-library/react';
import Wallet from './Wallet';

test('finds the button Connect to MetaMask', () => {
    render(<Wallet />);
    const buttonConnect = screen.getByText('Connect to MetaMask');
    expect(buttonConnect).toBeInTheDocument();
});

test('finds the button Disconnect', () => {
    render(<Wallet />);
    const buttonDisconnect = screen.getByText('Disconnect');
    expect(buttonDisconnect).toBeInTheDocument();
});

test('finds the button Sign', () => {
    render(<Wallet />);
    const buttonSign = screen.getByText('Personal Sign');
    expect(buttonSign).toBeInTheDocument();
});