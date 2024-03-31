import  * as yup from "yup";

export const validationSchema = yup.object({
     verifier: yup.string().required('Verifier is required!'),
     verificationStandard: yup.string(),
     assuranceLevel: yup.string(),
     scopeVerified: yup.string(),
     disclosureLocation: yup.mixed()
     .test("FILE SIZE", "File size is too large (max 2MB)", (value) => value && value.size <= 2 * 1024 * 1024) // Max file size: 2MB
     .test("FILE TYPE", "Invalid file format. Only PDF and DOCX are allowed", (value) => {
          if (!value) return true; // No file selected, so no validation needed
          const supportedFormats = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
          return supportedFormats.includes(value.type);
        })
});