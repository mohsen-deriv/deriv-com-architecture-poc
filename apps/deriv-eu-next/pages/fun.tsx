import { Button } from '@deriv-com/design-system';

const FunPage = () => {
  return (
    <Button
      onClick={() => {
        alert('design system button clicked');
      }}
    >
      This is a design system button
    </Button>
  );
};

export default FunPage;
