import React from 'react';
import { render, screen } from '@testing-library/react';
import Publish from './Publish';

jest.mock('ethr-did', () => {
    return jest.fn();
});

test('finds the button Publish', () => {
    render(<Publish />);
    const buttonPublish = screen.getByText('Publish');
    expect(buttonPublish).toBeInTheDocument();
});

test('finds the text Message', () => {
    render(<Publish />);
    const textMessage = screen.getByText('Message:');
    expect(textMessage).toBeInTheDocument();
});