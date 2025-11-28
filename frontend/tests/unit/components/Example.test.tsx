import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// Simple example component for testing
function ExampleComponent({ message }: { message: string }) {
  return <div data-testid="example-message">{message}</div>;
}

describe('Example Component', () => {
  it('renders the provided message', () => {
    const testMessage = 'Hello, Testing!';
    render(<ExampleComponent message={testMessage} />);
    
    const element = screen.getByTestId('example-message');
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent(testMessage);
  });

  it('renders different messages correctly', () => {
    const anotherMessage = 'Another test message';
    render(<ExampleComponent message={anotherMessage} />);
    
    expect(screen.getByTestId('example-message')).toHaveTextContent(anotherMessage);
  });
});

