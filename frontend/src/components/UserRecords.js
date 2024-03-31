import React, { useState, useEffect } from 'react'
import {
     Table,
     Thead,
     Tbody,
     Tr,
     Th,
     Td,
     TableContainer,
     Heading
   } from '@chakra-ui/react'

const Records = () => {

  const [recordData, setRecordData] = useState([]);
  
  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await fetch('http://localhost:5000/records');
        if (!response.ok) {
          throw new Error('Failed to fetch records');
        }
        const data = await response.json();
        console.log(data)
        setRecordData(data.items);
      } catch (error) {
        console.error('Error fetching score:', error);
      }
    };
    fetchRecord();
  }, []); 

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
     <Heading as="h3" style={{ marginBottom: '50px' }}>Records</Heading>
    <TableContainer>
    <Table variant='simple'>
    <Thead>
      <Tr>
        <Th>Verifier</Th>
        <Th>Standard</Th>
        <Th>Assurance</Th>
        <Th>Scope</Th>
        <Th>Disclosure</Th>
        <Th>Link</Th>
        <Th>Final Score</Th>
      </Tr>
    </Thead>
    <Tbody>
    {recordData.map((record) => (
        <Tr key={record._id}>
          <Td>{record.verifier}</Td>
          <Td>{record.standard}</Td>
          <Td>{record.assurance}</Td>
          <Td>{record.scope}</Td>
          <Td>{record.disclosure}</Td>
          <Td>{record.link}</Td>
          <Td>{record.score}</Td>
        </Tr>
      ))}
    </Tbody>
  </Table>
</TableContainer>
    </div>
  )
}

export default Records