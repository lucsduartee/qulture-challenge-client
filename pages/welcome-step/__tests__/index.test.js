import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WelcomeStep from '../index';

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

describe('WelcomeStep Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('matches snapshot', () => {
    const tree = render(<WelcomeStep />);
    expect(tree).toMatchSnapshot();
  });

  it('navigates to /company when the "Explorar" button is clicked', () => {
    render(<WelcomeStep />);

    const button = screen.getByText('Explorar');
    fireEvent.click(button);
    expect(screen.getByText('Explorar')).toBeInTheDocument();
  });
});