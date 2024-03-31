import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Heading, Text } from '@chakra-ui/react';

const ESGScore = () => {

  const location = useLocation();
  const { state } = location;
  
        function getResult(scaleLabel) {
          switch (scaleLabel) {
            case 'Minimal':
              return 'No third-party verification of emissions data.';
            case 'Developing':
              return 'Verification processes may exist but lack clear specification of assurance levels and only cover Scope 1.';
            case 'Robust':
              return 'Third-party verification with specified assurance level (limited or reasonable) and coverage of Scope 1.';
            case 'Exemplary':
              return 'Consistent external verification to a reasonable assurance level, based on an international standard and/or coverage of Scope 3.';
            default:
              return '';
          }
        }        

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <Heading as="h2">ESG Score</Heading>
      {state && (
        <>
          <h5>Calculated Score: {state.score}</h5>
          <h5>Scale: {state.scaleLabel}</h5>
          <Text variant="body">{getResult(state.scaleLabel)}</Text>
        </>
      )}
      <Link to="/" style={{ display: 'block', marginTop: '20px', color:'teal'  }}>
        Want to submit another response?
      </Link>
    </div>
  );
};

export default ESGScore;