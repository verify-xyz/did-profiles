import React from 'react';
import { render, screen } from '@testing-library/react';
import Manage from './Manage';

jest.mock('ethr-did', () => {
    return jest.fn();
});

test('finds the button Change ownership', () => {
    render(<Manage />);
    const button = screen.getByText('Change ownership');
    expect(button).toBeInTheDocument();
});