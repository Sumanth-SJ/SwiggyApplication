import * as Yup from 'yup';
export const customerLoginValidation = Yup.object().shape({
    email:Yup.string()
          .email("Invaild Email!")
          .required("Email Required!"),
    password:Yup.string()
             .required("Password Required!")
})


export const emailValidation = Yup.object().shape({
      email:Yup.string()
      .email("Invaild Email!")
      .required("Email Required!"),  
})

export const otpValidation = Yup.object().shape({
      otp:Yup.string()
      .required("Otp required")
      .length(6,"Otp must be 6 digit") 
})

export const restaurantSignupSchema = Yup.object().shape({
      name: Yup.string().required("Required!"),
      email: Yup.string().required("Required").email("Invalid Email"),
      phoneNumber: Yup.string()
        .required("Required")
        .matches(/^\d{10}$/, "Phone number must be exactly 10 digits"),
      address: Yup.string().required("Required"),
      password: Yup.string().required("Required"),
      cpassword: Yup.string()
        .required("Required")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
})


export const deliverySignUpSchema = Yup.object().shape({
  name: Yup.string().required("Required!"),
      email: Yup.string().required("Required").email("Invalid Email"),
      phoneNumber: Yup.string()
        .required("Required")
        .matches(/^\d{10}$/, "Phone number must be exactly 10 digits"),
        vehicleNumber: Yup.string()
        .matches(/^[A-Z]{2}-\d{2}-[A-Z]{1}-\d{1,4}$/, "Invalid vehicle number format")
        .required("Required"),
      password: Yup.string().required("Required"),
      cpassword: Yup.string()
        .required("Required")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
})

export const foodItemValidationSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  image: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
  category: Yup.string().required("Required"),
  price: Yup.string()
    .matches(/^\d+(\.\d{1,2})?$/, "Price must be a valid number (e.g., 599 or 599.65)")
    .required("Required"),
  discount: Yup.number()
    .typeError("Discount must be a number") // Ensures non-numeric values are caught
    .min(0, "Discount must be at least 0")
    .max(100, "Discount cannot exceed 100")
    .required("Required"),
})


export const foodItemUpdateValidationSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  image: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
  category: Yup.string().required("Required"),
  price: Yup.string()
    .matches(/^\d+(\.\d{1,2})?$/, "Price must be a valid number (e.g., 599 or 599.65)")
    .required("Required"),
  discount: Yup.number()
    .typeError("Discount must be a number") // Ensures non-numeric values are caught
    .min(0, "Discount must be at least 0")
    .max(100, "Discount cannot exceed 100")
    .required("Required"),
  available : Yup.string().required("Required")
})

