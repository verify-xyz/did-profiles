import React from 'react';
import { render, screen } from '@testing-library/react';
import View from './View';

jest.mock('ethr-did', () => {
    return jest.fn();
});

test('finds the button Change ownership', () => {
    render(<View />);
    const button = screen.getByText('Change ownership');
    expect(button).toBeInTheDocument();
});

test('finds the label Transaction Hash', () => {
    render(<View />);
    const label = screen.getByTestId('labelTransactionHash');
    expect(label).toBeInTheDocument();
});