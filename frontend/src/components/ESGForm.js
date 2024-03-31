import React from 'react';
import axios from 'axios'
import { useFormik } from 'formik';
import * as yup from "yup";
import {
  Box,
  Button,
  Card,
  CardBody,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  VStack,
  Radio,
  RadioGroup,
  Checkbox,
  FormErrorMessage
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom'

const validationSchema = yup.object().shape({
  verifier: yup.string().required('Verifier is required!'),
  assurance: yup.string(),
  disclosure: yup.mixed()
    .test("FILE SIZE", "File size is too large (max 2MB)", (value) => {
      if (!value) return true; // No file selected, so no validation needed
      return value.size <= 2 * 1024 * 1024; // Max file size: 2MB
    })
    .test("FILE TYPE", "Invalid file format. Only PDF and DOCX are allowed", (value) => {
      if (!value) return true; // No file selected, so no validation needed
      const supportedFormats = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      return supportedFormats.includes(value.type);
    }),
});


const initialValues = {
  verifier: '',
  standard: [],
  assurance: '',
  scope: [],
  disclosure: '',
  link: ''
}

const InputForm = () => {

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'radio') {
      formik.setFieldValue(name, value);
    } else if (type === 'checkbox') {
      formik.setFieldValue(name, checked ? [...formik.values[name], value] : formik.values[name].filter(item => item !== value));
    } else if (type === 'file') {
      formik.setFieldValue(name, files[0]);
    } else {
      formik.setFieldValue(name, value);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append('verifier', values.verifier);
      formData.append('standard', values.standard.join(','));
      formData.append('assurance', values.assurance);
      formData.append('scope', values.scope.join(','));
      formData.append('disclosure', values.disclosure);
      formData.append('link', values.link);

      const response = await axios.post("http://localhost:5000/submit", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      console.log(response.data);
      navigate('/score', {
        state: response.data
      });
    } catch (error) {
      console.error(error);
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmit
  });

  return (
    <Box>
      <Center>
        <Stack spacing='4'>
          <VStack as='header' spacing='6' mt='8'>
            <Heading as='h2'>Calculate ESG Score</Heading>
          </VStack>
          <form onSubmit={formik.handleSubmit}>
            <Card bg='#fffff' variant='outline' borderColor='#d8dee4' w='808px'>
              <CardBody>
                <Stack spacing='4'>
                  <Text as='b'>Question I : Emissions Data Verification</Text>
                  <Text fontSize='md'> Does the company obtain independent, third-party verification for its emissions data? If so, to what
                    level of assurance?
                  </Text>
                  <FormControl isRequired>
                    <FormLabel size='sm'>Verifier</FormLabel>
                    <RadioGroup name="verifier" value={formik.values.verifier} type="radio" onChange={(value) => formik.setFieldValue('verifier', value)}>
                      <Stack>
                        <Radio value='Yes'> Yes </Radio>
                        <Radio value='No'> No </Radio>
                      </Stack>
                    </RadioGroup>
                    {formik.errors.verifier ? <FormErrorMessage>{formik.errors.verifier}</FormErrorMessage> : null}
                  </FormControl>
                  <FormControl>
                    <FormLabel size='sm'>Verification Standard</FormLabel>
                    <Stack spacing={2} direction='column'>
                      <Checkbox
                        colorScheme='blue'
                        type="checkbox"
                        name="standard"
                        value="ISO 14064-3"
                        onChange={handleChange}>
                        ISO 14064-3
                      </Checkbox>
                      <Checkbox
                        colorScheme='blue'
                        type="checkbox"
                        name="standard"
                        value="ISO 14064-2"
                        onChange={handleChange}>
                        ISO 14064-2
                      </Checkbox>
                      <Checkbox
                        colorScheme='blue'
                        name="standard"
                        type="checkbox"
                        value="Other"
                        onChange={handleChange}
                      >
                        Other
                      </Checkbox>
                    </Stack>
                  </FormControl>
                  <FormControl>
                    <FormLabel size='sm'>Assurance Level</FormLabel>
                    <RadioGroup name="assurance" type="radio" value={formik.values.assurance} onChange={(value) => formik.setFieldValue('assurance', value)}>
                      <Stack>
                        <Radio value='Limited Assurance'> Limited Assurance </Radio>
                        <Radio value='Reasonable Assurance'> Reasonable Assurance </Radio>
                      </Stack>
                    </RadioGroup>
                  </FormControl>
                  <FormControl>
                    <FormLabel size='sm'>Scope Verified</FormLabel>
                    <Stack spacing={2} direction='column'>
                      <Checkbox
                        colorScheme='blue'
                        name="scope"
                        type="checkbox"
                        value="Scope 1"
                        onChange={handleChange}
                      >
                        Scope 1
                      </Checkbox>
                      <Checkbox
                        colorScheme='blue'
                        type="checkbox"
                        name="scope"
                        value="Scope 2"
                        onChange={handleChange}
                      >
                        Scope 2
                      </Checkbox>
                      <Checkbox
                        colorScheme='blue'
                        type="checkbox"
                        name="scope"
                        value="Scope 3"
                        onChange={handleChange}
                      >
                        Scope 3
                      </Checkbox>
                    </Stack>
                  </FormControl>
                  <FormControl>
                    <FormLabel size='sm'>Attach Document (PDF / Word)</FormLabel>
                    <input
                      type="file"
                      id="attachment"
                      name="disclosure"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => formik.setFieldValue("disclosure", e.target.files[0])} />
                    {formik.errors.disclosure ?
                      <p style={{ color: 'red' }}>{formik.errors.disclosure}</p> : null}
                    <Input
                      style={{ display: 'block', marginTop: '15px' }}
                      type="url"
                      id="link"
                      name="link"
                      placeholder="Paste link here"
                      value={formik.values.link}
                      onChange={handleChange} />
                  </FormControl>
                </Stack>
              </CardBody>
            </Card>
            <Button
              bg='#2da44e'
              color='white'
              size='md'
              marginTop='25px'
              type="submit"
              _hover={{ bg: '#2c974b' }}
              _active={{ bg: '#298e46' }}
            >
              Submit
            </Button>
          </form>
        </Stack>
      </Center>
    </Box>
  );
};

export default InputForm;
